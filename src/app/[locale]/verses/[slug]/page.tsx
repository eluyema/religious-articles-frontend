import { Metadata } from 'next';
import Header from "@/widgets/Header";
import Footer from "@/widgets/Footer";

import {loadVersePreviewList} from "@/features/verses/api/loadVersePreviewList";
import {loadVerse} from "@/features/verses/api/loadVerse";
import VersePage from "@/features/verses/ui/VersePage";
import { logDuplicateDomainUrl } from "@/shared/utils/logDuplicateDomainUrl";
import { handleNotFound } from "@/shared/utils/handleNotFound";

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
    const versePreviews = await loadVersePreviewList();

    return versePreviews
        .map(({ language: locale, slug }) => ({
            locale,
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
        locale: string;
        slug: string;
    }>;
}): Promise<Metadata> {
    const { locale, slug } = await params;
    
    let verse;
    try {
        verse = await loadVerse({ slug, locale });
    } catch (error) {
        handleNotFound(error, { slug, locale });
        throw error;
    }

    const path = `verses/${slug}`;
    const { canonical, languages } = generateAlternates({
        baseUrl,
        locale,
        locales: ['ru', 'en', 'fr', 'pt', 'es', 'ru'], // hardcode
        path,
    });
    
    logDuplicateDomainUrl(canonical, { locale, slug });
    Object.values(languages).forEach(url => logDuplicateDomainUrl(url, { locale, slug }));

    return {
        metadataBase: new URL(baseUrl),
        title: verse.metadata.title,
        description: verse.metadata.description,
        openGraph: {
            title: verse.metadata.ogTitle,
            description: verse.metadata.ogDescription,
            url: canonical,
            type: 'article',
            images: [
                {
                    url: '/jesusnear-v2.png',
                    width: 1200,
                    height: 630,
                    alt: verse.metadata.title,
                },
            ],
            locale,
            publishedTime: verse.createdAt ?? undefined,
            modifiedTime: verse.updatedAt ?? undefined,
            authors: ['Jesus Near Team'],
            siteName: 'Jesus Near',
        },
        twitter: {
            card: 'summary_large_image',
            title: verse.metadata.title,
            description: verse.metadata.description,
            images: ['/jesusnear-v2.png'],
        },
        alternates: {
            canonical,
            languages,
        },
        other: {
            'application/ld+json': JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Article",
                headline: verse.metadata.title,
                description: verse.metadata.description,
                author: {
                    "@type": "Organization",
                    name: "JesusNear",
                    url: "https://jesusnear.com",
                },
                datePublished: verse.createdAt,
                dateModified: verse.updatedAt,
                mainEntityOfPage: {
                    "@type": "WebPage",
                    "@id": canonical,
                },
            }),
        },
    };
}

function shuffle<T>(arr: Array<T>): Array<T> {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

const loadRecommendations = async (currentSlug: string) => {
    return shuffle((await loadVersePreviewList()).filter(verse => verse.slug !== currentSlug)).slice(0, 25); // TODO in server
}

const activeCategory = 'verse';

const Page = async ({ params }: Props) => {
    const { locale, slug } = await params;
    
    let verse;
    try {
        verse = await loadVerse({ slug, locale });
    } catch (error) {
        handleNotFound(error, { slug, locale });
        throw verse;
    }
    
    const versePreviews = (await loadRecommendations(slug));

    return (
        <>
            <Header activeCategory={activeCategory} />
            <VersePage verse={verse} recommendations={versePreviews} locale={locale} slug={slug}/>
            <Footer />
        </>
    );
};

export default Page;
