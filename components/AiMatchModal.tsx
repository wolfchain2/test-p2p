import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import Spinner from './Spinner';
import { AIMatchProfile } from '../types';
import { getAIMatches } from '../services/geminiService'; 

// --- SVG Icons for internal animation ---
const CogIcon: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m18 0h-1.5m-15 0a7.5 7.5 0 1115 0m-15 0H3m18 0h-1.5m-15 0a7.5 7.5 0 1115 0m-15 0H3m18 0h-1.5M12 9.75v1.5m0-1.5V6M12 12.75v1.5m0-1.5V18m4.5-4.5H15m-1.5 0H9M15 12l1.5-1.5m0 0l1.5-1.5m-3 3l-1.5-1.5m0 0l-1.5-1.5m3 3l1.5 1.5m0 0l1.5 1.5m-3-3l-1.5 1.5m0 0l-1.5-1.5" />
    </svg>
);

const CheckCircleIcon: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
// --- End SVG Icons ---

interface AiMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  matchType: 'investor' | 'borrower'; 
}

const ProfileCard: React.FC<{ profile: AIMatchProfile; onInvest?: (profile: AIMatchProfile) => void; onSolicit?: (profile: AIMatchProfile) => void; matchType: 'investor' | 'borrower' }> = 
  ({ profile, onInvest, onSolicit, matchType }) => (
  <div className="border border-gray-200 p-4 my-3 rounded-lg bg-gray-50 shadow-sm hover:shadow-md transition-shadow">
    <p className="font-semibold text-teal-700">ID: {profile.id}</p>
    <p className="text-sm text-gray-600">
      {profile.profileType === 'investor' ? 'Nivel Inversor' : 'Riesgo Préstamo'}: <span className="font-medium">{profile.level}</span>
    </p>
    
    {profile.profileType === 'borrower_loan' && <p className="text-sm text-gray-600">Nivel de Riesgo: <span className="font-medium">{profile.risk}</span></p>}
    
    {matchType === 'borrower' && profile.profileType === 'investor' && (
      <>
        {profile.exactInvestmentAmount && (
          <p className="text-sm text-gray-600">
            Dispuesto a invertir: <span className="font-medium">${profile.exactInvestmentAmount.toLocaleString('es-ES')}</span>
          </p>
        )}
        {profile.preferredTerms && (
          <p className="text-sm text-gray-600">
            Términos preferidos: <span className="font-medium">{profile.preferredTerms.weeks} semanas con {(profile.preferredTerms.interestRate * 100).toFixed(0)}% de interés</span>
          </p>
        )}
      </>
    )}
    
    <p className="text-xs text-gray-500 mt-1">{profile.detail}</p>

    {matchType === 'investor' && profile.profileType === 'borrower_loan' && onInvest && (
      <button
        onClick={() => onInvest(profile)}
        className="mt-3 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-3 rounded-md text-sm transition duration-150"
      >
        Invertir en este Préstamo
      </button>
    )}
    {matchType === 'borrower' && profile.profileType === 'investor' && onSolicit && (
      <button
        onClick={() => onSolicit(profile)}
        className="mt-3 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-3 rounded-md text-sm transition duration-150"
      >
        Solicitar a este Inversionista
      </button>
    )}
  </div>
);


