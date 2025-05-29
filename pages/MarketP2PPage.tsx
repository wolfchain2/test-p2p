
import React, { useState, useEffect } from 'react';
// Removed useNavigate as direct navigation is replaced by modal.
// import { useNavigate } from 'react-router-dom';
import PageSection from '../components/PageSection';
import { MarketItem } from '../types';
import Modal from '../components/Modal'; // Import the generic Modal component
import {
  LOAN_REQUEST_PURPOSES, LOAN_REQUEST_AMOUNTS, LOAN_REQUEST_RISKS,
  FUNDING_OFFER_INTERESTS, FUNDING_OFFER_AMOUNTS, FUNDING_OFFER_RATES
} from '../constants';

// SVG Icon for success message
const CheckCircleIcon: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const MarketListItem: React.FC<{ item: MarketItem; onAction: (item: MarketItem) => void }> = ({ item, onAction }) => (
  <div className="border border-gray-200 p-4 rounded-md hover:shadow-lg transition-shadow bg-white">
    <p className="font-semibold text-gray-800">{item.user} - <span className="text-sm text-gray-500">{item.purpose}</span></p>
    <p className="my-1">
      Monto: <span className={`font-bold ${item.type === 'request' ? 'text-teal-600' : 'text-green-600'}`}>
        ${item.amount.toLocaleString('es-ES')}
      </span> - {item.type === 'request' ? 'Plazo:' : 'Tasa/Plazo:'} <span className="text-sm text-gray-700">{item.terms}</span>
    </p>
    {item.risk && <p className="text-xs text-gray-500">Riesgo IA: {item.risk}</p>}
    <button 
      onClick={() => onAction(item)}
      className={`mt-3 w-full sm:w-auto text-white text-sm py-2 px-4 rounded-md transition-colors ${
        item.type === 'request' 
          ? 'bg-green-500 hover:bg-green-600' 
          : 'bg-teal-500 hover:bg-teal-600'
      }`}
    >
      {item.type === 'request' ? 'Invertir en este préstamo' : 'Solicitar de esta oferta'}
    </button>
  </div>
);

const generateMarketItems = (count: number, type: 'request' | 'offer'): MarketItem[] => {
  const items: MarketItem[] = [];
  const validLoanRequestAmounts = LOAN_REQUEST_AMOUNTS.filter(amount => amount <= 100);

  for (let i = 1; i <= count; i++) {
    if (type === 'request') {
      const amount = validLoanRequestAmounts.length > 0 
        ? validLoanRequestAmounts[Math.floor(Math.random() * validLoanRequestAmounts.length)]
        : LOAN_REQUEST_AMOUNTS[Math.floor(Math.random() * LOAN_REQUEST_AMOUNTS.length)];

      items.push({
        id: `LR${i}`,
        user: `Prestatario P${String(i).padStart(3, '0')}`,
        purpose: LOAN_REQUEST_PURPOSES[Math.floor(Math.random() * LOAN_REQUEST_PURPOSES.length)],
        amount: amount,
        terms: `${Math.ceil(Math.random() * 3) + 1} semanas`, // 1 to 4 weeks
        risk: LOAN_REQUEST_RISKS[Math.floor(Math.random() * LOAN_REQUEST_RISKS.length)],
        type: 'request',
      });
    } else { 
      const amount = FUNDING_OFFER_AMOUNTS.length > 0
        ? FUNDING_OFFER_AMOUNTS[Math.floor(Math.random() * FUNDING_OFFER_AMOUNTS.length)]
        : 100; 

      items.push({
        id: `FO${i}`,
        user: `Inversionista I${String(i).padStart(3, '0')}`,
        purpose: `Interesado en ${FUNDING_OFFER_INTERESTS[Math.floor(Math.random() * FUNDING_OFFER_INTERESTS.length)]}`,
        amount: amount,
        terms: FUNDING_OFFER_RATES[Math.floor(Math.random() * FUNDING_OFFER_RATES.length)],
        type: 'offer',
      });
    }
  }
  return items;
};


