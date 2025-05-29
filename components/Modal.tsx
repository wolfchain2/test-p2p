import React, { useState, useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const [isVisible, setIsVisible] = useState(false); // For controlling transition classes
  const [shouldRender, setShouldRender] = useState(false); // For DOM presence during exit animation

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Short delay to ensure initial (hidden) styles are applied before transitioning to visible
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 10); // Minimal delay
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false); // Start exit animation
      // Delay unmounting to allow exit animation to complete
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 350); // Should be slightly longer than transition duration (300ms)
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) {
    return null;
  }

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  };

  return (
    <div 
      className={`
        fixed inset-0 bg-black flex justify-center items-center z-[1001] p-4 
        transition-opacity duration-300 ease-out
        ${isVisible ? 'bg-opacity-60 backdrop-blur-sm opacity-100' : 'bg-opacity-0 opacity-0 pointer-events-none'}
      `}
    >
      <div 
        className={`
          bg-white p-5 sm:p-6 rounded-lg shadow-xl w-full ${sizeClasses[size]} relative 
          transform transition-all duration-300 ease-out
          ${isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-[-20px] pointer-events-none'}
        `}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>
        <div>{children}</div>
      </div>
      {/* Removed the <style jsx> block and animate-modal-appear class. 
          Animations are now handled by conditional Tailwind classes above. */}
    </div>
  );
};

export default Modal;