const AiMatchModal: React.FC<AiMatchModalProps> = ({ isOpen, onClose, matchType }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<AIMatchProfile[]>([]);
  const [error, setError] = useState<string | null>(null);

  // State for Borrower's solicitation animation
  const [solicitationPhase, setSolicitationPhase] = useState<'idle' | 'thinking' | 'success'>('idle');
  const [solicitedInvestorInfo, setSolicitedInvestorInfo] = useState<AIMatchProfile | null>(null);

  // State for Investor's investment animation
  const [investmentPhase, setInvestmentPhase] = useState<'idle' | 'thinking' | 'success'>('idle');
  const [investedLoanInfo, setInvestedLoanInfo] = useState<AIMatchProfile | null>(null);


  const modalTitle = matchType === 'investor' 
    ? 'Buscando Préstamos con IA...' 
    : 'Buscando Inversionistas con IA...';

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setResults([]);
      setError(null);
      setSolicitationPhase('idle'); 
      setSolicitedInvestorInfo(null);
      setInvestmentPhase('idle');
      setInvestedLoanInfo(null);
      
      getAIMatches(matchType)
        .then((data) => {
          setResults(data);
        })
        .catch((err) => {
          console.error("AI Match Error:", err);
          setError(err.message || "Error al buscar coincidencias. Intente de nuevo.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isOpen, matchType]);

  const handleInvestInLoan = (loanProfile: AIMatchProfile) => {
    setInvestedLoanInfo(loanProfile);
    setInvestmentPhase('thinking');

    setTimeout(() => {
      setInvestmentPhase('success');
    }, 1500); // Thinking phase for 1.5 seconds

    setTimeout(() => {
      setInvestmentPhase('idle');
      setInvestedLoanInfo(null);
      onClose(); // Close the main AiMatchModal
    }, 7000); // Total animation time 7 seconds
  };

  const handleSolicitInvestor = (investorProfile: AIMatchProfile) => {
    setSolicitedInvestorInfo(investorProfile);
    setSolicitationPhase('thinking');

    setTimeout(() => {
      setSolicitationPhase('success');
    }, 1500); // Thinking phase for 1.5 seconds

    setTimeout(() => {
      setSolicitationPhase('idle');
      setSolicitedInvestorInfo(null);
      onClose(); // Close the main AiMatchModal
    }, 7000); // Total animation time 7 seconds
  };
  
  const renderSolicitationContent = () => {
    if (solicitationPhase === 'thinking') {
      return (
        <div className="text-center py-8">
          <CogIcon className="w-16 h-16 text-teal-500 mx-auto animate-spin mb-5" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Enviando Solicitud...</h3>
          <p className="text-gray-600 text-sm">Conectando con el inversionista {solicitedInvestorInfo?.id}.</p>
        </div>
      );
    }
    if (solicitationPhase === 'success' && solicitedInvestorInfo) {
      return (
        <div className="text-center py-8">
          <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-green-700 mb-3">
            ¡Préstamo Solicitado Exitosamente!
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            Tu solicitud ha sido enviada al inversionista {solicitedInvestorInfo.id}.
          </p>
          <button
            onClick={onClose}
            className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-150"
          >
            Aceptar
          </button>
        </div>
      );
    }
    return null; 
  };
  
  const renderInvestmentContent = () => {
    if (investmentPhase === 'thinking') {
      return (
        <div className="text-center py-8">
          <CogIcon className="w-16 h-16 text-teal-500 mx-auto animate-spin mb-5" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Procesando Inversión...</h3>
          <p className="text-gray-600 text-sm">Registrando su inversión en el préstamo {investedLoanInfo?.id}.</p>
        </div>
      );
    }
    if (investmentPhase === 'success' && investedLoanInfo) {
      return (
        <div className="text-center py-8">
          <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-green-700 mb-3">
            ¡Inversión Realizada con Éxito!
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            Has invertido en el préstamo {investedLoanInfo.id}.
          </p>
          <button
            onClick={onClose}
            className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-150"
          >
            Aceptar
          </button>
        </div>
      );
    }
    return null;
  };


  const mainContent = () => (
     <>
        {isLoading && <Spinner />}
        {!isLoading && error && (
          <div className="text-red-500 bg-red-100 p-3 rounded-md text-center">
            {error}
          </div>
        )}
        {!isLoading && !error && results.length === 0 && (
          <p className="text-gray-600 text-center">No se encontraron coincidencias por el momento.</p>
        )}
        {!isLoading && !error && results.length > 0 && (
          <div>
            <h4 className="text-lg font-medium mt-2 mb-3 text-gray-700">Mejores Coincidencias:</h4>
            <div className="max-h-80 overflow-y-auto pr-2">
              {results.map((profile) => (
                <ProfileCard 
                  key={profile.id} 
                  profile={profile} 
                  onInvest={matchType === 'investor' && profile.profileType === 'borrower_loan' ? handleInvestInLoan : undefined}
                  onSolicit={matchType === 'borrower' && profile.profileType === 'investor' ? handleSolicitInvestor : undefined}
                  matchType={matchType}
                />
              ))}
            </div>
          </div>
        )}
      </>
  );


  return (
    <Modal 
        isOpen={isOpen} 
        onClose={() => {
            // Prevent closing if an internal animation is active, it will close itself.
            if (solicitationPhase === 'idle' && investmentPhase === 'idle') {
                onClose();
            }
        }} 
        title={isLoading ? modalTitle : "Coincidencias Encontradas por IA"}
    >
      {solicitationPhase !== 'idle' ? renderSolicitationContent() :
       investmentPhase !== 'idle' ? renderInvestmentContent() :
       mainContent()
      }
    </Modal>
  );
};

export default AiMatchModal;