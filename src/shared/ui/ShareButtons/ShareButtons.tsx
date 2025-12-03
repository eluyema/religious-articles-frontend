'use client';

import { useState, useEffect } from 'react';
import styles from './index.module.scss';
import { useTranslations } from 'next-intl';

declare global {
    interface Window {
        gtag?: (
            command: 'event',
            eventName: string,
            params?: {
                method?: string;
                content_type?: string;
                item_id?: string;
            }
        ) => void;
    }
}

type ShareButtonsProps = {
    url: string;
    title: string;
    description?: string;
    imageUrl?: string;
};

const ShareButtons = ({ url, title, description }: ShareButtonsProps) => {
    const t = useTranslations('share');
    const [copied, setCopied] = useState(false);
    const [canUseWebShare, setCanUseWebShare] = useState(false);

    useEffect(() => {
        if (typeof navigator !== 'undefined' && 'share' in navigator && typeof navigator.share === 'function') {
            setCanUseWebShare(true);
        }
    }, []);

    // Use the provided canonical URL instead of window.location.href
    // This ensures we always share the correct canonical URL, even if the current URL has query params or hash
    const fullUrl = url;
    const shareText = description || title;

    const encodedUrl = encodeURIComponent(fullUrl);
    const encodedTitle = encodeURIComponent(title);
    const emailSubject = encodeURIComponent(title);
    const emailBody = encodeURIComponent(`${shareText}\n\n${fullUrl}`);

    const shareLinks = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        x: `https://x.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
        whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
        email: `mailto:?subject=${emailSubject}&body=${emailBody}`,
    };

    const handleWebShare = async () => {
        try {
            await navigator.share({ title, text: shareText, url: fullUrl });
            if (typeof window !== 'undefined' && window.gtag) {
                window.gtag('event', 'share', {
                    method: 'web_share_api',
                    content_type: 'article',
                    item_id: url,
                });
            }
        } catch {}
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(fullUrl);
            setCopied(true);
            if (typeof window !== 'undefined' && window.gtag) {
                window.gtag('event', 'share', {
                    method: 'copy_link',
                    content_type: 'article',
                    item_id: url,
                });
            }
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error(error);
        }
    };

    const handleShare = (platform: string, shareUrl: string) => {
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'share', {
                method: platform,
                content_type: 'article',
                item_id: url,
            });
        }

        if (platform === 'email' || platform === 'facebook') {
            window.location.href = shareUrl;
        } else {
            window.open(shareUrl, '_blank', 'width=600,height=400,menubar=no,toolbar=no');
        }
    };

    return (
        <div className={styles.shareButtons}>
            <span className={styles.shareLabel}>{t('share') || 'Share:'}</span>
            <div className={styles.buttons}>
                {canUseWebShare && (
                    <button
                        onClick={handleWebShare}
                        className={styles.shareButton}
                        aria-label={t('shareVia') || 'Share via'}
                        title={t('shareVia') || 'Share via'}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                            <polyline points="16 6 12 2 8 6" />
                            <line x1="12" y1="2" x2="12" y2="15" />
                        </svg>
                    </button>
                )}
                <button
                    onClick={() => handleShare('facebook', shareLinks.facebook)}
                    className={styles.shareButton}
                    aria-label={t('shareOnFacebook') || 'Share on Facebook'}
                    title={t('shareOnFacebook') || 'Share on Facebook'}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                </button>
                <button
                    onClick={() => handleShare('x', shareLinks.x)}
                    className={styles.shareButton}
                    aria-label={t('shareOnX') || 'Share on X'}
                    title={t('shareOnX') || 'Share on X'}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                </button>
                <button
                    onClick={() => handleShare('whatsapp', shareLinks.whatsapp)}
                    className={styles.shareButton}
                    aria-label={t('shareOnWhatsApp') || 'Share on WhatsApp'}
                    title={t('shareOnWhatsApp') || 'Share on WhatsApp'}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                </button>
                <button
                    onClick={() => handleShare('email', shareLinks.email)}
                    className={styles.shareButton}
                    aria-label={t('shareViaEmail') || 'Share via Email'}
                    title={t('shareViaEmail') || 'Share via Email'}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                    </svg>
                </button>
                <button
                    onClick={handleCopyLink}
                    className={`${styles.shareButton} ${copied ? styles.copied : ''}`}
                    aria-label={t('copyLink') || 'Copy link'}
                    title={copied ? (t('copied') || 'Copied!') : (t('copyLink') || 'Copy link')}
                >
                    {copied ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                        </svg>
                    )}
                </button>
            </div>
        </div>
    );
};

export default ShareButtons;
