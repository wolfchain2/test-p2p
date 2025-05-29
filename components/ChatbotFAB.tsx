
import React from 'react';

const ChatbotFAB: React.FC = () => {
  const handleChatbotClick = () => {
    // In a real app, this would open a chat interface.
    // For now, it can use the Gemini service for a simple query.
    alert('Asistente IA P2P CASH activado (funcionalidad simulada).');
  };

  return (
    <button
      onClick={handleChatbotClick}
      title="Asistente IA P2P CASH"
      className="fixed bottom-6 right-6 bg-teal-600 hover:bg-teal-700 text-white w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-lg transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 z-[1000]"
    >
      <span role="img" aria-label="Chatbot icon">AI</span> {/* Replaced emoji for better cross-platform compatibility & styling */}
    </button>
  );
};

export default ChatbotFAB;
