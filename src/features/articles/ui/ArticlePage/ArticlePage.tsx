import { FullArticle } from "@/features/articles/model/entities";
import styles from "./index.module.scss";
import Image from "next/image";
import {Link} from "@/i18n/navigation";
import {useTranslations} from "next-intl";
import ArticleRenderer from "@/features/articles/ui/ArticleRenderer";

type ArticlePageProps = {
    article: FullArticle;
};

const ArticlePage = ({ article }: ArticlePageProps) => {
    const t = useTranslations('categoriesArticles');
    return (
        <>
        <section className={styles.previewSection}>
            <div className={styles.container}>
                <div className={styles.textBlock}>
                    <Link className={styles.categoryLink} href={`/articles/${article.category}`}>
                        {t(`${article.category}.title`)}
                    </Link>
                    <h1 className={styles.title}>{article.title}</h1>
                    <p className={styles.description}>{article.description}</p>
                </div>
                <div className={styles.imageBlock}>
                        <Image
                            className={styles.previewImage}
                            src={article.previewImageUrl}
                            alt={article.previewImageAlt}
                            fill
                            objectFit="cover"
                            objectPosition="center"
                            priority
                        />
                </div>
            </div>
        </section>
        <section className={styles.articleSection}>
            <div className={styles.container}>
                <ArticleRenderer data={article.content} />
            </div>
        </section>
    </>
    );
};

export default ArticlePage;
