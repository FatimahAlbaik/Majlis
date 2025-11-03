import React from 'react';
import { useApp } from '../hooks/useApp.ts';
import { AdminIcon } from './Icons.tsx';

export const Forbidden: React.FC = () => {
    const { setActiveView, translations: t } = useApp();

    return (
        <div className="flex flex-col items-center justify-center text-center min-h-[calc(100vh-220px)] bg-white rounded-lg shadow-md p-8">
            <AdminIcon className="w-16 h-16 text-red-400 mb-4" />
            <h1 className="text-3xl font-bold text-gray-800">{t.accessDenied}</h1>
            <p className="mt-2 text-gray-600">{t.accessDeniedMessage}</p>
            <button
                onClick={() => setActiveView('home')}
                className="mt-6 px-5 py-2 text-sm font-semibold text-white bg-accenture-purple rounded-md hover:bg-purple-700 transition-colors"
            >
                {t.goHome}
            </button>
        </div>
    );
};