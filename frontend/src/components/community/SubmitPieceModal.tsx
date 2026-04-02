'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Film, Type, AlignLeft, Image as ImageIcon, CheckCircle2, Upload, Loader2, Trash2 } from 'lucide-react';
import { createDiscussion, uploadImage } from '@/lib/api';
import { useUser } from '@clerk/nextjs';

interface SubmitPieceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function SubmitPieceModal({ isOpen, onClose, onSuccess }: SubmitPieceModalProps) {
    const { user } = useUser();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const [formData, setFormData] = useState({
        title: '',
        movie_title: '',
        category: 'ESSAY',
        excerpt: '',
        content: '',
        poster_url: ''
    });

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Basic validation
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file.');
            return;
        }

        setIsUploading(true);
        try {
            const result = await uploadImage(file);
            setFormData(prev => ({ ...prev, poster_url: result.url }));
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Failed to upload image. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const removeImage = () => {
        setFormData(prev => ({ ...prev, poster_url: '' }));
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        
        setIsSubmitting(true);
        try {
            await createDiscussion(user.id, formData);
            setIsSuccess(true);
            setTimeout(() => {
                setIsSuccess(false);
                onSuccess();
                onClose();
                setFormData({
                    title: '',
                    movie_title: '',
                    category: 'ESSAY',
                    excerpt: '',
                    content: '',
                    poster_url: ''
                });
            }, 2000);
        } catch (error) {
            console.error("Submission failed:", error);
            alert("Failed to submit your piece. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                    />
                    
                    {/* Modal Content */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-4xl bg-[#0a0a0a] border border-white/10 rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        {/* Success Overlay */}
                        <AnimatePresence>
                            {isSuccess && (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 z-50 bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center text-center"
                                >
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", damping: 12 }}
                                    >
                                        <CheckCircle2 className="w-24 h-24 text-primary mb-6" />
                                    </motion.div>
                                    <h3 className="text-4xl font-serif italic text-white mb-2">Piece Delivered.</h3>
                                    <p className="text-slate-500 uppercase tracking-[0.3em] text-[10px] font-black">Publishing to the archives</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Decoration */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
                        
                        <header className="p-8 border-b border-white/5 flex items-center justify-between relative z-10">
                            <div>
                                <h2 className="text-2xl font-serif text-white italic">Submit to The Discourse.</h2>
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mt-1">Editorial Submission Form</p>
                            </div>
                            <button 
                                onClick={onClose}
                                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors border border-white/5"
                            >
                                <X className="w-5 h-5 text-white/60" />
                            </button>
                        </header>
                        
                        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto custom-scrollbar flex-1 relative z-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <div className="space-y-6">
                                    {/* Title */}
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">
                                            <Type className="w-3 h-3" /> Piece Title
                                        </label>
                                        <input 
                                            required
                                            value={formData.title}
                                            onChange={e => setFormData({...formData, title: e.target.value})}
                                            placeholder="The Decay of Modern Cinematic Pacing"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-primary/50 transition-colors font-serif text-lg"
                                        />
                                    </div>

                                    {/* Movie Title */}
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">
                                            <Film className="w-3 h-3" /> Subject Movie
                                        </label>
                                        <input 
                                            required
                                            value={formData.movie_title}
                                            onChange={e => setFormData({...formData, movie_title: e.target.value})}
                                            placeholder="e.g. Dune: Part Two"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-primary/50 transition-colors"
                                        />
                                    </div>

                                    {/* Category */}
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">
                                            Category
                                        </label>
                                        <select 
                                            value={formData.category}
                                            onChange={e => setFormData({...formData, category: e.target.value})}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-primary/50 transition-colors appearance-none"
                                        >
                                            <option value="ESSAY">ESSAY</option>
                                            <option value="DEBATE">DEBATE</option>
                                            <option value="ANALYSIS">ANALYSIS</option>
                                            <option value="REVIEW">REVIEW</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {/* Excerpt */}
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">
                                            <AlignLeft className="w-3 h-3" /> Short Abstract
                                        </label>
                                        <textarea 
                                            required
                                            rows={4}
                                            value={formData.excerpt}
                                            onChange={e => setFormData({...formData, excerpt: e.target.value})}
                                            placeholder="A brief summary of your take..."
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-primary/50 transition-colors resize-none text-sm leading-relaxed"
                                        />
                                    </div>

                                    {/* Cover Image Upload */}
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">
                                            <ImageIcon className="w-3 h-3" /> Cover Image (Optional)
                                        </label>
                                        
                                        <div 
                                            onClick={() => fileInputRef.current?.click()}
                                            className={`relative group cursor-pointer transition-all duration-500 rounded-2xl border ${
                                                formData.poster_url 
                                                    ? 'border-white/20 h-48' 
                                                    : 'border-white/10 border-dashed hover:border-primary/50 h-32'
                                            } bg-white/5 flex flex-col items-center justify-center overflow-hidden`}
                                        >
                                            <input 
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleFileChange}
                                                accept="image/*"
                                                className="hidden"
                                            />

                                            {isUploading ? (
                                                <div className="flex flex-col items-center gap-3">
                                                    <Loader2 className="w-6 h-6 text-primary animate-spin" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Uploading to archives...</span>
                                                </div>
                                            ) : formData.poster_url ? (
                                                <>
                                                    <img 
                                                        src={formData.poster_url} 
                                                        alt="Cover Preview" 
                                                        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity"
                                                    />
                                                    <div className="relative z-10 flex flex-col items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <div className="p-3 rounded-full bg-black/60 backdrop-blur-md border border-white/20">
                                                            <Upload className="w-5 h-5 text-white" />
                                                        </div>
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-white">Change Image</span>
                                                    </div>
                                                    {/* Delete button */}
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            removeImage();
                                                        }}
                                                        className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-red-500/80 transition-all opacity-0 group-hover:opacity-100"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </>
                                            ) : (
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="p-3 rounded-full bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
                                                        <Upload className="w-5 h-5 text-white/40 group-hover:text-primary transition-colors" />
                                                    </div>
                                                    <div className="text-center">
                                                        <span className="block text-[10px] font-black uppercase tracking-widest text-white/60">Upload Cover Art</span>
                                                        <span className="block text-[8px] font-bold uppercase tracking-widest text-white/20 mt-1">PNG, JPG up to 10MB</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Main Content */}
                            <div className="space-y-2 mb-8">
                                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">
                                    Full Text
                                </label>
                                <textarea 
                                    rows={8}
                                    value={formData.content}
                                    onChange={e => setFormData({...formData, content: e.target.value})}
                                    placeholder="Pen your masterpiece here..."
                                    className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-6 text-white focus:outline-none focus:border-primary/50 transition-colors leading-relaxed font-serif text-lg"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-6 pt-4">
                                <button 
                                    type="button"
                                    onClick={onClose}
                                    className="text-xs font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors"
                                >
                                    Discard Draft
                                </button>
                                <button 
                                    disabled={isSubmitting}
                                    className="flex items-center gap-3 bg-white text-black font-black text-[12px] uppercase tracking-[0.2em] px-10 py-5 rounded-full hover:bg-primary shadow-[0_0_30px_rgba(255,255,255,0.05)] transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                                >
                                    {isSubmitting ? (
                                        <div className="w-4 h-4 border-2 border-black border-t-transparent animate-spin rounded-full" />
                                    ) : (
                                        <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    )}
                                    {isSubmitting ? 'Delivering...' : 'Push to Discourse'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
