'use client';

import { useState, useEffect } from 'react';
import { useUser, SignInButton } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Edit2, Trash2, Send, X } from 'lucide-react';
import { Comment, getMediaComments, createComment, updateComment, deleteComment } from '@/lib/api';

interface CommentSectionProps {
    tmdbId: number;
    mediaType: 'movie' | 'tv';
    title: string;
    posterPath: string | null;
}

export function CommentSection({ tmdbId, mediaType, title, posterPath }: CommentSectionProps) {
    const { user, isLoaded, isSignedIn } = useUser();
    
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Form state
    const [newContent, setNewContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Edit state
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editContent, setEditContent] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        fetchComments();
    }, [tmdbId]);

    const fetchComments = async () => {
        setIsLoading(true);
        try {
            const data = await getMediaComments(tmdbId);
            setComments(data);
        } catch (error) {
            console.error("Failed to fetch comments:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isSignedIn || !user || !newContent.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            const savedComment = await createComment(user.id, {
                tmdb_id: tmdbId,
                media_type: mediaType,
                title: title,
                poster_path: posterPath,
                content: newContent.trim()
            });
            setComments(prev => [savedComment, ...prev]);
            setNewContent('');
        } catch (error) {
            console.error("Failed to post comment:", error);
        } finally {
            setIsSubmitting(false);
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
        if (!isSignedIn || !user || !editContent.trim() || isUpdating) return;
        
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
        if (!isSignedIn || !user) return;
        
        if (!confirm("Are you sure you want to delete this review?")) return;
        
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
            year: 'numeric', month: 'short', day: 'numeric'
        }).format(date);
    };

    return (
        <div className="w-full max-w-4xl pt-8 pb-12">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/10">
                <MessageSquare className="w-6 h-6 text-primary" />
                <h3 className="text-2xl font-serif italic text-white tracking-tight">Reviews & Thoughts</h3>
                <span className="ml-2 px-2.5 py-0.5 rounded-full bg-white/5 text-slate-400 font-medium text-xs border border-white/10">
                    {comments.length}
                </span>
            </div>

            {/* Comment Form */}
            <div className="mb-12">
                {!isLoaded ? (
                    <div className="h-24 bg-white/5 rounded-xl animate-pulse"></div>
                ) : !isSignedIn ? (
                    <div className="glassmorphism p-8 rounded-2xl border border-white/5 text-center">
                        <MessageSquare className="w-8 h-8 text-white/20 mx-auto mb-4" />
                        <h4 className="text-white font-medium mb-2">Join the conversation</h4>
                        <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">Share your cinematic thoughts and read what others think about this title.</p>
                        <SignInButton mode="modal">
                            <button className="px-6 py-2.5 bg-primary text-background-dark font-bold rounded-xl hover:scale-105 transition-transform">
                                Sign In to Review
                            </button>
                        </SignInButton>
                    </div>
                ) : (
                    <form onSubmit={handleCreate} className="relative group">
                        <div className="flex gap-4 items-start">
                            <div className="flex-shrink-0">
                                {user.imageUrl ? (
                                    <img src={user.imageUrl} alt={user.fullName || 'User'} className="w-12 h-12 rounded-full border border-white/10 object-cover" />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold">
                                        {(user.firstName || user.username || 'U')[0].toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <textarea
                                    className="w-full bg-white/5 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-white placeholder-slate-500 rounded-xl p-4 min-h-[120px] resize-none transition-all shadow-inner"
                                    placeholder="What did you think? Share your review..."
                                    value={newContent}
                                    onChange={(e) => setNewContent(e.target.value)}
                                    disabled={isSubmitting}
                                ></textarea>
                                <div className="flex justify-end mt-3">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={!newContent.trim() || isSubmitting}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Send className="w-4 h-4" />
                                        {isSubmitting ? 'Posting...' : 'Post Review'}
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </form>
                )}
            </div>

            {/* Comments List */}
            <div className="space-y-6">
                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-32 bg-white/5 rounded-2xl animate-pulse"></div>
                        ))}
                    </div>
                ) : comments.length === 0 ? (
                    <div className="text-center py-12 px-4 border border-dashed border-white/10 rounded-3xl">
                        <p className="text-slate-400">No reviews yet. Be the first to share your thoughts!</p>
                    </div>
                ) : (
                    <AnimatePresence>
                        {comments.map((comment) => (
                            <motion.div
                                key={comment.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="glassmorphism p-6 rounded-2xl border border-white/5 relative group"
                            >
                                <div className="flex items-start gap-4">
                                    {/* Avatar */}
                                    <div className="flex-shrink-0 mt-1">
                                        {comment.author?.avatar_url ? (
                                            <img src={comment.author.avatar_url} alt={comment.author.username} className="w-10 h-10 rounded-full border border-white/10 object-cover" />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-slate-300 font-bold text-sm">
                                                {(comment.author?.username || 'U')[0].toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Content Area */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-4 mb-2">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="font-bold text-white text-[15px]">{comment.author?.username || 'Anonymous'}</span>
                                                <span className="w-1 h-1 rounded-full bg-white/20"></span>
                                                <span className="text-xs font-medium text-slate-400">{formatDate(comment.created_at)}</span>
                                                {comment.updated_at !== comment.created_at && (
                                                    <span className="text-[10px] text-slate-500 italic uppercase tracking-wider">(Edited)</span>
                                                )}
                                            </div>

                                            {/* Actions (if owner) */}
                                            {isSignedIn && user?.id === comment.user_id && editingId !== comment.id && (
                                                <div className="flex items-center gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                                    <button 
                                                        onClick={() => handleEditStart(comment)}
                                                        className="p-1.5 text-slate-400 hover:text-primary transition-colors rounded-md hover:bg-white/5"
                                                        title="Edit Review"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(comment.id)}
                                                        className="p-1.5 text-slate-400 hover:text-red-400 transition-colors rounded-md hover:bg-white/5"
                                                        title="Delete Review"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {/* Edit Mode vs View Mode */}
                                        {editingId === comment.id ? (
                                            <div className="mt-3">
                                                <textarea
                                                    className="w-full bg-black/40 border border-primary/30 focus:border-primary focus:ring-1 focus:ring-primary text-white rounded-xl p-3 min-h-[100px] resize-none text-sm transition-all shadow-inner"
                                                    value={editContent}
                                                    onChange={(e) => setEditContent(e.target.value)}
                                                    disabled={isUpdating}
                                                    autoFocus
                                                ></textarea>
                                                <div className="flex items-center justify-end gap-2 mt-2">
                                                    <button 
                                                        onClick={handleEditCancel}
                                                        disabled={isUpdating}
                                                        className="px-3 py-1.5 text-xs font-bold text-slate-300 hover:text-white transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button 
                                                        onClick={() => handleUpdate(comment.id)}
                                                        disabled={!editContent.trim() || isUpdating || editContent === comment.content}
                                                        className="px-4 py-1.5 bg-primary/20 text-primary border border-primary/30 rounded-lg text-xs font-bold transition-colors hover:bg-primary/30 disabled:opacity-50"
                                                    >
                                                        {isUpdating ? 'Saving...' : 'Save Changes'}
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-slate-300 leading-[1.6] text-[15px] whitespace-pre-wrap font-normal pr-4">
                                                {comment.content}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
}
