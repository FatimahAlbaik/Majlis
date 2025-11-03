import React, { useState } from 'react';
import { useApp } from '../hooks/useApp.ts';
import { LogoIcon } from './Icons.tsx';

interface ResetPasswordProps {
  token: string;
}

export const ResetPassword: React.FC<ResetPasswordProps> = ({ token }) => {
    const { resetPassword, addToast, translations: t, direction } = useApp();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const validatePassword = (pass: string): boolean => {
        const hasUpperCase = /[A-Z]/.test(pass);
        const hasLowerCase = /[a-z]/.test(pass);
        const hasNumber = /\d/.test(pass);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
        return pass.length >= 8 && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
    };

    const handleReset = (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            addToast(t.passwordsNoMatch, 'error');
            return;
        }
         if (!validatePassword(password)) {
            addToast(t.passwordRule, 'error');
            return;
        }
        resetPassword(token, password);
    };

    return (
        <div className="min-h-screen auth-bg flex flex-col py-12" dir={direction}>
             <div className="w-full max-w-md m-4 mx-auto">
                 <div className="text-center mb-8">
                    <LogoIcon className="mx-auto h-12 w-auto" />
                </div>
                <div className="p-8 space-y-4 bg-white rounded-xl shadow-lg">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-slate-900">{t.resetYourPassword}</h2>
                    </div>
                    <form onSubmit={handleReset} className="space-y-4">
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700">{t.newPassword}</label>
                            <input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-700">{t.confirmPassword}</label>
                            <input
                                id="confirm-password"
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                               className="mt-1 block w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light sm:text-sm"
                            />
                        </div>
                        <p className="text-xs text-slate-500">{t.passwordRule}</p>
                        <div className="pt-2">
                            <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-primary hover:bg-primary-dark transition-all duration-200 transform hover:-translate-y-0.5">
                                {t.saveChanges}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};