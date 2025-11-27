import { envConfig } from "@/shared/config/envConfig";
import { FullArticle } from "@/features/articles/model/entities";
import * as Sentry from '@sentry/nextjs';

const minutes = 60;

export const loadFullArticle = async ({ locale, slug }: { locale: string; slug: string; }): Promise<FullArticle> => {
    const headers: HeadersInit = {};

    if (envConfig.secretKey) {
        headers['X-CLIENT-SECRET'] = envConfig.secretKey;
    }

    const url = `${envConfig.serverUrl}/api/christianity/client/translations/${slug}/${locale}`;
    const res = await fetch(url, {
        headers,
        next: {
            revalidate: minutes
        },
    });

    if (!res.ok) {
        Sentry.captureException(new Error(`Article not found: ${slug}`), {
            tags: { error_type: 'article_not_found', http_status: res.status },
            extra: { url, slug, locale, status: res.status },
        });
        throw new Error(`Article not found: ${slug}`);
    }

    const article = await res.json() as FullArticle & { content: string };

    return {
        ...article,
        content: JSON.parse(article.content),
    };
};
