import {useTranslations} from "next-intl";
import Image, {StaticImageData} from "next/image";
import {Article} from "@/features/articles/model/entities";
import bibleCategoryImg from "@/assets/categories/bible.png";
import jesusCategoryImg from "@/assets/categories/jesus.png";
import Head from "next/head";
import styles from "./index.module.scss";
import faithInLifeImg from '@/assets/categories/faith-in-life.png'
import jesusPrayImg from '@/assets/categories/jesus-pray.png';
import relationshipsImg from '@/assets/categories/relationships.png';

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
};

const CategoryArticleListPage = ({category, articles}:CategoryArticleListPageProps) => {
    const t = useTranslations('categoriesArticles');

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
        </div>
    );
};

export default CategoryArticleListPage;