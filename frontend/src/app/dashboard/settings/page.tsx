'use client';

import { useState, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';
import { updateUser, getUserProfile, exportUserData, User } from '@/lib/api';

type Tab = 'profile' | 'preferences' | 'notifications' | 'security' | 'danger';

export default function SettingsPage() {
    const { user, isLoaded } = useUser();
    const { openUserProfile } = useClerk();
    const [activeTab, setActiveTab] = useState<Tab>('profile');
    const [dbUser, setDbUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        if (isLoaded && user) {
            fetchDbUser();
        }
    }, [isLoaded, user]);

    async function fetchDbUser() {
        try {
            const profile = await getUserProfile(user!.id);
            setDbUser(profile);
        } catch (error) {
            console.error("Error fetching db user:", error);
        } finally {
            setIsLoading(false);
        }
    }

    const showMessage = (text: string, type: 'success' | 'error' = 'success') => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    };

    if (!isLoaded || isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    const tabs = [
        { id: 'profile', label: 'Profile', icon: 'person' },
        { id: 'preferences', label: 'Preferences', icon: 'tune' },
        { id: 'notifications', label: 'Notifications', icon: 'notifications' },
        { id: 'security', label: 'Security', icon: 'lock' },
        { id: 'danger', label: 'Danger Zone', icon: 'warning' },
    ];

    return (
        <div className="max-w-4xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
                <p className="text-slate-400">Manage your account settings and preferences.</p>
            </header>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Tabs Sidebar */}
                <aside className="w-full md:w-64 shrink-0">
                    <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-4 md:pb-0 scrollbar-hide">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as Tab)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${
                                    activeTab === tab.id
                                        ? 'bg-primary/10 text-primary border border-primary/20'
                                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <span className="material-symbols-outlined text-xl">{tab.icon}</span>
                                <span className="font-medium">{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-xl relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {activeTab === 'profile' && (
                                <ProfileTab 
                                    user={user} 
                                    dbUser={dbUser} 
                                    onUpdate={fetchDbUser} 
                                    showMessage={showMessage}
                                />
                            )}
                            {activeTab === 'preferences' && (
                                <PreferencesTab 
                                    dbUser={dbUser} 
                                    onUpdate={fetchDbUser} 
                                    showMessage={showMessage}
                                />
                            )}
                            {activeTab === 'notifications' && (
                                <NotificationsTab 
                                    dbUser={dbUser} 
                                    onUpdate={fetchDbUser} 
                                    showMessage={showMessage}
                                />
                            )}
                            {activeTab === 'security' && (
                                <SecurityTab 
                                    user={user} 
                                    openUserProfile={openUserProfile} 
                                />
                            )}
                            {activeTab === 'danger' && (
                                <DangerZoneTab 
                                    user={user} 
                                />
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Toast Message */}
                    <AnimatePresence>
                        {message.text && (
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 50 }}
                                className={`absolute bottom-6 left-6 right-6 p-4 rounded-xl border flex items-center gap-3 ${
                                    message.type === 'success' 
                                        ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                                        : 'bg-red-500/10 border-red-500/20 text-red-400'
                                }`}
                            >
                                <span className="material-symbols-outlined">
                                    {message.type === 'success' ? 'check_circle' : 'error'}
                                </span>
                                {message.text}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}

function ProfileTab({ user, dbUser, onUpdate, showMessage }: any) {
    const [formData, setFormData] = useState({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        username: user.username || '',
        bio: dbUser?.bio || '',
        favourite_genres: dbUser?.favourite_genres || '',
    });
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            // Update Clerk data
            await user.update({
                firstName: formData.firstName,
                lastName: formData.lastName,
                username: formData.username,
            });

            // Update Backend data
            await updateUser(user.id, {
                username: formData.username,
                bio: formData.bio,
                favourite_genres: formData.favourite_genres,
            });

            showMessage('Profile updated successfully!');
            onUpdate();
        } catch (error: any) {
            showMessage(error.message || 'Failed to update profile', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const genres = ["Action", "Comedy", "Drama", "Horror", "Sci-Fi", "Romance", "Thriller", "Documentary"];
    const selectedGenres = formData.favourite_genres ? formData.favourite_genres.split(',') : [];

    const toggleGenre = (genre: string) => {
        let newGenres;
        if (selectedGenres.includes(genre)) {
            newGenres = selectedGenres.filter(g => g !== genre);
        } else {
            newGenres = [...selectedGenres, genre];
        }
        setFormData({ ...formData, favourite_genres: newGenres.join(',') });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-6 mb-8">
                <img 
                    src={user.imageUrl} 
                    alt="Profile" 
                    className="w-20 h-20 rounded-full border-2 border-primary/30"
                />
                <div>
                    <h3 className="text-xl font-bold text-white">Public Profile</h3>
                    <p className="text-slate-400 text-sm">This information will be displayed publicly.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">First Name</label>
                    <input 
                        type="text"
                        value={formData.firstName}
                        onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Last Name</label>
                    <input 
                        type="text"
                        value={formData.lastName}
                        onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Username</label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">@</span>
                    <input 
                        type="text"
                        value={formData.username}
                        onChange={e => setFormData({ ...formData, username: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Bio</label>
                <textarea 
                    value={formData.bio}
                    onChange={e => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors min-h-[100px] resize-none"
                />
            </div>

            <div className="space-y-3">
                <label className="text-sm font-medium text-slate-300">Favourite Genres</label>
                <div className="flex flex-wrap gap-2">
                    {genres.map(genre => (
                        <button
                            key={genre}
                            type="button"
                            onClick={() => toggleGenre(genre)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                                selectedGenres.includes(genre)
                                    ? 'bg-primary text-background-dark'
                                    : 'bg-white/5 text-slate-400 hover:bg-white/10'
                            }`}
                        >
                            {genre}
                        </button>
                    ))}
                </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end">
                <button
                    type="submit"
                    disabled={isSaving}
                    className="bg-primary hover:bg-primary-light text-background-dark font-bold px-8 py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(244,192,37,0.2)] disabled:opacity-50 flex items-center gap-2"
                >
                    {isSaving ? (
                        <span className="animate-spin h-4 w-4 border-2 border-background-dark border-t-transparent rounded-full"></span>
                    ) : (
                        <span className="material-symbols-outlined text-xl">save</span>
                    )}
                    Save Profile
                </button>
            </div>
        </form>
    );
}

function PreferencesTab({ dbUser, onUpdate, showMessage }: any) {
    const [formData, setFormData] = useState({
        default_feed: dbUser?.default_feed || 'all',
        content_language: dbUser?.content_language || 'en',
        show_mature: dbUser?.show_mature || false,
    });
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await updateUser(dbUser.clerk_id, formData);
            showMessage('Preferences updated successfully!');
            onUpdate();
        } catch (error: any) {
            showMessage(error.message || 'Failed to update preferences', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
                <h3 className="text-xl font-bold text-white">Browsing Experience</h3>

                <div className="space-y-4">
                    <label className="text-sm font-medium text-slate-300 block">Default Feed Content</label>
                    <div className="grid grid-cols-3 gap-3">
                        {['all', 'movie', 'tv'].map((type) => (
                            <button
                                key={type}
                                type="button"
                                onClick={() => setFormData({ ...formData, default_feed: type })}
                                className={`px-4 py-3 rounded-xl border transition-all capitalize ${
                                    formData.default_feed === type
                                        ? 'bg-primary/10 border-primary/50 text-primary'
                                        : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                                }`}
                            >
                                {type === 'tv' ? 'Series' : type}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 block">Content Language</label>
                    <select
                        value={formData.content_language}
                        onChange={(e) => setFormData({ ...formData, content_language: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 appearance-none"
                    >
                        <option value="en">English</option>
                        <option value="hi">Hindi</option>
                        <option value="gu">Gujarati</option>
                        <option value="ja">Japanese</option>
                        <option value="ko">Korean</option>
                    </select>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                    <div>
                        <p className="text-white font-medium">Show Mature Content</p>
                        <p className="text-slate-400 text-sm">Include R-rated and adult content in search and feeds.</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setFormData({ ...formData, show_mature: !formData.show_mature })}
                        className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${
                            formData.show_mature ? 'bg-primary' : 'bg-slate-700'
                        }`}
                    >
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                            formData.show_mature ? 'translate-x-6' : 'translate-x-0'
                        }`} />
                    </button>
                </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end">
                <button
                    type="submit"
                    disabled={isSaving}
                    className="bg-primary hover:bg-primary-light text-background-dark font-bold px-8 py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(244,192,37,0.2)] disabled:opacity-50"
                >
                    {isSaving ? 'Saving...' : 'Save Preferences'}
                </button>
            </div>
        </form>
    );
}

function NotificationsTab({ dbUser, onUpdate, showMessage }: any) {
    const [formData, setFormData] = useState({
        notif_digest: dbUser?.notif_digest ?? true,
        notif_watchparty: dbUser?.notif_watchparty ?? true,
        notif_discussion: dbUser?.notif_discussion ?? true,
    });
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await updateUser(dbUser.clerk_id, formData);
            showMessage('Notification settings updated!');
            onUpdate();
        } catch (error: any) {
            showMessage(error.message || 'Failed to update settings', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const ToggleRow = ({ label, description, field }: any) => (
        <div className="flex items-center justify-between py-4">
            <div>
                <p className="text-white font-medium">{label}</p>
                <p className="text-slate-400 text-sm">{description}</p>
            </div>
            <button
                type="button"
                onClick={() => setFormData({ ...formData, [field]: !formData[field as keyof typeof formData] })}
                className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 shrink-0 ${
                    formData[field as keyof typeof formData] ? 'bg-primary' : 'bg-slate-700'
                }`}
            >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                    formData[field as keyof typeof formData] ? 'translate-x-6' : 'translate-x-0'
                }`} />
            </button>
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">Email Notifications</h3>
                <p className="text-slate-400 text-sm">Control how and when you want to be notified.</p>
                
                <div className="divide-y divide-white/10 mt-6">
                    <ToggleRow 
                        label="Weekly Digest" 
                        description="Receive a summary of top discussions and trending movies." 
                        field="notif_digest"
                    />
                    <ToggleRow 
                        label="Watch Party Reminders" 
                        description="Get notified when a party you joined is about to start." 
                        field="notif_watchparty"
                    />
                    <ToggleRow 
                        label="Discussion Alerts" 
                        description="Be the first to know about new discussions in your favourite genres." 
                        field="notif_discussion"
                    />
                </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end">
                <button
                    type="submit"
                    disabled={isSaving}
                    className="bg-primary hover:bg-primary-light text-background-dark font-bold px-8 py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(244,192,37,0.2)] disabled:opacity-50"
                >
                    {isSaving ? 'Saving...' : 'Save Notification Settings'}
                </button>
            </div>
        </form>
    );
}

function SecurityTab({ user, openUserProfile }: any) {
    return (
        <div className="space-y-8">
            <div className="space-y-6">
                <h3 className="text-xl font-bold text-white">Account Security</h3>
                
                <div className="space-y-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <span className="material-symbols-outlined text-primary text-2xl">password</span>
                            <div>
                                <p className="text-white font-medium">Password</p>
                                <p className="text-slate-400 text-sm">Last changed 2 months ago</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => openUserProfile()}
                            className="text-primary hover:text-primary-light text-sm font-bold transition-colors"
                        >
                            Change Password
                        </button>
                    </div>

                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <span className="material-symbols-outlined text-primary text-2xl">devices</span>
                            <div>
                                <p className="text-white font-medium">Active Sessions</p>
                                <p className="text-slate-400 text-sm">You are currently logged into 2 devices</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => openUserProfile()}
                            className="text-primary hover:text-primary-light text-sm font-bold transition-colors"
                        >
                            Manage Sessions
                        </button>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <h3 className="text-xl font-bold text-white">Connected Accounts</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user.externalAccounts.map((account: any) => (
                        <div key={account.id} className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-4">
                            <img src={account.imageUrl} alt={account.provider} className="w-8 h-8" />
                            <div className="flex-1">
                                <p className="text-white font-medium capitalize">{account.provider}</p>
                                <p className="text-slate-500 text-sm">{account.emailAddress}</p>
                            </div>
                            <span className="material-symbols-outlined text-green-500 text-xl">verified</span>
                        </div>
                    ))}
                    <button 
                        onClick={() => openUserProfile()}
                        className="p-4 bg-white/5 border border-white/10 border-dashed rounded-2xl flex items-center justify-center gap-2 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                    >
                        <span className="material-symbols-outlined">add</span>
                        Connect more
                    </button>
                </div>
            </div>
        </div>
    );
}

function DangerZoneTab({ user }: any) {
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const data = await exportUserData(user.id);
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `moviewine-data-${user.username}.json`;
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Export error:", error);
            alert("Failed to export data");
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">Data Portability</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                    Download a copy of your data, including your profile information, 
                    watchlists, and preferences. This will be provided in JSON format.
                </p>
                <button 
                    onClick={handleExport}
                    disabled={isExporting}
                    className="flex items-center gap-3 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all disabled:opacity-50"
                >
                    <span className="material-symbols-outlined">{isExporting ? 'sync' : 'download'}</span>
                    {isExporting ? 'Generating...' : 'Export My Data'}
                </button>
            </div>

            <div className="pt-8 border-t border-white/10 space-y-4">
                <h3 className="text-xl font-bold text-red-500">Delete Account</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                    Permanently delete your account and all associated data. This action is irreversible. 
                    All your reviews, lists, and comments will be removed from MovieWine.
                </p>
                <button className="flex items-center gap-3 px-6 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all">
                    <span className="material-symbols-outlined">delete_forever</span>
                    Delete Account
                </button>
            </div>
        </div>
    );
}
