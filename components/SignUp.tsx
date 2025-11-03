import React, { useState } from 'react';
import { useApp } from '../hooks/useApp.ts';
import { LogoIcon } from './Icons.tsx';
import { Role } from '../types.ts';

export const SignUp: React.FC = () => {
    const { signUp, setActiveView, translations: t, direction } = useApp();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState<Role>(Role.Student);
    const [error, setError] = useState<string | null>(null);

    const validatePassword = (pass: string): boolean => {
        const hasUpperCase = /[A-Z]/.test(pass);
        const hasLowerCase = /[a-z]/.test(pass);
        const hasNumber = /\d/.test(pass);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
        return pass.length >= 8 && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
    };

    const handleSignUp = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError(t.passwordsNoMatch);
            return;
        }

        if (!validatePassword(password)) {
            setError(t.passwordRule);
            return;
        }

        const result = signUp(name, email, password, role);
        if (result !== true) {
            setError(t[result] || t.emailInUse);
        }
    };

    return (
        <div className="min-h-screen auth-bg flex flex-col py-12" dir={direction}>
            <div className="w-full max-w-md m-4 mx-auto">
                 <div className="text-center mb-8">
                    <LogoIcon className="mx-auto h-12 w-auto" />
                </div>
                <div className="p-8 space-y-6 bg-white rounded-xl shadow-lg">
                    <h2 className="text-2xl font-bold text-slate-900 text-center">{t.signUp}</h2>
                    <form onSubmit={handleSignUp} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700">{t.fullName}</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                autoComplete="name"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mt-1 block w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light sm:text-sm transition-shadow duration-200"
                            />
                        </div>
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
                            <label htmlFor="role" className="block text-sm font-medium text-slate-700">{t.role}</label>
                             <select
                                id="role"
                                value={role}
                                onChange={(e) => setRole(e.target.value as Role)}
                                className="mt-1 block w-full pl-3 pr-10 py-2.5 text-base border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-light sm:text-sm rounded-lg"
                            >
                                <option value={Role.Student}>{t.STUDENT}</option>
                                <option value={Role.Member}>{t.MEMBER}</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700">{t.password}</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light sm:text-sm transition-shadow duration-200"
                            />
                        </div>
                        <div>
                            <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-700">{t.confirmPassword}</label>
                            <input
                                id="confirm-password"
                                name="confirm-password"
                                type="password"
                                autoComplete="new-password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="mt-1 block w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light sm:text-sm transition-shadow duration-200"
                            />
                        </div>
                         <p className="text-xs text-slate-500 pt-1">{t.passwordRule}</p>
                        
                        {error && (
                            <div className="text-sm text-red-700 bg-red-50 p-3 rounded-lg text-center">
                                {error}
                            </div>
                        )}

                        <div className="pt-2">
                            <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light transition-all duration-200 transform hover:-translate-y-0.5">
                                {t.signUp}
                            </button>
                        </div>
                    </form>
                    <p className="text-center text-sm text-slate-600">
                        {t.alreadyHaveAccount}{' '}
                        <button onClick={() => setActiveView('signIn')} className="font-medium text-primary hover:text-primary-dark transition-colors duration-200">
                            {t.signIn}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};