
import React, { useState } from 'react';
import PageSection from '../components/PageSection';
import TabSwitcher from '../components/TabSwitcher';
import { RegistrationType } from '../types';

interface FormFieldProps {
  type: string;
  placeholder: string;
  name: string;
  required?: boolean;
  label?: string;
  options?: { value: string; label: string }[]; // For select
}

const FormField: React.FC<FormFieldProps> = ({ type, placeholder, name, required = false, label, options }) => (
  <div>
    {label && <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    {type === 'select' && options ? (
      <select
        name={name}
        id={name}
        required={required}
        className="w-full p-3 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 sm:text-sm shadow-sm"
      >
        <option value="">{placeholder}</option>
        {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
    ) : type === 'file' ? (
       <input 
        type={type} 
        name={name} 
        id={name}
        required={required} 
        className="w-full p-2 border border-gray-300 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 cursor-pointer"
      />
    ) : (
      <input
        type={type}
        placeholder={placeholder}
        name={name}
        id={name}
        required={required}
        className="w-full p-3 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 sm:text-sm shadow-sm"
      />
    )}
  </div>
);

const RegistrationForm: React.FC<{ type: RegistrationType }> = ({ type }) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    console.log(`Registro ${type}:`, data);
    alert(`Formulario de ${type} enviado (ver consola para datos).`);
    event.currentTarget.reset();
  };

  let fields: FormFieldProps[] = [];
  let submitText = "";
  let introText = "";
  let titleText = "";
  let buttonColor = "bg-teal-500 hover:bg-teal-600";

  switch (type) {
    case RegistrationType.Investor:
      titleText = "Registro para Inversionistas";
      introText = "Complete sus datos para comenzar a invertir y obtener rendimientos atractivos.";
      fields = [
        { type: 'text', placeholder: 'Nombre completo', name: 'fullName', required: true },
        { type: 'file', placeholder: '', name: 'idDocument', label: 'Escanear Documento de Identidad', required: true },
        { type: 'text', placeholder: 'Dirección', name: 'address', required: true },
        { type: 'email', placeholder: 'Correo electrónico', name: 'email', required: true },
        { type: 'text', placeholder: 'Cuenta bancaria (IBAN)', name: 'iban', required: true },
        { type: 'date', placeholder: 'Fecha de nacimiento', name: 'dob', required: true },
        { type: 'text', placeholder: 'Grado más alto de instrucción', name: 'educationLevel' },
        { type: 'number', placeholder: 'Año de graduación', name: 'graduationYear' },
      ];
      submitText = "Registrarme como Inversor";
      break;
    case RegistrationType.Borrower:
      titleText = "Registro para Prestatarios";
      introText = "Proporcione su información para acceder a préstamos rápidos y con condiciones justas.";
      fields = [
        { type: 'text', placeholder: 'Nombre completo', name: 'fullName', required: true },
        { type: 'file', placeholder: '', name: 'idDocument', label: 'Escanear Documento de Identidad', required: true },
        { type: 'text', placeholder: 'Dirección', name: 'address', required: true },
        { type: 'email', placeholder: 'Correo electrónico', name: 'email', required: true },
        { type: 'text', placeholder: 'Cuenta bancaria (para recibir préstamo)', name: 'bankAccount', required: true },
        { type: 'text', placeholder: 'Fiadores (opcional)', name: 'guarantors' },
        { type: 'date', placeholder: 'Fecha de nacimiento', name: 'dob', required: true },
        { type: 'text', placeholder: 'Bienes/Garantías (descripción)', name: 'assets' },
        { type: 'text', placeholder: 'Grado más alto de instrucción', name: 'educationLevel' },
        { type: 'number', placeholder: 'Año de graduación', name: 'graduationYear' },
        { type: 'number', placeholder: 'Carga familiar (dependientes)', name: 'dependents' },
        { type: 'text', placeholder: 'Préstamos recientes (descripción breve)', name: 'recentLoans' },
      ];
      submitText = "Registrarme como Prestatario";
      break;
    case RegistrationType.Premium:
      titleText = "Registro para Cuenta Premium";
      introText = "Acceda a beneficios exclusivos con nuestra cuenta Premium.";
      fields = [
        { type: 'text', placeholder: 'Nombre completo', name: 'fullName', required: true },
        { type: 'email', placeholder: 'Correo electrónico', name: 'email', required: true },
        { type: 'tel', placeholder: 'Teléfono', name: 'phone', required: true },
      ];
      submitText = "Obtener Cuenta Premium";
      buttonColor = "bg-amber-500 hover:bg-amber-600";
      break;
  }

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-700 mb-2">{titleText}</h3>
      <p className="text-sm text-gray-600 mb-6">{introText}</p>
      <form onSubmit={handleSubmit} className="space-y-5">
        {fields.map(field => <FormField key={field.name} {...field} />)}
        <button type="submit" className={`w-full text-white font-bold py-3 px-4 rounded-lg transition duration-150 ${buttonColor}`}>
          {submitText}
        </button>
      </form>
    </div>
  );
};

const RegistrationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>(RegistrationType.Investor);

  const tabs = [
    { id: RegistrationType.Investor, label: 'Soy Inversor', content: <RegistrationForm type={RegistrationType.Investor} /> },
    { id: RegistrationType.Borrower, label: 'Necesito Préstamo', content: <RegistrationForm type={RegistrationType.Borrower} /> },
    { id: RegistrationType.Premium, label: 'Cuenta Premium', content: <RegistrationForm type={RegistrationType.Premium} /> },
  ];

  return (
    <PageSection
      title="Registro en P2P CASH"
      intro="Únase a nuestra comunidad financiera inteligente. Elija su perfil y complete el formulario para comenzar."
    >
      <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-xl">
        <TabSwitcher 
            tabs={tabs} 
            activeTabId={activeTab} 
            onTabChange={setActiveTab}
            activeTabClassName="bg-teal-600 text-white border-b-2 border-teal-700"
            inactiveTabClassName="text-gray-500 hover:text-teal-600 hover:border-teal-500 border-b-2 border-transparent"
            navClassName="flex space-x-1 border-b border-gray-300 mb-6"
        />
      </div>
    </PageSection>
  );
};

export default RegistrationPage;
