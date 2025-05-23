import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import CategoryArticleListPage from "@/features/articles/ui/CategoryArticleListPage";
import { categoriesConfig } from "@/shared/config/categoriesConfig";
import Header from "@/widgets/Header";
import Footer from "@/widgets/Footer";
import {loadArticlesByCategory} from "@/features/articles/api/endpoints/loadArticlesByCategory";

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
    const t = await getTranslations({ locale, namespace: 'categoriesArticles' });

    const baseUrl = "https://jesusnear.com";
    const locales = ["en", "es", "de", "fr", "pt", "ru"];

    return {
        title: t(`${category}.metaTitle`),
        description: t(`${category}.metaDescription`),
        alternates:
        generateAlternates({baseUrl, locale, locales, category}),
    };
}

const Page = async ({ params }: Props) => {
    const { category, locale } = await params;

    const articles = await loadArticlesByCategory(category);

    return (
        <><Header activeCategory={category} currentLocale={locale}/>
        <CategoryArticleListPage category={category} articles={articles} locale={locale}/><Footer/>
    </>
    );
};

export default Page;