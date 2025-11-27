import { envConfig } from "@/shared/config/envConfig";
import {Verse} from "@/features/verses/model/Verse";
import * as Sentry from '@sentry/nextjs';

const minutes = 60;

export const loadVerse = async ({ locale, slug }: { locale: string; slug: string; }): Promise<Verse> => {
    const headers: HeadersInit = {};

    if (envConfig.secretKey) {
        headers['X-CLIENT-SECRET'] = envConfig.secretKey;
    }

    const url = `${envConfig.serverUrl}/api/christianity/client/verse-posts/translations/${slug}/${locale}`;
    const res = await fetch(url, {
        headers,
        next: {
            revalidate: minutes
        },
    });

    if (!res.ok) {
        Sentry.captureException(new Error(`Verse not found: ${slug}`), {
            tags: { error_type: 'verse_not_found', http_status: res.status },
            extra: { url, slug, locale, status: res.status },
        });
        throw new Error(`Verse not found: ${slug}`);
    }

    return await res.json() as Verse;
};