const MarketP2PPage: React.FC = () => {
  const [loanRequests, setLoanRequests] = useState<MarketItem[]>([]);
  const [fundingOffers, setFundingOffers] = useState<MarketItem[]>([]);

  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [selectedMarketItem, setSelectedMarketItem] = useState<MarketItem | null>(null);
  const [actionModalPhase, setActionModalPhase] = useState<'details' | 'success'>('details');

  useEffect(() => {
    setLoanRequests(generateMarketItems(8, 'request')); // Reduced count for better demo
    setFundingOffers(generateMarketItems(8, 'offer'));  // Reduced count
  }, []);

  const handleOpenActionModal = (item: MarketItem) => {
    setSelectedMarketItem(item);
    setActionModalPhase('details');
    setIsActionModalOpen(true);
  };

  const handleCloseActionModal = () => {
    setIsActionModalOpen(false);
    setSelectedMarketItem(null);
    // Reset phase if needed, though 'details' is usually set on open
    setTimeout(() => setActionModalPhase('details'), 300); // Delay to allow modal close animation
  };

  const handleConfirmAction = () => {
    // In a real app, an API call would be made here.
    // For now, just switch to success phase.
    setActionModalPhase('success');
  };
  
  const getModalTitle = () => {
    if (!selectedMarketItem) return "Detalles";
    if (actionModalPhase === 'success') {
        return selectedMarketItem.type === 'request' ? "Inversión Confirmada" : "Solicitud Confirmada";
    }
    return selectedMarketItem.type === 'request' ? "Detalles del Préstamo" : "Detalles de la Oferta";
  };

  return (
    <PageSection
      title="Market P2P"
      intro="Explore solicitudes de préstamos y ofertas de financiamiento de nuestra comunidad."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div>
          <h3 className="text-2xl font-semibold mb-4 text-gray-700">Solicitudes de Préstamo</h3>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto bg-gray-100 p-4 rounded-lg shadow-inner">
            {loanRequests.length > 0 ? loanRequests.map(item => (
              <MarketListItem 
                key={item.id} 
                item={item} 
                onAction={handleOpenActionModal} 
              />
            )) : <p className="text-gray-500">No hay solicitudes de préstamo disponibles.</p>}
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-semibold mb-4 text-gray-700">Ofertas de Financiamiento</h3>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto bg-gray-100 p-4 rounded-lg shadow-inner">
            {fundingOffers.length > 0 ? fundingOffers.map(item => (
              <MarketListItem 
                key={item.id} 
                item={item} 
                onAction={handleOpenActionModal}
              />
            )) : <p className="text-gray-500">No hay ofertas de financiamiento disponibles.</p>}
          </div>
        </div>
      </div>

      {selectedMarketItem && (
        <Modal
          isOpen={isActionModalOpen}
          onClose={handleCloseActionModal}
          title={getModalTitle()}
          size="md"
        >
          {actionModalPhase === 'details' ? (
            <div className="space-y-4">
              <p><span className="font-semibold">Usuario/Inversionista:</span> {selectedMarketItem.user}</p>
              <p><span className="font-semibold">{selectedMarketItem.type === 'request' ? "Propósito del Préstamo:" : "Interés Principal:"}</span> {selectedMarketItem.purpose}</p>
              <p><span className="font-semibold">Monto:</span> <span className={`font-bold ${selectedMarketItem.type === 'request' ? 'text-teal-600' : 'text-green-600'}`}>${selectedMarketItem.amount.toLocaleString('es-ES')}</span></p>
              <p><span className="font-semibold">{selectedMarketItem.type === 'request' ? "Plazo:" : "Tasa y Plazo:"}</span> {selectedMarketItem.terms}</p>
              {selectedMarketItem.risk && <p><span className="font-semibold">Riesgo IA:</span> {selectedMarketItem.risk}</p>}
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={handleCloseActionModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cerrar
                </button>
                <button
                  onClick={handleConfirmAction}
                  className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors ${
                    selectedMarketItem.type === 'request' 
                      ? 'bg-green-500 hover:bg-green-600' 
                      : 'bg-teal-500 hover:bg-teal-600'
                  }`}
                >
                  {selectedMarketItem.type === 'request' ? 'Confirmar Inversión' : 'Confirmar Solicitud'}
                </button>
              </div>
            </div>
          ) : ( // actionModalPhase === 'success'
            <div className="text-center py-4 space-y-4">
              <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-3" />
              <h4 className="text-lg font-semibold text-gray-800">
                {selectedMarketItem.type === 'request' 
                  ? "¡Inversión realizada con éxito!" 
                  : "¡Solicitud de financiamiento realizada con éxito!"}
              </h4>
              <p className="text-sm text-gray-600">
                {selectedMarketItem.type === 'request'
                  ? `Has confirmado tu inversión de $${selectedMarketItem.amount.toLocaleString('es-ES')} en el préstamo para "${selectedMarketItem.purpose}".`
                  : `Has confirmado tu solicitud de financiamiento de $${selectedMarketItem.amount.toLocaleString('es-ES')} de la oferta de ${selectedMarketItem.user}.`
                }
              </p>
              <button
                onClick={handleCloseActionModal}
                className="mt-4 px-6 py-2 text-sm font-medium text-white bg-teal-500 rounded-md hover:bg-teal-600 transition-colors"
              >
                Aceptar y Cerrar
              </button>
            </div>
          )}
        </Modal>
      )}
    </PageSection>
  );
};

export default MarketP2PPage;
