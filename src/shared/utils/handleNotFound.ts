import * as Sentry from '@sentry/nextjs';
import { notFound } from 'next/navigation';

/**
 * Logs error to Sentry and calls notFound()
 */
export const handleNotFound = (error: unknown, context: Record<string, unknown>): never => {
    Sentry.captureException(error, {
        tags: {
            error_type: 'not_found',
        },
        extra: context,
    });
    
    notFound();
};

