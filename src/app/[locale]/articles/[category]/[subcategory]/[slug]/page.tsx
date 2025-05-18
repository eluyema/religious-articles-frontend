import { Metadata } from 'next';
import Header from "@/widgets/Header";
import Footer from "@/widgets/Footer";
import {loadFullArticle} from "@/features/articles/api/endpoints/loadFullArticle";
import ArticlePage from "@/features/articles/ui/ArticlePage";
import {loadAllArticlePath} from "@/features/articles/api/endpoints/loadAllArticlePath";

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
    const {locale, slug} = await params;
    const article = await loadFullArticle({slug, locale});

    return {
        title: article.title,
        description: article.description
    };
}

const Page = async ({ params }: Props) => {
    const { category, locale, slug } = await params;

    const article = await loadFullArticle({slug, locale});

    return (
        <><Header activeCategory={category}/>
            <ArticlePage article={article}/><Footer/>
        </>
    );
};

export default Page;