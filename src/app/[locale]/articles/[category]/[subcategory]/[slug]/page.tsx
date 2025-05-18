import { Metadata } from 'next';
import Header from "@/widgets/Header";
import Footer from "@/widgets/Footer";
import {loadFullArticle} from "@/features/articles/api/endpoints/loadFullArticle";
import ArticlePage from "@/features/articles/ui/ArticlePage";
import {loadAllArticlePath} from "@/features/articles/api/endpoints/loadAllArticlePath";
import {FullArticle} from "@/features/articles/model/entities";

export async function generateStaticParams() {
    const allPath = await loadAllArticlePath();

    return allPath.flatMap(({language: locale, category, subcategory, slug}) =>
       ({
            locale,
            category,
            subcategory,
            slug
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

export async function generateMetadata({ params }: { params: Promise<{ category: string; locale: string; slug: string; subcategory: string; }>; }): Promise<Metadata> {
    const { locale, slug, category, subcategory } = await params;
    const article = await loadFullArticle({ slug, locale });

    const baseUrl = 'https://jesusnear.com';

    const currentUrl = `${baseUrl}/${locale}/${category}/${subcategory}/${slug}`;

    const languageAlternates = article.availableLanguages.reduce((acc, lang) => {
        acc[lang] = `${baseUrl}/${lang}/${category}/${subcategory}/${slug}`;
        return acc;
    }, {} as Record<string, string>);

    return {
        title: article.title,
        description: article.description,
        openGraph: {
            title: article.title,
            description: article.description,
            url: currentUrl,
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
            canonical: currentUrl,
            languages: languageAlternates
        },
        other: {
                'application/ld+json': JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Article",
                "headline": article.title,
                "description": article.description,
                "image": article.previewImageUrl,
                "author": {
                    "@type": "Organization",
                    "name": "JesusNear",
                    "url": "https://jesusnear.com"
                },
                "datePublished": article.createdAt,
                "dateModified": article.updatedAt,
                "mainEntityOfPage": {
                    "@type": "WebPage",
                    "@id": currentUrl
                }
            })
        }
    }
}

const Page = async ({ params }: Props) => {
    const { category, locale, slug } = await params;

    const article: FullArticle = await loadFullArticle({slug, locale});

    return (
        <><Header activeCategory={category}/>
            <ArticlePage article={article}/><Footer/>
        </>
    );
};

export default Page;