import * as Sentry from '@sentry/nextjs';
import { notFound } from 'next/navigation';

/**
 * Logs error to Sentry and calls notFound()
 */
export const handleNotFound = (error: unknown, context: Record<string, unknown>): never => {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorName = error instanceof Error ? error.name : 'NotFoundError';
    
    Sentry.captureException(error, {
        tags: {
            error_type: 'not_found',
        },
        extra: context,
    });
    
    notFound();
};

