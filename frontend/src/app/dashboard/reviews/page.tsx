'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Star, Edit2, Trash2, Video, Film } from 'lucide-react';
import Link from 'next/link';
import { Comment, getUserComments, updateComment, deleteComment, getImageUrl } from '@/lib/api';

export default function MyCommentsPage() {
    const { user, isLoaded, isSignedIn } = useUser();
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Edit state
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editContent, setEditContent] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        if (isLoaded && isSignedIn && user) {
            fetchReviews();
        } else if (isLoaded && !isSignedIn) {
            setIsLoading(false);
        }
    }, [isLoaded, isSignedIn, user]);

    const fetchReviews = async () => {
        setIsLoading(true);
        try {
            const data = await getUserComments(user!.id);
            setComments(data);
        } catch (error) {
            console.error("Failed to fetch user comments:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditStart = (comment: Comment) => {
        setEditingId(comment.id);
        setEditContent(comment.content);
    };

    const handleEditCancel = () => {
        setEditingId(null);
        setEditContent('');
    };

    const handleUpdate = async (id: number) => {
        if (!user || !editContent.trim() || isUpdating) return;
        
        setIsUpdating(true);
        try {
            const updatedComment = await updateComment(user.id, id, editContent.trim());
            setComments(prev => prev.map(c => c.id === id ? updatedComment : c));
            setEditingId(null);
        } catch (error) {
            console.error("Failed to update comment:", error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!user) return;
        if (!confirm("Are you sure you want to delete this comment?")) return;
        
        try {
            await deleteComment(user.id, id);
            setComments(prev => prev.filter(c => c.id !== id));
        } catch (error) {
            console.error("Failed to delete comment:", error);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        }).format(date);
    };

    if (!isLoaded || isLoading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh]">
                <div className="w-12 h-12 border-4 border-white/10 border-t-primary rounded-full animate-spin mb-4" />
                <p className="text-white/60 font-medium tracking-wide">Loading your comments...</p>
            </div>
        );
    }

    if (!isSignedIn) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
                <MessageSquare className="w-16 h-16 text-white/20 mb-6" />
                <h1 className="text-3xl font-bold text-white mb-2">My Comments</h1>
                <p className="text-white/60 max-w-sm">Please sign in to view and manage your comments.</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-6xl mx-auto pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pt-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <MessageSquare className="w-7 h-7 text-primary" />
                        My Comments
                    </h1>
                    <p className="text-white/60 text-sm">Manage your cinematic thoughts and opinions.</p>
                </div>
                <div className="px-5 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-2xl flex items-center gap-3 shadow-inner">
                    <Star className="w-4 h-4 text-primary" />
                    <span className="text-white/80 font-medium text-sm">
                        {comments.length} <span className="text-white/40">Total Comments</span>
                    </span>
                </div>
            </div>

            {/* Content */}
            {comments.length === 0 ? (
                <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-16 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                        <MessageSquare className="w-8 h-8 text-white/20" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-3">No comments yet</h2>
                    <p className="text-white/50 max-w-md mx-auto mb-8">
                        You haven't shared your thoughts on any movies or TV series yet. When you do, they will appear here.
                    </p>
                    <Link href="/movies" className="px-6 py-3 bg-primary text-[#0a0904] font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-[0_0_20px_rgba(255,179,71,0.3)]">
                        Browse Movies
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {comments.map((comment) => (
                            <motion.div
                                key={comment.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="group bg-white/[0.03] border border-white/[0.08] hover:border-white/15 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all flex flex-col h-full relative"
                            >
                                {/* Media Info Header */}
                                <div className="p-5 flex items-start gap-4 pb-4 border-b border-white/[0.05]">
                                    {/* Thumbnail */}
                                    <Link 
                                        href={comment.media_type === 'movie' ? `/movies/${comment.tmdb_id}` : `/series/${comment.tmdb_id}`}
                                        className="flex-shrink-0 w-16 h-[96px] bg-black/50 rounded-lg overflow-hidden border border-white/10 block"
                                    >
                                        <img 
                                            src={getImageUrl(comment.poster_path, 'w185')} 
                                            alt={comment.title} 
                                            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                                        />
                                    </Link>

                                    {/* Title & Type */}
                                    <div className="flex-1 min-w-0 flex flex-col justify-start">
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white/70 flex items-center gap-1 w-fit">
                                                {comment.media_type === 'movie' ? <Film className="w-3 h-3" /> : <Video className="w-3 h-3" />}
                                                {comment.media_type}
                                            </span>
                                            <span className="text-[11px] font-medium text-white/30">{formatDate(comment.created_at)}</span>
                                        </div>
                                        <Link 
                                            href={comment.media_type === 'movie' ? `/movies/${comment.tmdb_id}` : `/series/${comment.tmdb_id}`}
                                            className="font-serif text-lg font-bold text-white leading-tight line-clamp-2 hover:text-primary transition-colors mb-2"
                                            title={comment.title}
                                        >
                                            {comment.title}
                                        </Link>
                                    </div>
                                    
                                    {/* Actions */}
                                    <div className="flex flex-col gap-1 items-end opacity-0 group-hover:opacity-100 transition-opacity absolute top-5 right-5">
                                        <button 
                                            onClick={() => handleEditStart(comment)}
                                            className="p-2 text-white/40 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(comment.id)}
                                            className="p-2 text-white/40 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Review Content */}
                                <div className="p-5 flex-1 flex flex-col relative">
                                    <span className="text-4xl text-white/5 font-serif absolute top-4 left-4">"</span>
                                    {editingId === comment.id ? (
                                        <div className="flex flex-col h-full flex-1">
                                            <textarea
                                                className="w-full bg-black/40 border border-primary/30 focus:border-primary text-white rounded-xl p-3 min-h-[140px] resize-none text-sm shadow-inner transition-colors flex-1"
                                                value={editContent}
                                                onChange={(e) => setEditContent(e.target.value)}
                                                disabled={isUpdating}
                                                autoFocus
                                            ></textarea>
                                            <div className="flex items-center justify-end gap-2 mt-4">
                                                <button 
                                                    onClick={handleEditCancel}
                                                    disabled={isUpdating}
                                                    className="px-3 py-1.5 text-xs font-bold text-white/50 hover:text-white transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                                <button 
                                                    onClick={() => handleUpdate(comment.id)}
                                                    disabled={!editContent.trim() || isUpdating || editContent === comment.content}
                                                    className="px-4 py-1.5 bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 hover:border-primary/50 rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                                                >
                                                    {isUpdating ? 'Saving...' : 'Save'}
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="relative z-10 pl-2 text-white/70">
                                            <p className="text-[14px] leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
