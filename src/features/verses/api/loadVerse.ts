import { Verse } from "@/features/verses/model/Verse";
import * as Sentry from '@sentry/nextjs';
import { getVerse } from "@/features/verses/api/staticVerseData";

export const loadVerse = async ({ locale, slug }: { locale: string; slug: string; }): Promise<Verse> => {
    try {
        return getVerse({ locale, slug });
    } catch (error) {
        Sentry.captureException(new Error(`Verse not found: ${slug}`), {
            tags: { error_type: 'verse_not_found', http_status: 404 },
            extra: { slug, locale },
        });
        throw error;
    }
};
