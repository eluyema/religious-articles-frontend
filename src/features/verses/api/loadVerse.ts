import { envConfig } from "@/shared/config/envConfig";
import {Verse} from "@/features/verses/model/Verse";

const minutes = 60;

export const loadVerse = async ({ locale, slug }: { locale: string; slug: string; }): Promise<Verse> => {
    const headers: HeadersInit = {};

    if (envConfig.secretKey) {
        headers['X-CLIENT-SECRET'] = envConfig.secretKey;
    }

    const res = await fetch(`${envConfig.serverUrl}/api/christianity/client/verse-posts/translations/${slug}/${locale}`, {
        headers,
        next: {
            revalidate: minutes
        },
    });

    if (!res.ok) {
        throw new Error('Failed to fetch full article');
    }

    return await res.json() as Verse;
};
