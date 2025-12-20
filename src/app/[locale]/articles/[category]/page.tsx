import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import CategoryArticleListPage from "@/features/articles/ui/CategoryArticleListPage";
import { categoriesConfig } from "@/shared/config/categoriesConfig";
import Header from "@/widgets/Header";
import Footer from "@/widgets/Footer";
import {loadArticlesByCategory} from "@/features/articles/api/endpoints/loadArticlesByCategory";
import NotFoundPage from "@/shared/ui/NotFoundPage";

export function generateStaticParams() {
    const categories = categoriesConfig.map(({ code }) => code);

    const locales = ['en', 'es', 'de', 'fr', 'pt', 'ru'];

    return locales.flatMap(locale =>
        categories.map(category => ({
            locale,
            category
        }))
    );
}

type Props = {
    params: Promise<{
        category: string;
        locale: string;
    }>;
};

function generateAlternates({
                                       baseUrl,
                                       locale,
                                       locales,
                                       category,
                                   }: {
    baseUrl: string;
    locale: string;
    locales: string[];
    category: string;
}) {
    const normalize = (lng: string) =>
        `${baseUrl}/${lng === "en" ? "" : lng}/${category}`.replace(/\/+/g, "/");

    return {
        canonical: normalize(locale),
        languages: Object.fromEntries(locales.map((lng) => [lng, normalize(lng)])),
    };
}


export async function generateMetadata({ params }: { params: Promise<{ category: string; locale: string }>; }): Promise<Metadata> {
    const {locale, category} = await params;
    
    // Validate that category exists in categoriesConfig
    const validCategory = categoriesConfig.find(cat => cat.code === category);
    if (!validCategory) {
        // If category doesn't exist, return default metadata
        return {
            title: 'Articles - Jesus Near',
            description: 'Browse Christian articles and resources.',
        };
    }

    const t = await getTranslations({ locale, namespace: 'categoriesArticles' });

    const baseUrl = "https://jesusnear.com";
    const locales = ["en", "es", "de", "fr", "pt", "ru"];

    const { canonical } = generateAlternates({baseUrl, locale, locales, category});

    // Use fallback values if translation doesn't exist
    const metaTitle = t(`${category}.metaTitle`, { defaultValue: `${category} Articles` });
    const metaDescription = t(`${category}.metaDescription`, { defaultValue: `Browse ${category} articles on Jesus Near.` });

    return {
        title: metaTitle,
        description: metaDescription,
        metadataBase: new URL(baseUrl),
        openGraph: {
            title: metaTitle,
            description: metaDescription,
            url: canonical,
            siteName: 'Jesus Near',
            images: [
                {
                    url: '/jesusnear-v2.png',
                    width: 1200,
                    height: 630,
                    alt: metaTitle,
                },
            ],
            locale: locale.replace('-', '_'),
            type: 'website',
        },
        alternates: generateAlternates({baseUrl, locale, locales, category}),
    };
}

const Page = async ({ params }: Props) => {
    const { category, locale } = await params;

    // Validate that category exists in categoriesConfig
    const validCategory = categoriesConfig.find(cat => cat.code === category);
    if (!validCategory) {
        // If category doesn't exist, show 404 page
        return (
            <>
                <Header />
                <NotFoundPage />
                <Footer />
            </>
        );
    }

    const articles = await loadArticlesByCategory(category);

    return (
        <><Header activeCategory={category}/>
        <CategoryArticleListPage category={category} articles={articles} locale={locale}/><Footer/>
    </>
    );
};

export default Page;