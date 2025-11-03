import React, { useState, useRef, useEffect } from 'react';
import { UploadIcon, UserIcon } from './Icons.tsx';
import { useApp } from '../hooks/useApp.ts';

export const Profile: React.FC = () => {
    const { session, addToast, translations: t, updateUserProfile } = useApp();
    
    // session is guaranteed by role-based routing in App.tsx
    const currentUser = session!;

    const [name, setName] = useState(currentUser.name);
    const [bio, setBio] = useState(currentUser.bio || '');
    const [avatarPreview, setAvatarPreview] = useState<string | null>(currentUser.avatarUrl || null);
    const [cvFileName, setCvFileName] = useState<string | null>(currentUser.cvUrl ? currentUser.cvUrl.split('/').pop() || null : null);
    
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const cvInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setName(currentUser.name);
        setBio(currentUser.bio || '');
        setAvatarPreview(currentUser.avatarUrl || null);
        setCvFileName(currentUser.cvUrl ? currentUser.cvUrl.split('/').pop() || null : null);
    }, [currentUser]);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/jpeg') && !file.type.startsWith('image/png')) {
            addToast(t.invalidImageType, 'error');
            return;
        }
        if (file.size > 2 * 1024 * 1024) { // 2MB limit
            addToast(`${t.fileTooLargeGeneric} (Max 2MB)`, 'error');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const dataUrl = reader.result as string;
            setAvatarPreview(dataUrl); 
            updateUserProfile(currentUser.id, { avatarUrl: dataUrl });
            addToast(t.updateAvatarSuccess, 'success');
        };
        reader.readAsDataURL(file);
    };
    
    const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        if (file.type !== 'application/pdf') {
            addToast(t.invalidPdfType, 'error');
            return;
        }
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
            addToast(`${t.fileTooLargeGeneric} (Max 10MB)`, 'error');
            return;
        }

        const mockUrl = `/uploads/${file.name}`;
        setCvFileName(file.name);
        updateUserProfile(currentUser.id, { cvUrl: mockUrl });
        addToast(t.uploadCVSuccess, 'success');
    };

    const handleSaveChanges = () => {
        updateUserProfile(currentUser.id, { name, bio });
        addToast(t.profileUpdateSuccess, 'success');
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-800 mb-6">{t.yourProfile}</h1>
            <div className="bg-white p-6 rounded-xl shadow">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Avatar Section */}
                    <div className="flex flex-col items-center space-y-4">
                        <div className="relative">
                            {avatarPreview ? (
                                <img src={avatarPreview} alt={currentUser.name} className="w-36 h-36 rounded-full ring-4 ring-primary/20 object-cover" />
                            ) : (
                                <div className="w-36 h-36 rounded-full ring-4 ring-primary/20 bg-slate-200 flex items-center justify-center">
                                    <UserIcon className="w-20 h-20 text-slate-500" />
                                </div>
                            )}
                             <button onClick={() => avatarInputRef.current?.click()} className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 border border-slate-200 shadow hover:bg-slate-100 transition-all duration-200 transform hover:scale-110">
                                <UploadIcon className="w-5 h-5 text-primary" />
                             </button>
                        </div>
                        <input type="file" ref={avatarInputRef} onChange={handleAvatarChange} className="hidden" accept="image/png, image/jpeg" />
                        <div className="text-center">
                            <h2 className="text-xl font-bold text-slate-800">{name}</h2>
                            <p className="text-sm text-slate-500">{currentUser.email}</p>
                        </div>
                    </div>

                    {/* Profile Form */}
                    <div className="md:col-span-2 space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-600">{t.fullName}</label>
                            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-slate-600">{t.role}</label>
                            <input type="text" id="role" value={t[currentUser.role] || currentUser.role} disabled className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm bg-slate-100 text-slate-600 sm:text-sm cursor-not-allowed" />
                        </div>
                        <div>
                            <label htmlFor="bio" className="block text-sm font-medium text-slate-600">{t.bio}</label>
                            <textarea id="bio" rows={3} value={bio} onChange={(e) => setBio(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light sm:text-sm" placeholder={t.bioPlaceholder}></textarea>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-slate-600">{t.cv}</label>
                            <div onClick={() => cvInputRef.current?.click()} className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer hover:border-primary transition-colors duration-200 bg-slate-50 hover:bg-primary/5">
                                <div className="space-y-1 text-center">
                                    <UploadIcon className="mx-auto h-10 w-10 text-slate-400" />
                                    <div className="flex text-sm text-slate-600">
                                         <span className="font-medium text-primary hover:text-primary-dark">
                                            <span>{cvFileName ? cvFileName : t.uploadYourCV}</span>
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500">{t.pdfUpTo10MB}</p>
                                </div>
                            </div>
                            <input type="file" ref={cvInputRef} onChange={handleCvChange} className="hidden" accept="application/pdf" />
                        </div>

                        <div className="text-right rtl:text-left">
                             <button onClick={handleSaveChanges} className="px-6 py-2.5 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary-dark transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
                                {t.saveChanges}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};