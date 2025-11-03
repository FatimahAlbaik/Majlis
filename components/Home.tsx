import React, { useState, useMemo, useRef } from 'react';
import { useApp } from '../hooks/useApp.ts';
import { Post, PostType, Role } from '../types.ts';
import { formatDistanceToNow } from 'date-fns';
import { arSA } from 'date-fns/locale/ar-SA';
import { enUS } from 'date-fns/locale/en-US';
import { StarIcon, MediaIcon, UserIcon, EmptyStateIcon } from './Icons.tsx';

const Composer: React.FC = () => {
    const { session, addPost, addToast, translations: t } = useApp();
    const [type, setType] = useState(PostType.Post);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const [mediaPreview, setMediaPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const isImage = file.type.startsWith('image/');
            const isVideo = file.type.startsWith('video/');
            const maxSize = isImage ? 3 * 1024 * 1024 : 20 * 1024 * 1024;

            if (!isImage && !isVideo) {
                addToast(t.invalidFileType, 'error');
                return;
            }
            if (file.size > maxSize) {
                addToast(t.fileTooLarge, 'error');
                return;
            }
            setMediaFile(file);
            setMediaPreview(URL.createObjectURL(file));
        }
    };

    const handlePost = () => {
        if (!title.trim() || !content.trim()) return;
        addPost({ title, content, type, media: mediaFile ? { url: mediaPreview!, type: mediaFile.type.startsWith('image/') ? 'image' : 'video' } : undefined });
        setTitle('');
        setContent('');
        setMediaFile(null);
        setMediaPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    if (!session) return null;

    return (
        <div className="bg-white p-5 rounded-xl shadow mb-6">
            <h2 className="font-semibold text-slate-800 mb-4">{t.whatsOnYourMind}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                 <div>
                    <label htmlFor="post-type" className="block text-sm font-medium text-slate-600 mb-1">{t.postType}</label>
                    <select id="post-type" value={type} onChange={e => setType(e.target.value as PostType)} className="mt-1 block w-full pl-3 pr-10 py-2.5 text-base border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-light sm:text-sm rounded-lg">
                        <option value={PostType.Post}>{t.post}</option>
                        {(session.role === Role.Member || session.role === Role.Admin) && (
                            <option value={PostType.Activity}>{t.activity}</option>
                        )}
                         {(session.role === Role.Member || session.role === Role.Admin) && (
                            <option value={PostType.Announcement}>{t.announcement}</option>
                        )}
                    </select>
                </div>
                 <div>
                    <label htmlFor="post-title" className="block text-sm font-medium text-slate-600 mb-1">{t.title}</label>
                    <input type="text" id="post-title" value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light sm:text-sm" />
                </div>
            </div>
            <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-light transition-shadow duration-200"
                rows={3}
                placeholder={t.postContentPlaceholder}
            ></textarea>

            {mediaPreview && (
                <div className="my-2 p-2 border border-slate-200 rounded-lg relative w-fit">
                    {mediaFile?.type.startsWith('image/') ? (
                        <img src={mediaPreview} alt="Preview" className="max-h-48 rounded-md" />
                    ) : (
                        <video src={mediaPreview} controls className="max-h-48 rounded-md" />
                    )}
                     <button onClick={() => { setMediaFile(null); setMediaPreview(null); if(fileInputRef.current) fileInputRef.current.value = ""; }} className="absolute top-1 right-1 rtl:right-auto rtl:left-1 bg-black bg-opacity-50 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-opacity-70 transition-opacity">&times;</button>
                </div>
            )}

            <div className="flex justify-between items-center mt-4">
                <button onClick={() => fileInputRef.current?.click()} className="flex items-center space-x-2 rtl:space-x-reverse text-slate-500 hover:text-primary transition-colors duration-200">
                    <MediaIcon />
                    <span className="text-sm font-medium">{t.addMedia}</span>
                    <input type="file" ref={fileInputRef} onChange={handleMediaChange} className="hidden" accept="image/*,video/*" />
                </button>
                <button onClick={handlePost} className="px-5 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary-dark transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5">{t.publish}</button>
            </div>
        </div>
    );
};

