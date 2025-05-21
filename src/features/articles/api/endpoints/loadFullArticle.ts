import { envConfig } from "@/shared/config/envConfig";
import { FullArticle } from "@/features/articles/model/entities";

const minutes = 60;

export const loadFullArticle = async ({ locale, slug }: { locale: string; slug: string; }): Promise<FullArticle> => {
    const headers: HeadersInit = {};

    if (envConfig.secretKey) {
        headers['X-CLIENT-SECRET'] = envConfig.secretKey;
    }

    const res = await fetch(`${envConfig.serverUrl}/api/christianity/client/translations/${slug}/${locale}`, {
        headers,
        next: {
            revalidate: minutes
        },
    });

    if (!res.ok) {
        throw new Error('Failed to fetch full article');
    }

    const article = await res.json() as FullArticle & { content: string };

    return {
        ...article,
        content: JSON.parse(article.content),
    };
};
