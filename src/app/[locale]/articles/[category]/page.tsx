import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import CategoryArticleListPage from "@/features/articles/ui/CategoryArticleListPage";
import { articleCategoriesConfig, isValidArticleCategory } from "@/shared/config/categoriesConfig";
import { supportedLocales } from "@/shared/config/supportedLocales";
import { buildAlternates, sitePath } from "@/shared/seo";
import Header from "@/widgets/Header";
import Footer from "@/widgets/Footer";
import {loadArticlesByCategory} from "@/features/articles/api/endpoints/loadArticlesByCategory";

export function generateStaticParams() {
    const categories = articleCategoriesConfig.map(({ code }) => code);

    return supportedLocales.flatMap(locale =>
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

export async function generateMetadata({ params }: { params: Promise<{ category: string; locale: string }>; }): Promise<Metadata> {
    const {locale, category} = await params;

    if (!isValidArticleCategory(category)) {
        notFound();
    }

    const t = await getTranslations({ locale, namespace: 'categoriesArticles' });
    const pathname = sitePath.category(category);
    const { canonical, languages } = buildAlternates({ locale, pathname });

    const metaTitle = t(`${category}.metaTitle`, { defaultValue: `${category} Articles` });
    const metaDescription = t(`${category}.metaDescription`, { defaultValue: `Browse ${category} articles on Jesus Near.` });

    return {
        title: metaTitle,
        description: metaDescription,
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
        twitter: {
            card: 'summary_large_image',
            title: metaTitle,
            description: metaDescription,
            images: ['/jesusnear-v2.png'],
        },
        alternates: { canonical, languages },
    };
}

const Page = async ({ params }: Props) => {
    const { category, locale } = await params;

    if (!isValidArticleCategory(category)) {
        notFound();
    }

    const articles = await loadArticlesByCategory(category);

    return (
        <><Header activeCategory={category}/>
        <CategoryArticleListPage category={category} articles={articles} locale={locale}/><Footer/>
    </>
    );
};

export default Page;
