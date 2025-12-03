import { Metadata } from 'next';
import Header from "@/widgets/Header";
import Footer from "@/widgets/Footer";
import { loadFullArticle } from "@/features/articles/api/endpoints/loadFullArticle";
import ArticlePage from "@/features/articles/ui/ArticlePage";
import { loadAllArticlePath } from "@/features/articles/api/endpoints/loadAllArticlePath";
import {loadArticlesRecommendations} from "@/features/articles/api/endpoints/loadArticlesRecommendations";
import {categoriesConfig} from "@/shared/config/categoriesConfig";
import { logDuplicateDomainUrl } from "@/shared/utils/logDuplicateDomainUrl";
import { handleNotFound } from "@/shared/utils/handleNotFound";

const baseUrl = 'https://jesusnear.com';

// Make route dynamic if static generation fails
export const dynamicParams = true;
export const revalidate = 3600; // Revalidate every hour

function generateAlternates({
                                baseUrl,
                                locale,
                                locales,
                                path,
                            }: {
    baseUrl: string;
    locale: string;
    locales: string[];
    path: string;
}) {
    const normalize = (lng: string) =>
        `${baseUrl}/${lng === 'en' ? '' : lng}/${path}`.replace(/\/+/g, '/');

    return {
        canonical: normalize(locale),
        languages: Object.fromEntries(locales.map((lng) => [lng, normalize(lng)])),
    };
}

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

    const path = `articles/${category}/${subcategory}/${slug}`;
    const { canonical, languages } = generateAlternates({
        baseUrl,
        locale,
        locales: article.availableLanguages,
        path,
    });
    
    logDuplicateDomainUrl(canonical, { locale, category, subcategory, slug });
    Object.values(languages).forEach(url => logDuplicateDomainUrl(url, { locale, category, subcategory, slug }));

    return {
        metadataBase: new URL(baseUrl),
        title: article.title,
        description: article.description,
        authors: [{ name: "Jesus Near Team", url: "https://jesusnear.com" }],
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
        other: {
            'application/ld+json': JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Article",
                headline: article.title,
                description: article.description,
                image: article.previewImageUrl,
                author: {
                    "@type": "Organization",
                    name: "Jesus Near",
                    url: "https://jesusnear.com",
                },
                publisher: {
                    "@type": "Organization",
                    name: "Jesus Near",
                    url: "https://jesusnear.com",
                    logo: {
                        "@type": "ImageObject",
                        url: "https://jesusnear.com/jesusnear-v2.png",
                    },
                },
                datePublished: article.createdAt,
                dateModified: article.updatedAt,
                mainEntityOfPage: {
                    "@type": "WebPage",
                    "@id": canonical,
                },
            }),
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
    const { category, locale, slug } = await params;
    
    let article;
    try {
        article = await loadFullArticle({ slug, locale });
    } catch (error) {
        handleNotFound(error, { slug, locale, category });
        throw error;
    }
    
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
