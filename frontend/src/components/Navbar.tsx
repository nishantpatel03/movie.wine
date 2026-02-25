'use client';

import Link from 'next/link';
import { Search, Bell, User } from 'lucide-react';
import styles from './Navbar.module.css';

export default function Navbar() {
    return (
        <nav className={`glass ${styles.navbar}`}>
            <div className={styles.container}>
                <div className={styles.left}>
                    <Link href="/" className={styles.logo}>
                        Movie<span className={styles.accent}>Wine</span>
                    </Link>
                    <div className={styles.links}>
                        <Link href="/" className="link-hover">Home</Link>
                        <Link href="/movie/trending" className="link-hover">Movies</Link>
                        <Link href="/series/trending" className="link-hover">Series</Link>
                    </div>
                </div>
                <div className={styles.right}>
                    <button className={styles.iconBtn} aria-label="Search">
                        <Search size={20} />
                    </button>
                    <button className={styles.iconBtn} aria-label="Notifications">
                        <Bell size={20} />
                    </button>
                    <button className={styles.iconBtn} aria-label="Profile">
                        <User size={20} />
                    </button>
                </div>
            </div>
        </nav>
    );
}
