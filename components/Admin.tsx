import React, { useState, useMemo } from 'react';
import { Feedback, FeedbackStatus, PostType, Role, User } from '../types.ts';
import { formatDistanceToNow } from 'date-fns';
import { arSA } from 'date-fns/locale/ar-SA';
import { enUS } from 'date-fns/locale/en-US';
import { CheckCircleIcon, ClockIcon, XCircleIcon, SpinnerIcon, UserIcon } from './Icons.tsx';
import { useApp } from '../hooks/useApp.ts';
import { Modal } from './Modal.tsx';

type AdminView = 'feedback' | 'digest';

const FeedbackPanel = () => {
    const { feedback, translations: t, language } = useApp();
    
    return (
        <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold text-slate-800 mb-4">{t.feedbackModeration}</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-slate-500 uppercase tracking-wider">{t.author}</th>
                            <th scope="col" className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-slate-500 uppercase tracking-wider">{t.title}</th>
                            <th scope="col" className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-slate-500 uppercase tracking-wider">{t.submitted}</th>
                            <th scope="col" className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-slate-500 uppercase tracking-wider">{t.status}</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {feedback.map(item => (
                            <tr key={item.id} className="hover:bg-slate-50 transition-colors duration-200">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        {item.isAnonymous ? (
                                            <span className="italic text-slate-500">{t.anonymous}</span>
                                        ) : (
                                            <>
                                                {item.author.avatarUrl ? (
                                                     <img className="h-8 w-8 rounded-full object-cover" src={item.author.avatarUrl} alt={item.author.name} />
                                                ) : (
                                                    <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center">
                                                        <UserIcon className="w-5 h-5 text-slate-500" />
                                                    </div>
                                                )}
                                                <div className="ms-3 text-sm font-medium text-slate-900">{item.author.name}</div>
                                            </>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">{item.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{formatDistanceToNow(new Date(item.createdAt), { addSuffix: true, locale: language === 'ar' ? arSA : enUS })}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                     <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                                        item.status === FeedbackStatus.Pending ? 'bg-warning/10 text-amber-700' :
                                        'bg-blue-500/10 text-blue-700'
                                    }`}>{t[item.status] || item.status}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const DigestPanel = () => {
    const { posts, addPost, addToast, translations: t } = useApp();
    const [isGenerating, setIsGenerating] = useState(false);
    const [digestContent, setDigestContent] = useState('');
    const [showPreview, setShowPreview] = useState(false);

    const weeklyActivity = useMemo(() => {
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const recentPosts = posts.filter(p => new Date(p.createdAt) > sevenDaysAgo);
        return {
            posts: recentPosts.filter(p => p.type === PostType.Post).length,
            activities: recentPosts.filter(p => p.type === PostType.Activity).length,
            stars: recentPosts.reduce((sum, p) => sum + p.stars, 0),
            topPost: [...recentPosts].sort((a,b) => b.stars - a.stars)[0]
        };
    }, [posts]);

    const handleGenerate = () => {
        setIsGenerating(true);
        // Simulate AI generation
        setTimeout(() => {
            const { topPost, posts, activities } = weeklyActivity;
            let summary = `## ${t.weeklyDigestTitle}\n\n`;
            summary += `${t.thisWeekSummary} **${posts}** ${t.newPosts.toLowerCase()}, ${t.and} **${activities}** ${t.newActivities.toLowerCase()}.\n\n`;
            if (topPost) {
                summary += `### ${t.highlightPost}\n`;
                summary += `**${topPost.title}** by ${topPost.author.name}\n`;
                summary += `> ${topPost.content.substring(0, 100)}...\n\n`;
            }
            summary += t.digestClosing;
            
            setDigestContent(summary);
            setIsGenerating(false);
            setShowPreview(true);
        }, 1500);
    };

    const handlePublish = () => {
        addPost({
            title: t.weeklyDigestTitle,
            content: digestContent.replace(/## .+\n\n/, ''), // Remove markdown title for post body
            type: PostType.Announcement,
        });
        setShowPreview(false);
        setDigestContent('');
        addToast(t.digestPublishedSuccess, 'success');
    };

    return (
         <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold text-slate-800 mb-2">{t.adminDigestTitle}</h2>
            <p className="text-slate-600 mb-4 text-sm">{t.adminDigestDescription}</p>
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
                <h3 className="font-semibold text-slate-700">{t.adminLast7Days}</h3>
                <ul className="list-disc list-inside text-sm text-slate-600 mt-2 space-y-1">
                    <li><span className="font-bold">{weeklyActivity.posts}</span> {t.adminNewPosts}</li>
                    <li><span className="font-bold">{weeklyActivity.activities}</span> {t.adminNewActivities}</li>
                    <li><span className="font-bold">{weeklyActivity.stars}</span> {t.adminStarsGiven}</li>
                </ul>
            </div>
             <div className="mt-6">
                <button 
                    onClick={handleGenerate} 
                    disabled={isGenerating}
                    className="px-5 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary-dark transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 flex items-center disabled:bg-slate-400 disabled:transform-none disabled:shadow-sm"
                >
                    {isGenerating && <SpinnerIcon className="me-2" />}
                    {isGenerating ? t.adminGenerating : t.adminGeneratePreview}
                </button>
            </div>
            {showPreview && (
                <Modal title={t.adminDigestPreviewTitle} onClose={() => setShowPreview(false)}>
                    <div className="prose prose-sm max-w-none prose-slate">
                        <div dangerouslySetInnerHTML={{ __html: digestContent.replace(/\n/g, '<br />').replace(/## (.+)/g, '<h2>$1</h2>').replace(/### (.+)/g, '<h3>$1</h3>') }} />
                    </div>
                    <div className="flex justify-end space-x-2 rtl:space-x-reverse mt-6">
                        <button onClick={() => setShowPreview(false)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors duration-200">{t.cancel}</button>
                        <button onClick={handlePublish} className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors duration-200">{t.adminPublishAnnouncement}</button>
                    </div>
                </Modal>
            )}
        </div>
    )
}

export const Admin: React.FC = () => {
    const [activeView, setActiveView] = useState<AdminView>('feedback');
    const { translations: t } = useApp();

    const TabButton: React.FC<{ view: AdminView; label: string }> = ({ view, label }) => (
        <button 
            onClick={() => setActiveView(view)} 
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 relative ${
                activeView === view 
                    ? 'text-primary' 
                    : 'text-slate-500 hover:text-slate-800'
            }`}
        >
            {label}
            {activeView === view && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>}
        </button>
    );

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-800 mb-6">{t.adminPanel}</h1>
            <div className="flex space-x-2 rtl:space-x-reverse border-b border-slate-200 mb-6">
                <TabButton view="feedback" label={t.feedbackModeration} />
                <TabButton view="digest" label={t.weeklyDigest} />
            </div>
            {activeView === 'feedback' && <FeedbackPanel />}
            {activeView === 'digest' && <DigestPanel />}
        </div>
    );
};