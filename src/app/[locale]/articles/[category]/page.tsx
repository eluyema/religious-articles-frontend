import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import CategoryArticleListPage from "@/features/articles/ui/CategoryArticleListPage";
import { categoriesConfig } from "@/shared/config/categoriesConfig";
import Header from "@/widgets/Header";
import Footer from "@/widgets/Footer";

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

export async function generateMetadata({ params }: { params: Promise<{ category: string; locale: string }>; }): Promise<Metadata> {
    const {locale, category} = await params;
    const t = await getTranslations({ locale, namespace: 'categoriesArticles' });

    return {
        title: t(`${category}.metaTitle`),
        description: t(`${category}.metaDescription`)
    };
}


const Page = async ({ params }: Props) => {
    const { category } = await params;

    return (
        <>
            <Header activeCategory={category}/>
        <CategoryArticleListPage category={category} articles={[]} />
            <Footer/>
    </>
    );
};

export default Page;