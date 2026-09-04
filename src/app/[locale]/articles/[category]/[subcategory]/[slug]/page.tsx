import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from "@/widgets/Header";
import Footer from "@/widgets/Footer";
import { loadFullArticle } from "@/features/articles/api/endpoints/loadFullArticle";
import ArticlePage from "@/features/articles/ui/ArticlePage";
import { loadAllArticlePath } from "@/features/articles/api/endpoints/loadAllArticlePath";
import {loadArticlesRecommendations} from "@/features/articles/api/endpoints/loadArticlesRecommendations";
import {categoriesConfig} from "@/shared/config/categoriesConfig";
import { SITE_URL, buildAlternates, sitePath } from "@/shared/seo";
import { logDuplicateDomainUrl } from "@/shared/utils/logDuplicateDomainUrl";
import { handleNotFound } from "@/shared/utils/handleNotFound";
import { FullArticle } from "@/features/articles/model/entities";

// Make route dynamic if static generation fails
export const dynamicParams = true;
export const revalidate = 3600; // Revalidate every hour

export async function generateStaticParams() {
    try {
        const allPath = await loadAllArticlePath();

        if (!allPath || allPath.length === 0) {
            return [];
        }

        const params = allPath
            .filter(({ active }) => active === true)
            .map(({ language: locale, category, subcategory, slug }) => ({
                locale,
                category,
                subcategory,
                slug,
            }));

        return params;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return [];
    }
}

type Props = {
    params: Promise<{
        category: string;
        subcategory: string;
        locale: string;
        slug: string;
    }>;
};

const assertArticleRoute = (
    article: FullArticle,
    { category, subcategory }: { category: string; subcategory: string }
) => {
    if (article.category !== category || article.subcategory !== subcategory) {
        notFound();
    }
};

export async function generateMetadata({
                                           params,
                                       }: {
    params: Promise<{
        category: string;
        subcategory: string;
        locale: string;
        slug: string;
    }>;
}): Promise<Metadata> {
    const { locale, slug, category, subcategory } = await params;

    let article;
    try {
        article = await loadFullArticle({ slug, locale });
    } catch (error) {
        handleNotFound(error, { slug, locale, category, subcategory });
        throw error;
    }

    assertArticleRoute(article, { category, subcategory });

    const pathname = sitePath.article(category, subcategory, slug);
    const { canonical, languages } = buildAlternates({
        locale,
        pathname,
        locales: article.availableLanguages,
    });
    
    logDuplicateDomainUrl(canonical, { locale, category, subcategory, slug });
    Object.values(languages).forEach(url => logDuplicateDomainUrl(url, { locale, category, subcategory, slug }));

    return {
        title: article.title,
        description: article.description,
        authors: [{ name: "Jesus Near Team", url: SITE_URL }],
        openGraph: {
            title: article.title,
            description: article.description,
            url: canonical,
            type: 'article',
            images: [
                {
                    url: article.previewImageUrl,
                    alt: article.previewImageAlt,
                    width: 1200,
                    height: 630,
                },
            ],
            locale,
            publishedTime: article.createdAt ?? undefined,
            modifiedTime: article.updatedAt ?? undefined,
            authors: ['Jesus Near Team'],
            siteName: 'Jesus Near',
        },
        twitter: {
            card: 'summary_large_image',
            title: article.title,
            description: article.description,
            images: [article.previewImageUrl],
        },
        alternates: {
            canonical,
            languages,
        },
    };
}

const loadRecommendations = async (currentSlug: string) => {
    return Promise.all(
        categoriesConfig.map(({code}) => (
            async ()=> ({category: code, articles: (await loadArticlesRecommendations({ category: code, limit: 3 })).filter(article=>
                    article.slug !== currentSlug)
            }))()
        ));
}

const Page = async ({ params }: Props) => {
    const { category, subcategory, locale, slug } = await params;
    
    let article;
    try {
        article = await loadFullArticle({ slug, locale });
    } catch (error) {
        handleNotFound(error, { slug, locale, category, subcategory });
        throw error;
    }

    assertArticleRoute(article, { category, subcategory });
    
    const categoryArticles = await loadRecommendations(slug);

    return (
        <>
            <Header activeCategory={category} />
            <ArticlePage article={article} categoryArticles={categoryArticles} locale={locale}/>
            <Footer />
        </>
    );
};

export default Page;
