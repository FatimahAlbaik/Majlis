import React, { useState } from 'react';
import { useApp } from '../hooks/useApp.ts';
import { Feedback as FeedbackType, Role, FeedbackStatus } from '../types.ts';
import { formatDistanceToNow } from 'date-fns';
import { arSA } from 'date-fns/locale/ar-SA';
import { enUS } from 'date-fns/locale/en-US';
import { Modal } from './Modal.tsx';
import { TrashIcon } from './Icons.tsx';

const CreateFeedbackModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { addFeedback, translations: t } = useApp();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);

    const handleSubmit = () => {
        if (!title.trim() || !content.trim()) return;
        addFeedback({ title, content, isAnonymous });
        onClose();
    };

    return (
        <Modal title={t.submitFeedback} onClose={onClose}>
            <div className="space-y-4">
                <div>
                    <label htmlFor="feedback-title" className="block text-sm font-medium text-slate-700">{t.title}</label>
                    <input type="text" id="feedback-title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light sm:text-sm" placeholder={t.feedbackTitlePlaceholder} />
                </div>
                <div>
                    <label htmlFor="feedback-content" className="block text-sm font-medium text-slate-700">{t.content}</label>
                    <textarea id="feedback-content" rows={4} value={content} onChange={(e) => setContent(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light sm:text-sm" placeholder={t.feedbackContentPlaceholder}></textarea>
                </div>
                <div className="flex items-center">
                    <input id="anonymous" name="anonymous" type="checkbox" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} className="h-4 w-4 text-primary border-slate-300 rounded focus:ring-primary-light" />
                    <label htmlFor="anonymous" className="ms-2 block text-sm text-slate-900">{t.makeAnonymous}</label>
                </div>
                <div className="flex justify-end space-x-2 rtl:space-x-reverse pt-2">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors duration-200">{t.cancel}</button>
                    <button onClick={handleSubmit} className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors duration-200">{t.submitFeedback}</button>
                </div>
            </div>
        </Modal>
    );
};

const FeedbackDetailModal: React.FC<{ feedback: FeedbackType, onClose: () => void }> = ({ feedback, onClose }) => {
    const { session, deleteFeedback, addFeedbackReply, translations: t, language } = useApp();
    const [reply, setReply] = useState('');

    const handleDelete = () => {
        if (window.confirm(t.deleteFeedbackConfirm)) {
            deleteFeedback(feedback.id);
            onClose();
        }
    }

    const handleReply = () => {
        if (!reply.trim()) return;
        addFeedbackReply(feedback.id, reply);
        onClose(); // Close modal after replying
    };

    const canReply = (session?.role === Role.Member || session?.role === Role.Admin) && !feedback.reply;

    return (
        <Modal title={feedback.title} onClose={onClose}>
            <div className="space-y-4">
                <p className="text-sm text-slate-500">{t.submitted} {formatDistanceToNow(new Date(feedback.createdAt), { addSuffix: true, locale: language === 'ar' ? arSA : enUS })} by {feedback.isAnonymous ? t.anonymous : feedback.author.name}</p>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <h4 className="font-semibold text-sm text-slate-600">Feedback:</h4>
                    <p className="whitespace-pre-wrap text-slate-800 mt-1">{feedback.content}</p>
                </div>

                {feedback.reply && (
                    <div className="p-3 bg-primary/10 rounded-lg border-l-4 border-primary">
                         <h4 className="font-semibold text-sm text-slate-600">Reply from Majlis Team:</h4>
                         <p className="whitespace-pre-wrap text-slate-800 mt-1">{feedback.reply}</p>
                    </div>
                )}
                
                {canReply && (
                    <div className="pt-4 border-t border-slate-200">
                        <label htmlFor="feedback-reply" className="block text-sm font-medium text-slate-700">{t.yourReply}</label>
                        <textarea 
                            id="feedback-reply"
                            rows={3}
                            value={reply}
                            onChange={(e) => setReply(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light sm:text-sm"
                            placeholder={t.replyToFeedback}
                        ></textarea>
                         <div className="flex justify-end mt-2">
                             <button onClick={handleReply} className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors duration-200">{t.submitReply}</button>
                         </div>
                    </div>
                )}

                <div>
                     <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${feedback.status === FeedbackStatus.Pending ? 'bg-warning/10 text-amber-700' : 'bg-blue-500/10 text-blue-700'}`}>{t[feedback.status] || feedback.status}</span>
                </div>
                {(session?.role === Role.Member || session?.role === Role.Admin) && (
                     <div className="flex justify-end pt-4 border-t border-slate-200">
                        <button onClick={handleDelete} className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 text-sm font-medium text-white bg-danger rounded-lg hover:bg-danger/90 transition-colors duration-200">
                           <TrashIcon />
                           <span>{t.delete}</span>
                        </button>
                     </div>
                )}
            </div>
        </Modal>
    );
}

export const Feedback: React.FC = () => {
    const { session, feedback, openFeedback, translations: t, language } = useApp();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedFeedback, setSelectedFeedback] = useState<FeedbackType | null>(null);

    // This check is important because App.tsx guarantees session exists if this component renders
    if (!session) return null;

    const visibleFeedback = session.role === Role.Admin
        ? feedback
        : session.role === Role.Member
            ? feedback.filter(f => f.author.role === Role.Student || f.author.id === session.id)
            : feedback.filter(f => f.author.id === session.id);
            
    const handleRowClick = (item: FeedbackType) => {
        if (session.role === Role.Member || session.role === Role.Admin) {
            openFeedback(item.id);
        }
        setSelectedFeedback(item);
    };

    return (
        <div className="max-w-6xl mx-auto">
            {showCreateModal && <CreateFeedbackModal onClose={() => setShowCreateModal(false)} />}
            {selectedFeedback && <FeedbackDetailModal feedback={selectedFeedback} onClose={() => setSelectedFeedback(null)} />}
            
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">{t.feedback}</h1>
                    <p className="text-slate-600 mt-1">{t.feedbackDescription}</p>
                </div>
                <button onClick={() => setShowCreateModal(true)} className="px-5 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary-dark transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
                    {t.submitFeedback}
                </button>
            </div>

            <div className="bg-white rounded-xl shadow">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                {(session.role === Role.Admin || session.role === Role.Member) && (
                                     <th scope="col" className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-slate-500 uppercase tracking-wider">{t.author}</th>
                                )}
                                <th scope="col" className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-slate-500 uppercase tracking-wider">{t.title}</th>
                                <th scope="col" className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-slate-500 uppercase tracking-wider">{t.submitted}</th>
                                <th scope="col" className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-slate-500 uppercase tracking-wider">{t.status}</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {visibleFeedback.map(item => (
                                <tr key={item.id} onClick={() => handleRowClick(item)} className="hover:bg-slate-50 cursor-pointer transition-colors duration-200">
                                    {(session.role === Role.Admin || session.role === Role.Member) && (
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {item.isAnonymous ? (
                                                    <span className="italic text-slate-500">{t.anonymous}</span>
                                                ) : (
                                                    <div className="text-sm font-medium text-slate-900">{item.author.name}</div>
                                                )}
                                            </div>
                                        </td>
                                    )}
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
        </div>
    );
};