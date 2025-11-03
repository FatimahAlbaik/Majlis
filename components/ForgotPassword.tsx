import React, { useState } from 'react';
import { useApp } from '../hooks/useApp.ts';
import { LogoIcon, ArrowLeftIcon } from './Icons.tsx';

export const ForgotPassword: React.FC = () => {
    const { requestPasswordReset, setActiveView, translations: t, direction } = useApp();
    const [email, setEmail] = useState('');

    const handleResetRequest = (e: React.FormEvent) => {
        e.preventDefault();
        requestPasswordReset(email);
    };

    return (
        <div className="min-h-screen auth-bg flex flex-col py-12" dir={direction}>
            <div className="w-full max-w-md m-4 mx-auto">
                <div className="text-center mb-8">
                    <LogoIcon className="mx-auto h-12 w-auto" />
                </div>
                <div className="p-8 space-y-6 bg-white rounded-xl shadow-lg">
                     <div className="text-center">
                        <h2 className="text-2xl font-bold text-slate-900">{t.resetYourPassword}</h2>
                    </div>
                    <form onSubmit={handleResetRequest} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700">{t.emailAddress}</label>
                            <input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light sm:text-sm"
                            />
                        </div>
                        <div>
                            <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light transition-all duration-200 transform hover:-translate-y-0.5">
                               {t.sendResetLink}
                            </button>
                        </div>
                    </form>
                    <p className="text-center text-sm text-slate-600">
                        <button onClick={() => setActiveView('signIn')} className="font-medium text-primary hover:text-primary-dark transition-colors duration-200 flex items-center justify-center w-full">
                            <ArrowLeftIcon className="me-2 rtl:me-0 rtl:ms-2" />
                            {t.backToSignIn}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};