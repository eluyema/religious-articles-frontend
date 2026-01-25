import { FullArticle } from "@/features/articles/model/entities";
import * as Sentry from '@sentry/nextjs';
import { getFullArticle } from "@/features/articles/api/staticArticleData";

export const loadFullArticle = async ({ locale, slug }: { locale: string; slug: string; }): Promise<FullArticle> => {
    try {
        return getFullArticle({ locale, slug });
    } catch (error) {
        Sentry.captureException(new Error(`Article not found: ${slug}`), {
            tags: { error_type: 'article_not_found', http_status: 404 },
            extra: { slug, locale },
        });
        throw error;
    }
};
