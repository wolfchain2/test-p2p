
import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-gray-800 text-gray-300 py-8 text-center">
      <p>&copy; {currentYear} P2P CASH. Todos los derechos reservados.</p>
      <p className="text-sm">Una plataforma de préstamos P2P impulsada por Inteligencia Artificial.</p>
    </footer>
  );
};

export default Footer;
