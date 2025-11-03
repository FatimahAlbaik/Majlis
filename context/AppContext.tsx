import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { AppContextType, User, Post, Feedback, Role, PostType, FeedbackStatus, ToastMessage, Language, Direction, Translations } from '../types.ts';
import { mockData } from '../data/mock.ts';
import { translations as allTranslations } from '../lib/translations.ts';

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // --- STATE ---
  const [session, setSession] = useState<User | null>(null);
  const [activeView, setActiveView] = useState('home');
  const [users, setUsers] = useState<User[]>(mockData.users);
  const [posts, setPosts] = useState<Post[]>(mockData.posts);
  const [feedback, setFeedback] = useState<Feedback[]>(mockData.feedback);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [language, setLanguage] = useState<Language>('en');
  const [passwordResetToken, setPasswordResetToken] = useState<string | null>(null);

  // --- DERIVED STATE & HELPERS ---
  const direction: Direction = language === 'ar' ? 'rtl' : 'ltr';
  const translations: Translations = allTranslations[language];
  
  const addToast = (message: string, type: 'success' | 'error') => {
    const newToast = { id: Date.now(), message, type };
    setToasts(prev => [...prev, newToast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== newToast.id));
    }, 5000);
  };

  // --- SESSION MANAGEMENT ---
  const signIn = (email: string, password: string): true | 'invalidCredentials' | 'accountLocked' => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (user) {
        if (user.lockoutUntil && new Date() < user.lockoutUntil) {
            return 'accountLocked';
        }
        if (user.password === password) {
            setUsers(prev => prev.map(u => u.id === user.id ? { ...u, loginAttempts: 0, lockoutUntil: null } : u));
            setSession(user);
            setActiveView('home');
            addToast(translations.signInSuccess, 'success');
            return true;
        } else {
            const newAttempts = user.loginAttempts + 1;
            let lockoutUntil = user.lockoutUntil;
            if (newAttempts >= 5) {
                lockoutUntil = new Date(Date.now() + 15 * 60 * 1000);
            }
            setUsers(prev => prev.map(u => u.id === user.id ? { ...u, loginAttempts: newAttempts, lockoutUntil } : u));
            return 'invalidCredentials';
        }
    }
    return 'invalidCredentials';
  };

  const signOut = () => {
    setSession(null);
    setActiveView('home');
    addToast(translations.signOutSuccess, 'success');
  };

  const signUp = (name: string, email: string, password: string, role: Role): true | 'emailInUse' => {
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase().trim())) {
      return 'emailInUse';
    }
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email: email.toLowerCase().trim(),
      password,
      role,
      avatarUrl: '', // Start with no avatar
      bio: '',
      loginAttempts: 0,
      lockoutUntil: null,
    };
    setUsers(prev => [...prev, newUser]);
    addToast(translations.signUpSuccess, 'success');
    
    // Auto sign-in
    setSession(newUser);
    
    setActiveView('home');

    return true;
  };

  const requestPasswordReset = (email: string) => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
        // Simulate token generation and sending email
        const token = `reset-token-${user.id}-${Date.now()}`;
        console.log(`Password reset for ${email}, token: ${token}`);
        setPasswordResetToken(token);
        // Navigate directly to reset view for this simulation
        setActiveView('resetPassword');
    }
    // Always show the same message for security
    addToast(translations.ifAccountExists, 'success');
  };

  const resetPassword = (token: string, newPassword: string): boolean => {
    if (!token.startsWith('reset-token-')) return false;
    const userId = token.split('-')[2];
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, password: newPassword } : u));
    setPasswordResetToken(null);
    addToast(translations.passwordUpdateSuccess, 'success');
    setActiveView('signIn');
    return true;
  };
  
  const updateUserProfile = (userId: string, data: Partial<Pick<User, 'name' | 'bio' | 'avatarUrl' | 'cvUrl'>>) => {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...data } : u));
      if (session?.id === userId) {
          setSession(prev => prev ? { ...prev, ...data } : null);
      }
  };

  // --- DATA ACTIONS ---
  const addPost = (postData: { title: string, content: string, type: PostType, media?: {url: string, type: 'image'|'video'} }) => {
    if (!session) return;
    const newPost: Post = {
      id: `post-${Date.now()}`,
      author: session,
      createdAt: new Date().toISOString(),
      stars: 0,
      starredBy: [],
      ...postData
    };
    setPosts(prev => [newPost, ...prev]);
    addToast(translations.postPublished, 'success');
  };

  const toggleStar = (postId: string) => {
    if (!session) {
      addToast(translations.mustBeSignedIn, 'error');
      return;
    }
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const isStarred = p.starredBy.includes(session.id);
        return {
          ...p,
          stars: isStarred ? p.stars - 1 : p.stars + 1,
          starredBy: isStarred ? p.starredBy.filter(id => id !== session.id) : [...p.starredBy, session.id]
        };
      }
      return p;
    }));
  };
  
  const rateActivity = (postId: string, rating: number) => {
    if (!session) return;

    setPosts(currentPosts => {
        const newPosts = currentPosts.map(post => {
            if (post.id === postId && post.type === PostType.Activity) {
                // Remove previous rating from the same user, if any
                const otherRatings = (post.ratings || []).filter(r => r.userId !== session.id);
                
                // Add the new rating
                const updatedRatings = [...otherRatings, { userId: session.id, rating }];
                
                // Recalculate average and count
                const ratingCount = updatedRatings.length;
                const totalRating = updatedRatings.reduce((sum, r) => sum + r.rating, 0);
                const averageRating = ratingCount > 0 ? parseFloat((totalRating / ratingCount).toFixed(2)) : 0;

                // Return a new post object with updated ratings
                return {
                    ...post,
                    ratings: updatedRatings,
                    averageRating,
                    ratingCount,
                };
            }
            // Return unchanged post
            return post;
        });
        return newPosts;
    });

    addToast(translations.ratingSubmitted, 'success');
  };

  const addFeedback = (feedbackData: { title: string, content: string, isAnonymous: boolean }) => {
    if (!session) return;
    const newFeedback: Feedback = {
      id: `feedback-${Date.now()}`,
      author: session,
      status: FeedbackStatus.Pending,
      createdAt: new Date().toISOString(),
      ...feedbackData
    };
    setFeedback(prev => [newFeedback, ...prev]);
    addToast(translations.feedbackSubmitted, 'success');
  };

  const openFeedback = (feedbackId: string) => {
    setFeedback(prev => prev.map(f => {
        if (f.id === feedbackId && f.status === FeedbackStatus.Pending) {
            return { ...f, status: FeedbackStatus.Opened };
        }
        return f;
    }));
  };

  const addFeedbackReply = (feedbackId: string, reply: string) => {
    if (!session || (session.role !== Role.Admin && session.role !== Role.Member)) return;
    setFeedback(prev => prev.map(f => {
        if (f.id === feedbackId) {
            return { ...f, reply, status: FeedbackStatus.Opened };
        }
        return f;
    }));
    addToast(translations.feedbackReplySent, 'success');
  };

  const deleteFeedback = (feedbackId: string) => {
    if (session?.role !== Role.Member && session?.role !== Role.Admin) return;
    setFeedback(prev => prev.filter(f => f.id !== feedbackId));
    addToast(translations.feedbackDeleted, 'success');
  };
  
  // --- AUTOMATED WEEKLY RECAP ---
    useEffect(() => {
        const interval = setInterval(() => {
            console.log("Checking for weekly recap...");
            // In a real app, this would be a cron job. Here we simulate it.
            // Check if a recap for this week has already been posted.
            const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            const hasRecentRecap = posts.some(p =>
                p.type === PostType.Announcement &&
                p.title === translations.weeklyRecapTitle &&
                new Date(p.createdAt) > oneWeekAgo
            );

            if (!hasRecentRecap) {
                const recentActivities = posts.filter(p =>
                    p.type === PostType.Activity &&
                    new Date(p.createdAt) > oneWeekAgo &&
                    (p.ratingCount ?? 0) >= 5
                );

                if (recentActivities.length > 0) {
                    const topActivities = [...recentActivities].sort((a, b) => {
                        if ((b.averageRating ?? 0) !== (a.averageRating ?? 0)) {
                            return (b.averageRating ?? 0) - (a.averageRating ?? 0);
                        }
                        if ((b.ratingCount ?? 0) !== (a.ratingCount ?? 0)) {
                            return (b.ratingCount ?? 0) - (a.ratingCount ?? 0);
                        }
                        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                    }).slice(0, 3);

                    const adminUser = users.find(u => u.role === Role.Admin);
                    if (adminUser) {
                        let content = `${translations.weeklyRecapIntro}\n\n`;
                        topActivities.forEach((activity, index) => {
                            content += `${index + 1}. **${activity.title}** - ${translations.avgRating}: ${activity.averageRating}/5 (${activity.ratingCount} ${translations.ratings})\n`;
                            content += `   *${activity.content.substring(0, 80)}...*\n`;
                        });
                        content += `\n${translations.weeklyRecapClosing}`;
                        
                        const recapPost: Post = {
                            id: `post-${Date.now()}`,
                            type: PostType.Announcement,
                            title: translations.weeklyRecapTitle,
                            content,
                            author: adminUser,
                            createdAt: new Date().toISOString(),
                            stars: 0,
                            starredBy: [],
                        };
                        setPosts(prev => [recapPost, ...prev]);
                        console.log("Weekly recap posted.");
                    }
                }
            }
        }, 1000 * 60 * 60); // Check every hour
        return () => clearInterval(interval);
    }, [posts, users, translations]);

  // --- CONTEXT VALUE ---
  const value: AppContextType = {
    session, signIn, signOut, signUp,
    activeView, setActiveView,
    users, posts, feedback,
    addPost, toggleStar, addFeedback, openFeedback, addFeedbackReply, deleteFeedback, rateActivity,
    updateUserProfile,
    passwordResetToken, requestPasswordReset, resetPassword,
    toasts, addToast,
    language, setLanguage, direction, translations
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};