import React from 'react';
import { useApp } from '../hooks/useApp.ts';
import { CheckCircleIcon, XCircleIcon } from './Icons.tsx';

export const ToastContainer: React.FC = () => {
  const { toasts, direction } = useApp();

  return (
    <div
      aria-live="assertive"
      className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start z-50"
    >
      <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            dir={direction}
            className="max-w-sm w-full bg-white shadow-lg rounded-xl pointer-events-auto ring-1 ring-slate-900/5 overflow-hidden animate-fade-in"
          >
            <div className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {toast.type === 'success' ? (
                    <CheckCircleIcon className="h-6 w-6 text-secondary" />
                  ) : (
                    <XCircleIcon className="h-6 w-6 text-danger" />
                  )}
                </div>
                <div className="ms-3 w-0 flex-1 pt-0.5">
                  <p className="text-sm font-medium text-slate-900">{toast.message}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};