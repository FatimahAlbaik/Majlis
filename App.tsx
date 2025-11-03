import React from 'react';
import { useApp } from './hooks/useApp.ts';
import { SignIn } from './components/SignIn.tsx';
import { SignUp } from './components/SignUp.tsx';
import { ForgotPassword } from './components/ForgotPassword.tsx';
import { ResetPassword } from './components/ResetPassword.tsx';
import { Home } from './components/Home.tsx';
import { MCQGenerator } from './components/MCQGenerator.tsx';
import { Chatbot } from './components/Chatbot.tsx';
import { Profile } from './components/Profile.tsx';
import { Feedback } from './components/Feedback.tsx';
import { Admin } from './components/Admin.tsx';
import { Students } from './components/Students.tsx';
import { Forbidden } from './components/Forbidden.tsx';
import { ToastContainer } from './components/Toast.tsx';
import { HomeIcon, MCQIcon, ChatIcon, FeedbackIcon, AdminIcon, ProfileIcon, SignOutIcon, LanguageIcon, UserIcon, StudentsIcon, LogoIcon } from './components/Icons.tsx';
import { Role } from './types.ts';

const App: React.FC = () => {
    const {
        session,
        activeView,
        setActiveView,
        signOut,
        translations: t,
        direction,
        language,
        setLanguage,
        passwordResetToken
    } = useApp();

    const toggleLanguage = () => {
        const newLang = language === 'en' ? 'ar' : 'en';
        setLanguage(newLang);
        document.documentElement.lang = newLang;
        document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    };
    
    const isAuthView = ['signIn', 'signUp', 'forgotPassword', 'resetPassword'].includes(activeView);

    const renderView = () => {
        // Handle views for non-authenticated users first
        if (!session) {
            switch (activeView) {
                case 'signIn': return <SignIn />;
                case 'signUp': return <SignUp />;
                case 'forgotPassword': return <ForgotPassword />;
                case 'resetPassword': return passwordResetToken ? <ResetPassword token={passwordResetToken} /> : <SignIn />;
                case 'home': return <Home />;
                case 'mcq': return <MCQGenerator />;
                case 'chatbot': return <Chatbot />;
                default: return <SignIn />;
            }
        }

        // Handle views for authenticated users
        switch (activeView) {
            case 'home': return <Home />;
            case 'mcq': return <MCQGenerator />;
            case 'chatbot': return <Chatbot />;
            case 'profile': return <Profile />;
            case 'feedback':
                if ([Role.Student, Role.Member, Role.Admin].includes(session.role)) {
                    return <Feedback />;
                }
                return <Forbidden />;
            case 'students':
                 if ([Role.Member, Role.Admin].includes(session.role)) {
                    return <Students />;
                }
                return <Forbidden />;
            case 'admin':
                if (session.role === Role.Admin) {
                    return <Admin />;
                }
                return <Forbidden />;
            case 'signIn': case 'signUp': case 'forgotPassword': case 'resetPassword':
                return <Home />;
            default:
                return <Home />;
        }
    };

    const NavItem: React.FC<{ view: string; icon: React.ReactNode; label: string }> = ({ view, icon, label }) => (
        <button
            onClick={() => setActiveView(view)}
            className={`flex items-center w-full text-left px-4 py-2.5 rounded-lg font-semibold transition-all duration-200 relative group ${
                activeView === view
                ? 'bg-primary/90 text-white shadow-md'
                : 'text-slate-500 hover:bg-slate-200 hover:text-slate-800'
            }`}
        >
            {icon}
            <span className="ms-3">{label}</span>
        </button>
    );
    
    if (!session && isAuthView) {
        return (
            <div className="bg-slate-50 min-h-screen font-sans" dir={direction}>
                <ToastContainer />
                {renderView()}
            </div>
        )
    }

    return (
        <div className="bg-slate-50 min-h-screen font-sans" dir={direction}>
            <ToastContainer />
            <div className="flex">
                <aside className="w-64 bg-white h-screen fixed top-0 left-0 rtl:left-auto rtl:right-0 border-r border-slate-200 rtl:border-r-0 rtl:border-l flex flex-col p-4">
                    <div className="px-2 mb-8 shrink-0">
                        <LogoIcon />
                    </div>
                    <nav className="flex-grow space-y-2 overflow-y-auto pb-4">
                        <NavItem view="home" icon={<HomeIcon />} label={t.home} />
                        <NavItem view="mcq" icon={<MCQIcon />} label={t.mcqGenerator} />
                        <NavItem view="chatbot" icon={<ChatIcon />} label={t.chatbot} />
                        
                        {session && (
                           <>
                            <NavItem view="feedback" icon={<FeedbackIcon />} label={t.feedback} />
                             {[Role.Member, Role.Admin].includes(session.role) && (
                                <NavItem view="students" icon={<StudentsIcon />} label={t.students} />
                             )}
                           </>
                        )}
                        {session?.role === Role.Admin && (
                             <NavItem view="admin" icon={<AdminIcon />} label={t.admin} />
                        )}
                    </nav>
                     <div className="mt-auto shrink-0">
                        {session ? (
                             <div className="p-2">
                                <div className="flex items-center p-2 rounded-xl hover:bg-slate-100 transition-colors duration-200 cursor-pointer" onClick={() => setActiveView('profile')}>
                                    {session.avatarUrl ? (
                                        <img src={session.avatarUrl} alt={session.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/50" />
                                     ) : (
                                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                                            <UserIcon className="w-6 h-6 text-slate-500" />
                                        </div>
                                     )}
                                    <div className="ms-3">
                                        <p className="font-bold text-sm text-slate-800">{session.name}</p>
                                        <p className="text-xs text-slate-500">{t[session.role]}</p>
                                    </div>
                                </div>
                                <div className="mt-4 space-y-2 border-t border-slate-200 pt-4">
                                     <button onClick={signOut} className="flex items-center w-full text-sm font-semibold text-slate-500 hover:text-danger transition-colors duration-200 px-2 py-1">
                                         <SignOutIcon className="w-5 h-5 me-2"/> {t.signOut}
                                     </button>
                                </div>
                             </div>
                        ) : (
                            <div className="space-y-2 border-t border-slate-200 pt-4">
                                <button onClick={() => setActiveView('signIn')} className="w-full text-center px-4 py-2.5 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary-dark transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5">{t.signIn}</button>
                                <button onClick={() => setActiveView('signUp')} className="w-full text-center px-4 py-2.5 text-sm font-semibold text-slate-700 bg-slate-200 rounded-lg hover:bg-slate-300 transition-colors duration-200">{t.signUp}</button>
                            </div>
                        )}
                    </div>
                     <footer className="shrink-0 pt-4 text-center text-xs text-slate-400">
                        {t.footerText.replace('{year}', new Date().getFullYear().toString())}
                    </footer>
                </aside>
                <main className="flex-1 ml-64 rtl:ml-0 rtl:mr-64 bg-slate-100/50" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23E5E7EB' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}>
                    <header className="flex justify-end items-center h-20 px-8">
                        <button onClick={toggleLanguage} className="flex items-center px-3 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-primary transition-colors duration-200 shadow-sm">
                            <LanguageIcon className="w-5 h-5 me-2 rtl:me-0 rtl:ms-2" />
                            <span>{language === 'en' ? 'العربية' : 'English'}</span>
                        </button>
                    </header>
                    <div className="px-8 pb-8">
                        <div className="animate-fade-in">
                            {renderView()}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default App;