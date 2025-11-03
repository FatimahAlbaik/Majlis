import React, { useState } from 'react';
import { useApp } from '../hooks/useApp.ts';
import { LogoIcon } from './Icons.tsx';

export const SignIn: React.FC = () => {
    const { signIn, setActiveView, translations: t, direction } = useApp();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSignIn = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        const result = signIn(email, password);
        if (result !== true) {
            setError(t[result] || t.invalidCredentials);
        }
    };

    return (
        <div className="min-h-screen auth-bg flex flex-col py-12" dir={direction}>
            <div className="w-full max-w-md m-4 mx-auto">
                <div className="text-center mb-8">
                    <LogoIcon className="mx-auto h-12 w-auto" />
                </div>
                <div className="p-8 space-y-6 bg-white rounded-xl shadow-lg">
                    <h2 className="text-2xl font-bold text-slate-900 text-center">{t.signIn}</h2>
                    <form onSubmit={handleSignIn} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700">{t.emailAddress}</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light sm:text-sm transition-shadow duration-200"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700">{t.password}</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light sm:text-sm transition-shadow duration-200"
                            />
                        </div>
                        <div className="text-right rtl:text-left text-sm">
                            <button type="button" onClick={() => setActiveView('forgotPassword')} className="font-medium text-primary hover:text-primary-dark transition-colors duration-200">
                               {t.forgotPassword}
                            </button>
                        </div>

                        {error && (
                            <div className="text-sm text-red-700 bg-red-50 p-3 rounded-lg text-center">
                                {error}
                            </div>
                        )}

                        <div>
                            <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light transition-all duration-200 transform hover:-translate-y-0.5">
                                {t.signIn}
                            </button>
                        </div>
                    </form>
                    <p className="text-center text-sm text-slate-600">
                        {t.dontHaveAccount}{' '}
                        <button onClick={() => setActiveView('signUp')} className="font-medium text-primary hover:text-primary-dark transition-colors duration-200">
                            {t.signUp}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};