const PostCard: React.FC<{ post: Post }> = ({ post }) => {
    const { session, toggleStar, rateActivity, language, translations: t } = useApp();
    const isStarred = session ? post.starredBy.includes(session.id) : false;
    const userRating = session && post.type === PostType.Activity
        ? (post.ratings?.find(r => r.userId === session.id)?.rating ?? 0)
        : 0;

    const getBadgeStyle = (type: PostType) => ({
        [PostType.Announcement]: 'bg-danger/10 text-danger-700',
        [PostType.Activity]: 'bg-blue-500/10 text-blue-700',
        [PostType.Post]: 'bg-secondary/10 text-emerald-700',
    })[type];

    return (
        <div className="bg-white p-5 rounded-xl shadow">
            <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    {post.author.avatarUrl ? (
                         <img src={post.author.avatarUrl} alt={post.author.name} className="w-11 h-11 rounded-full object-cover ring-2 ring-slate-100" />
                    ) : (
                        <div className="w-11 h-11 rounded-full bg-slate-200 flex items-center justify-center">
                            <UserIcon className="w-6 h-6 text-slate-500" />
                        </div>
                    )}
                    <div>
                        <p className="font-semibold text-slate-800">{post.author.name}</p>
                        <p className="text-xs text-slate-500">{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: language === 'ar' ? arSA : enUS })}</p>
                    </div>
                </div>
                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getBadgeStyle(post.type)}`}>
                    {t[post.type.toLowerCase()]}
                </span>
            </div>
            <div className="py-4">
                <h3 className="text-lg font-bold text-slate-900">{post.title}</h3>
                <p className="text-slate-600 mt-1 text-sm leading-relaxed">{post.content}</p>
            </div>

            {post.media && (
                <div className="mb-4 rounded-lg overflow-hidden border border-slate-200">
                    {post.media.type === 'image' ? (
                        <img src={post.media.url} alt={post.title} className="w-full object-cover" />
                    ) : (
                        <video src={post.media.url} controls className="w-full bg-slate-100" />
                    )}
                </div>
            )}
            
            {post.type === PostType.Activity && (
                 <div className="py-4 border-t border-slate-200/80">
                    <div className="flex justify-between items-center">
                        <div>
                             <p className="text-sm font-medium text-slate-700 mb-1">{session && post.author.id !== session.id ? (userRating ? t.yourRating : t.rateThisActivity) : t.avgRating}</p>
                            <div className="flex items-center space-x-1 rtl:space-x-reverse">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <StarIcon
                                        key={star}
                                        onClick={() => session && post.author.id !== session.id && rateActivity(post.id, star)}
                                        className={`w-6 h-6 transition-all duration-200 ${session && post.author.id !== session.id ? 'cursor-pointer hover:scale-125' : ''} ${star <= (userRating || (post.averageRating ?? 0)) ? 'text-amber-400' : 'text-slate-300'}`}
                                        filled={star <= userRating}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="text-right rtl:text-left">
                            <p className="text-xl font-bold text-slate-800">{(post.averageRating ?? 0).toFixed(1)} / 5</p>
                            <p className="text-xs text-slate-500">{post.ratingCount ?? 0} {t.ratings}</p>
                        </div>
                    </div>
                 </div>
            )}
            
            <div className="flex justify-between items-center pt-4 border-t border-slate-200/80">
                <button
                    onClick={() => toggleStar(post.id)}
                    disabled={!session}
                    className={`flex items-center space-x-2 rtl:space-x-reverse text-slate-500 disabled:cursor-not-allowed transition-colors duration-200 ${isStarred ? 'text-amber-500 font-semibold' : 'hover:text-amber-500'}`}
                >
                    <StarIcon filled={isStarred} />
                    <span className="text-sm">{t.giveStar}</span>
                </button>
                <span className="text-sm font-medium text-slate-500">{post.stars} Stars</span>
            </div>
        </div>
    );
};

export const Home: React.FC = () => {
    const { session, posts, translations: t } = useApp();
    const [filter, setFilter] = useState('all');
    const [sort, setSort] = useState('latest');

    const filteredAndSortedPosts = useMemo(() => {
        let filtered = posts;
        if (filter !== 'all') {
            filtered = posts.filter(p => p.type.toLowerCase() === filter);
        }
        
        let sorted = [...filtered];
        if (sort === 'latest') {
            sorted.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        } else if (sort === 'topRatedWeekly' || sort === 'topRatedAllTime') {
            const sevenDaysAgo = sort === 'topRatedWeekly' ? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) : null;
            sorted = sorted.filter(p => p.type === PostType.Activity).sort((a, b) => {
                const aIsValid = !sevenDaysAgo || new Date(a.createdAt) > sevenDaysAgo;
                const bIsValid = !sevenDaysAgo || new Date(b.createdAt) > sevenDaysAgo;
                const aRating = aIsValid ? (a.averageRating ?? 0) : -1;
                const bRating = bIsValid ? (b.averageRating ?? 0) : -1;
                return bRating - aRating;
            });
        }
        
        return sorted;
    }, [posts, filter, sort]);

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-6">
                {session ? `${t.welcome}, ${session.name}!` : t.welcomeGuest}
            </h1>
            <Composer />
            <div className="flex justify-between items-center my-6">
                <div className="flex space-x-1 rtl:space-x-reverse bg-slate-200/80 p-1 rounded-full">
                    {['all', 'post', 'activity', 'announcement'].map(f => (
                        <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-all duration-200 ${filter === f ? 'bg-white text-primary shadow' : 'text-slate-600 hover:bg-white/50'}`}>
                            {t[f] || f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>
                 {filter === 'activity' && (
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <label className="text-sm font-medium text-slate-700">{t.sortBy}</label>
                        <select value={sort} onChange={e => setSort(e.target.value)} className="text-sm rounded-lg border-slate-300 focus:ring-primary-light focus:border-primary-light transition-shadow duration-200">
                            <option value="latest">{t.latest}</option>
                            <option value="topRatedWeekly">{t.topRatedWeekly}</option>
                            <option value="topRatedAllTime">{t.topRatedAllTime}</option>
                        </select>
                    </div>
                )}
                 {filter !== 'activity' && sort !== 'latest' && setSort('latest')}
            </div>
            {filteredAndSortedPosts.length > 0 ? (
                <div className="space-y-4">
                    {filteredAndSortedPosts.map(post => <PostCard key={post.id} post={post} />)}
                </div>
            ) : (
                 <div className="text-center py-20 text-slate-500 bg-white rounded-xl shadow">
                    <EmptyStateIcon className="mx-auto" />
                    <p className="font-semibold mt-4 text-slate-600">{t.noItemsYet}</p>
                </div>
            )}
        </div>
    );
};