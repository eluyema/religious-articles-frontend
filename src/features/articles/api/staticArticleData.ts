import contentData from "@/data/content.json";
import { Article, ArticlePath, ArticleTranslation, FullArticle } from "@/features/articles/model/entities";
import { OutputData } from "@/features/articles/model/entities/outputData";

type ArticleTranslationWithContent = Omit<ArticleTranslation, "content"> & {
    content: OutputData | string | null;
};

type ArticleWithContent = Omit<Article, "translations"> & {
    translations: ArticleTranslationWithContent[];
    createdAt?: string | null;
};

type ContentData = {
    articles?: ArticleWithContent[];
};

const getArticleRecords = (): ArticleWithContent[] => {
    if (!contentData || !Array.isArray((contentData as ContentData).articles)) {
        return [];
    }

    return (contentData as ContentData).articles ?? [];
};

const toPreviewArticle = (article: ArticleWithContent): Article => ({
    ...article,
    translations: article.translations.map(({ content, ...rest }) => ({
        ...rest,
        content: null,
    })),
});

const normalizeContent = (content: OutputData | string | null): OutputData => {
    if (!content) {
        return { time: Date.now(), blocks: [], version: "2.28.0" };
    }

    if (typeof content === "string") {
        return JSON.parse(content) as OutputData;
    }

    return content;
};

export const getArticlesByCategory = (category: string): Article[] => {
    return getArticleRecords()
        .filter((article) => article.category === category)
        .map(toPreviewArticle);
};

export const getArticleRecommendations = (category: string, limit: number): Article[] => {
    const candidates = getArticlesByCategory(category).filter((article) => article.active);
    return candidates.slice(0, Math.max(limit, 0));
};

export const getFullArticle = ({ locale, slug }: { locale: string; slug: string }): FullArticle => {
    const article = getArticleRecords().find((item) => item.slug === slug);
    if (!article) {
        throw new Error(`Article not found: ${slug}`);
    }

    const translation = article.translations.find((item) => item.language === locale);
    if (!translation) {
        throw new Error(`Article not found: ${slug}`);
    }

    return {
        id: article.id,
        category: article.category,
        subcategory: article.subcategory,
        slug: article.slug,
        createdAt: article.createdAt ?? null,
        updatedAt: article.updatedAt,
        availableLanguages: article.translations.map((item) => item.language),
        language: translation.language,
        title: translation.title,
        description: translation.description,
        previewImageUrl: translation.previewImageUrl,
        previewImageAlt: translation.previewImageAlt,
        previewBlurImageImageUrl: translation.previewBlurImageImageUrl,
        content: normalizeContent(translation.content),
    };
};

export const getAllArticlePaths = (): ArticlePath[] => {
    const nowIso = new Date().toISOString();

    return getArticleRecords()
        .flatMap((article) =>
            article.translations.map((translation) => ({
                category: article.category,
                subcategory: article.subcategory,
                slug: article.slug,
                language: translation.language,
                active: article.active === true,
                createdAt: article.createdAt ?? article.updatedAt ?? nowIso,
                updatedAt: article.updatedAt ?? nowIso,
            }))
        );
};
