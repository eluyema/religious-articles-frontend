import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Header from "@/widgets/Header";
import Footer from "@/widgets/Footer";
import { baseUrl } from "@/shared/config/baseUrl";
import { supportedLocales } from "@/shared/config/supportedLocales";

import CategoryVerseListPage from "@/features/verses/ui/CategoryVerseListPage";
import {loadVersePreviewList} from "@/features/verses/api/loadVersePreviewList";

export function generateStaticParams() {
    return supportedLocales.map(locale => ({ locale }));
}

type Props = {
    params: Promise<{ locale: string; }>;
};

function generateAlternates({
                                baseUrl: url,
                                locale,
                                locales,
                            }: {
    baseUrl: string;
    locale: string;
    locales: string[];
}) {
    const normalize = (lng: string) =>
        `${url}/${lng === "en" ? "" : lng}/verses`.replace(/\/+/g, "/");

    return {
        canonical: normalize(locale),
        languages: Object.fromEntries(locales.map((lng) => [lng, normalize(lng)])),
    };
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }>; }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'categoriesArticles' });

    const title = t(`verses.metaTitle`);
    const description = t(`verses.metaDescription`);
    const { canonical, languages } = generateAlternates({ baseUrl, locale, locales: supportedLocales });

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url: canonical,
            siteName: 'Jesus Near',
            images: [{ url: '/jesusnear-v2.png', width: 1200, height: 630, alt: title }],
            locale: locale.replace('-', '_'),
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: ['/jesusnear-v2.png'],
        },
        alternates: { canonical, languages },
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