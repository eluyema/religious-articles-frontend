import { Metadata } from 'next';
import Header from "@/widgets/Header";
import Footer from "@/widgets/Footer";
import { loadFullArticle } from "@/features/articles/api/endpoints/loadFullArticle";
import ArticlePage from "@/features/articles/ui/ArticlePage";
import { loadAllArticlePath } from "@/features/articles/api/endpoints/loadAllArticlePath";
import { FullArticle } from "@/features/articles/model/entities";

const baseUrl = 'https://jesusnear.com';

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
    const allPath = await loadAllArticlePath();

    return allPath
        .filter(({ active }) => active)
        .map(({ language: locale, category, subcategory, slug }) => ({
            locale,
            category,
            subcategory,
            slug,
        }));
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
    const article = await loadFullArticle({ slug, locale });

    const path = `${category}/${subcategory}/${slug}`;
    const { canonical, languages } = generateAlternates({
        baseUrl,
        locale,
        locales: article.availableLanguages,
        path,
    });

    return {
        title: article.title,
        description: article.description,
        openGraph: {
            title: article.title,
            description: article.description,
            url: canonical,
            type: 'article',
            images: [
                {
                    url: article.previewImageUrl,
                    alt: article.previewImageAlt,
                },
            ],
            locale,
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
                    name: "JesusNear",
                    url: "https://jesusnear.com",
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

const Page = async ({ params }: Props) => {
    const { category, locale, slug } = await params;
    const article: FullArticle = await loadFullArticle({ slug, locale });

    return (
        <>
            <Header activeCategory={category} />
            <ArticlePage article={article} />
            <Footer />
        </>
    );
};

export default Page;
