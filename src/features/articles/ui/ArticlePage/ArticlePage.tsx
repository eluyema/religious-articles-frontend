import {Article, FullArticle} from "@/features/articles/model/entities";
import styles from "./index.module.scss";
import Image from "next/image";
import {Link} from "@/i18n/navigation";
import {useTranslations} from "next-intl";
import ArticleRenderer from "@/features/articles/ui/ArticleRenderer";
import CategoryArticlesList from "@/features/articles/ui/CateogoryArticleList/CateogoryArticleList";
import Breadcrumbs from "@/shared/ui/Breadcrumbs";
import TableOfContents from "@/shared/ui/TableOfContents";
import ShareButtons from "@/shared/ui/ShareButtons";
import { extractHeadings } from "@/shared/utils/extractHeadings";
import { calculateReadingTime } from "@/shared/utils/calculateReadingTime";
import { baseUrl } from "@/shared/config/baseUrl";

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
        { label: 'Home', href: '/' },
        { label: t(`${article.category}.title`), href: `/articles/${article.category}` },
        { label: article.title, href: `/articles/${article.category}/${article.subcategory}/${article.slug}` },
    ];

    // Generate canonical URL for sharing
    const articlePath = `articles/${article.category}/${article.subcategory}/${article.slug}`;
    const shareUrl = `${baseUrl}/${locale === 'en' ? '' : `${locale}/`}${articlePath}`.replace(/\/+/g, '/');

    return (
        <>
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
                {headings.length > 0 && (
                    <div className={styles.tocMobile}>
                        <TableOfContents headings={headings} />
                    </div>
                )}
                <div className={styles.articleLayout}>
                    {headings.length > 0 && (
                        <aside className={styles.tocSidebar}>
                            <TableOfContents headings={headings} />
                        </aside>
                    )}
                    <div className={styles.articleContent}>
                        <ArticleRenderer data={article.content} />
                        <ShareButtons
                            url={shareUrl}
                            title={article.title}
                            description={article.description}
                            imageUrl={article.previewImageUrl}
                        />
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
