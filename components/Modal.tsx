import React, { ReactNode } from 'react';
import { XCircleIcon } from './Icons.tsx';
import { useApp } from '../hooks/useApp.ts';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ title, onClose, children }) => {
  const { direction } = useApp();
  
  return (
    <div 
      className="fixed inset-0 bg-slate-900 bg-opacity-50 z-50 flex justify-center items-center p-4 backdrop-blur-sm"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-lg w-full max-w-2xl transform transition-all animate-fade-in"
        dir={direction}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-slate-200">
          <h2 id="modal-title" className="text-lg font-semibold text-slate-800">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors duration-200">
            <XCircleIcon className="w-6 h-6" />
            <span className="sr-only">Close modal</span>
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};