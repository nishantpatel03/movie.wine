'use client';

import { MessageSquare, ThumbsUp, TrendingUp } from 'lucide-react';
import styles from './PublicOpinion.module.css';

interface Comment {
    id: string;
    user: string;
    avatarUrl: string;
    movieTitle: string;
    text: string;
    likes: number;
    timeAgo: string;
}

interface PublicOpinionProps {
    comments: Comment[];
}

export default function PublicOpinion({ comments }: PublicOpinionProps) {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>
                    <TrendingUp className={styles.icon} size={28} /> Community Pulse
                </h2>
                <p className={styles.subtitle}>See what the public is watching and discussing right now.</p>
            </div>

            <div className={styles.grid}>
                {comments.map((comment) => (
                    <div key={comment.id} className={`glass-card ${styles.commentCard}`}>
                        <div className={styles.cardHeader}>
                            <div className={styles.userInfo}>
                                <div
                                    className={styles.avatar}
                                    style={{ backgroundImage: `url(${comment.avatarUrl})` }}
                                />
                                <div>
                                    <h4 className={styles.userName}>{comment.user}</h4>
                                    <span className={styles.time}>{comment.timeAgo}</span>
                                </div>
                            </div>
                            <span className={styles.movieBadge}>{comment.movieTitle}</span>
                        </div>

                        <p className={styles.commentText}>&quot;{comment.text}&quot;</p>

                        <div className={styles.cardFooter}>
                            <button className={styles.actionBtn}>
                                <ThumbsUp size={16} /> {comment.likes}
                            </button>
                            <button className={styles.actionBtn}>
                                <MessageSquare size={16} /> Reply
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
