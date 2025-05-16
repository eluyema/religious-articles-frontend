
import { Metadata } from 'next';
//
// import {Article} from "@/features/articles/model/entities";

export async function generateStaticParams() {
    const categories = categoriesConfig.map(({code})=>code);

    return categories.map((category) => ({ category }));
}

import { getTranslations} from 'next-intl/server';
import CategoryArticleListPage from "@/features/articles/ui/CategoryArticleListPage";
import {categoriesConfig} from "@/shared/config/categoriesConfig";

type Props = {
    params: Promise<{
        category: string;
        locale: string;
    }>;
};

export async function generateMetadata({ params }: {
    params: Promise<{
        category: string;
        locale: string;
    }>;
}): Promise<Metadata> {
    const t = await getTranslations('categoriesArticles');
    const {category} = await params;
    return {
        title: t(`${category}.metaTitle`),
        description: t(`${category}.metaDescription`),
    };
}

export default async function Page({ params }: Props) {
    // const articles: Article[] = await fetch(
    //     `http://localhost:8080/api/christianity/client/articles?category=${params.category}`,
    //     {
    //         next: { revalidate: 60 }, // or `cache: 'no-store'` for SSR
    //         headers: {
    //             "X-CLIENT-SECRET": process.env.NEXT_SECRET_KEY || "",
    //         }
    //     }
    // );

    // const articles = await res.json();

    const { category } = await params;

    return (
        <CategoryArticleListPage category={category} articles={[]}/>
    );
}
