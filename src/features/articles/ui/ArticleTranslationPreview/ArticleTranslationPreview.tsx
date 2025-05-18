import {ArticleTranslation} from "@/features/articles/model/entities";
import {Link} from "@/i18n/navigation";
import styles from './index.module.scss';
import Image from "next/image";
import {useTranslations} from "next-intl";

type ArticleTranslationPreviewProps = {
    slug: string;
    category: string;
    subcategory: string;
    translation: ArticleTranslation;
}

const ArticleTranslationPreview = ({category, slug, subcategory, translation}: ArticleTranslationPreviewProps) => {
    const t = useTranslations('categoriesArticles');

    return <article className={styles.card}>
        <div className={styles.cardContent}>
            <Link className={styles.categoryLink} href={`/articles/${category}`}>
                {t(`${category}.title`)}
            </Link>
            <h3 className={styles.title}>
                <Link href={`/articles/${category}/${subcategory}/${slug}`}>
                    {translation.title}
                </Link>
            </h3>
            <p className={styles.description}>
                {translation.description}
            </p>
        </div>
            <Link className={styles.cardImage} href={`/articles/${category}/${subcategory}/${slug}`}>

            <Image fill src={translation.previewImageUrl} alt={translation.previewImageAlt} objectFit="cover" objectPosition="center" />
            </Link>
    </article>
};

export default ArticleTranslationPreview;