import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Header from "@/widgets/Header";
import Footer from "@/widgets/Footer";
import { SUPPORTED_LOCALES, buildAlternates, sitePath } from "@/shared/seo";

import CategoryVerseListPage from "@/features/verses/ui/CategoryVerseListPage";
import {loadVersePreviewList} from "@/features/verses/api/loadVersePreviewList";

export function generateStaticParams() {
    return SUPPORTED_LOCALES.map(locale => ({ locale }));
}

type Props = {
    params: Promise<{ locale: string; }>;
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }>; }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'categoriesArticles' });

    const title = t(`verses.metaTitle`);
    const description = t(`verses.metaDescription`);
    const { canonical, languages } = buildAlternates({
        locale,
        pathname: sitePath.verses,
    });

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