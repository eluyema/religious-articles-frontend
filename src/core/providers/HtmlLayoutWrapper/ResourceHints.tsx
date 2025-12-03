'use client';

import { useEffect } from 'react';

export default function ResourceHints() {
    useEffect(() => {
        // Add resource hints dynamically
        const hints = [
            { rel: 'preconnect', href: 'https://www.googletagmanager.com' },
            { rel: 'dns-prefetch', href: 'https://www.googletagmanager.com' },
            { rel: 'preconnect', href: 'https://d3kixxf71ic3lt.cloudfront.net' },
            { rel: 'dns-prefetch', href: 'https://d3kixxf71ic3lt.cloudfront.net' },
        ];

        hints.forEach(({ rel, href }) => {
            const link = document.createElement('link');
            link.rel = rel;
            link.href = href;
            document.head.appendChild(link);
        });

        // Cleanup function (optional, but good practice)
        return () => {
            hints.forEach(({ rel, href }) => {
                const existingLink = document.querySelector(`link[rel="${rel}"][href="${href}"]`);
                if (existingLink) {
                    existingLink.remove();
                }
            });
        };
    }, []);

    return null;
}
