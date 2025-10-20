import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Header from "@/widgets/Header";
import Footer from "@/widgets/Footer";

import CategoryVerseListPage from "@/features/verses/ui/CategoryVerseListPage";
import {loadVersePreviewList} from "@/features/verses/api/loadVersePreviewList";

export function generateStaticParams() {
    const locales = ['en', 'es', 'de', 'fr', 'pt', 'ru'];

    return locales.map(locale =>
        ({
            locale,
        })
    );
}

type Props = {
    params: Promise<{ locale: string; }>;
};

function generateAlternates({
                                baseUrl,
                                locale,
                                locales,
                            }: {
    baseUrl: string;
    locale: string;
    locales: string[];
}) {
    const normalize = (lng: string) =>
        `${baseUrl}/${lng === "en" ? "" : lng}/verses`.replace(/\/+/g, "/");

    return {
        canonical: normalize(locale),
        languages: Object.fromEntries(locales.map((lng) => [lng, normalize(lng)])),
    };
}


export async function generateMetadata({ params }: { params: Promise<{ locale: string }>; }): Promise<Metadata> {
    const { locale} = await params;
    const t = await getTranslations({ locale, namespace: 'categoriesArticles' });

    const baseUrl = "https://jesusnear.com";
    const locales = ["en", "es", "de", "fr", "pt", "ru"];

    return {
        title: t(`verses.metaTitle`),
        description: t(`verses.metaDescription`),
        alternates:
            generateAlternates({baseUrl, locale, locales}),
    };
}
const activeCategory ='verses';
const Page = async ({ params }: Props) => {
    const { locale } = await params;

    const versePreviews = await loadVersePreviewList();


    return (
        <><Header activeCategory={activeCategory}/>
            <CategoryVerseListPage verses={versePreviews} locale={locale}/><Footer/>
        </>
    );
};

export default Page;