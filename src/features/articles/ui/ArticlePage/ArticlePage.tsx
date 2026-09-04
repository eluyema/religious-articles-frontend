import {Article, FullArticle} from "@/features/articles/model/entities";
import styles from "./index.module.scss";
import Image from "next/image";
import {Link} from "@/i18n/navigation";
import {useTranslations} from "next-intl";
import ArticleRenderer from "@/features/articles/ui/ArticleRenderer";
import CategoryArticlesList from "@/features/articles/ui/CateogoryArticleList/CateogoryArticleList";
import Breadcrumbs from "@/shared/ui/Breadcrumbs";
import ShareButtons from "@/shared/ui/ShareButtons";
import KoFiButton from "@/shared/ui/KoFiButton/KoFiButton";
import { extractHeadings } from "@/shared/utils/extractHeadings";
import { calculateReadingTime } from "@/shared/utils/calculateReadingTime";
import { JsonLd, buildLocalizedUrl, getArticleSchema, sitePath } from "@/shared/seo";

type ArticlePageProps = {
    article: FullArticle;
    categoryArticles: {category: string; articles: Article[] }[]
    locale: string;
};

const ArticlePage = ({ article, categoryArticles, locale }: ArticlePageProps) => {
    const t = useTranslations('categoriesArticles');
    
    const headings = extractHeadings(article.content);
    const readingTime = calculateReadingTime(article.content);

    const breadcrumbItems = [
        { label: 'Home', href: sitePath.home },
        { label: t(`${article.category}.title`), href: sitePath.category(article.category) },
        { label: article.title, href: sitePath.article(article.category, article.subcategory, article.slug) },
    ];

    const pathname = sitePath.article(article.category, article.subcategory, article.slug);
    const shareUrl = buildLocalizedUrl({ locale, pathname });
    const articleSchema = getArticleSchema({
        title: article.title,
        description: article.description,
        image: article.previewImageUrl,
        datePublished: article.createdAt,
        dateModified: article.updatedAt,
        canonicalUrl: shareUrl,
    });

    return (
        <>
        <JsonLd data={articleSchema} />
        <section className={styles.previewSection}>
            <div className={styles.previewSectionContent}>
                <Breadcrumbs items={breadcrumbItems} locale={locale} />
                <div className={styles.textBlock}>
                    <Link className={styles.categoryLink} href={`/articles/${article.category}`}>
                        {t(`${article.category}.title`)}
                    </Link>
                    <h1 className={styles.title}>{article.title}</h1>
                    <p className={styles.description}>{article.description}</p>
                    <div className={styles.metaInfo}>
                        <span className={styles.readingTime}>
                            {readingTime} {readingTime === 1 ? 'minute' : 'minutes'} read
                        </span>
                    </div>
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
                <div className={styles.articleLayout}>
                    <div className={styles.articleContent}>
                        <ArticleRenderer data={article.content} />
                        <div className={styles.articleFooter}>
                            <ShareButtons
                                url={shareUrl}
                                title={article.title}
                                description={article.description}
                                imageUrl={article.previewImageUrl}
                            />
                            <KoFiButton variant="prominent" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
            {categoryArticles.map(({category, articles}) =>
                !!articles.length && <CategoryArticlesList className={styles.categorySection} key={category} category={category} locale={locale} articles={articles}/>)}

    </>
    );
};

export default ArticlePage;
