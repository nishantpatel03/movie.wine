const API_BASE_URL = 'http://127.0.0.1:8000';

export async function createNotification(targetUserId: string, currentUserId: string, data: {
    title: string;
    message: string;
    type: 'new_follower' | 'post_like' | 'post_comment' | 'comment_reply' | 'system_update' | 'content_hidden';
    link?: string;
}) {
    // Phase 11 deliverance - Skip self-notifications
    if (targetUserId === currentUserId) return;

    try {
        const response = await fetch(`${API_BASE_URL}/api/notifications/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: targetUserId,
                ...data
            }),
        });
        
        if (!response.ok) {
            console.error('Failed to deliver notification');
        }
    } catch (error) {
        console.error('Notification delivery error:', error);
    }
}
