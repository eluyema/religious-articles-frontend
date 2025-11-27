import * as Sentry from '@sentry/nextjs';

/**
 * Detects and logs duplicate domain URLs to Sentry
 */
export const logDuplicateDomainUrl = (url: string, context: Record<string, unknown>): void => {
    if (url.includes('jesusnear.com/jesusnear.com') || url.includes('/jesusnear.com/')) {
        Sentry.captureMessage('Duplicate domain in URL', {
            level: 'warning',
            tags: { error_type: 'duplicate_domain_url' },
            extra: { url, ...context },
        });
    }
};

