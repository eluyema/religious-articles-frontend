import {useTranslations} from "next-intl";
import Image, {StaticImageData} from "next/image";
import {Article, ArticleTranslation} from "@/features/articles/model/entities";
import bibleCategoryImg from "@/assets/categories/bible.png";
import jesusCategoryImg from "@/assets/categories/jesus.png";
import Head from "next/head";
import styles from "./index.module.scss";
import faithInLifeImg from '@/assets/categories/faith-in-life.png'
import jesusPrayImg from '@/assets/categories/jesus-pray.png';
import relationshipsImg from '@/assets/categories/relationships.png';
import ArticleTranslationPreview from "@/features/articles/ui/ArticleTranslationPreview";

const categoryImages: Record<string, StaticImageData> = {
    bible:  bibleCategoryImg,
    jesus: jesusCategoryImg,
    'faith-in-life': faithInLifeImg,
    prayer: jesusPrayImg,
    relationships: relationshipsImg
}

type CategoryArticleListPageProps = {
    category: string;
    articles: Article[];
    locale: string;
};

const CategoryArticleListPage = ({category, locale, articles }:CategoryArticleListPageProps) => {
    const t = useTranslations('categoriesArticles');
    const tCommon = useTranslations('common');

    const readyCategoryArticles = articles.filter((article) =>
        article.translations.some(tr=>tr.language === locale) && article.active
    ).map(article=> ({
        slug: article.slug,
        category: article.category,
        subcategory: article.subcategory,
        translation: article.translations.find(tr=>tr.language === locale) as ArticleTranslation
    }));

    const imageUrl = categoryImages[category] as StaticImageData || "";
    // const articles = await res.json();
    return (
        <div>
            <Head>
                <title>{category}</title>
            </Head>
            <section className={styles.categorySection}>
                <div className={styles.content}>
                    <div className={styles.textBlock}>
                        <h1 className={styles.title}>{t(`${category}.title`)}</h1>
                        <p className={styles.description}>{t(`${category}.description`)}</p>
                    </div>
                </div>
                <div className={styles.imageBlock}>
                    <Image className={styles.categoryImage} src={imageUrl} alt={t(`${category}.imageAlt`)} fill
                           objectFit="contain"/>
                </div>
            </section>
            <section className={styles.articlesSection}>
                <h2 className={styles.listTitle}>
                    {t(`${category}.explore`)}
                </h2>

                {!readyCategoryArticles.length && <p className={styles.notFoundText}>{tCommon("notFoundInYouLanguage")}</p>}
                <ul className={styles.articlesList}>
                    {readyCategoryArticles.map((article) => (<li key={article.slug}>
                        <ArticleTranslationPreview
                            slug={article.slug}
                            category={article.category}
                            subcategory={article.subcategory}
                            translation={article.translation}
                            />
                    </li>))}
                </ul>
            </section>
        </div>
    );
};

export default CategoryArticleListPage;