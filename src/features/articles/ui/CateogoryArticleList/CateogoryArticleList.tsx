import { useTranslations } from "next-intl";
import {Article, ArticleTranslation} from "@/features/articles/model/entities";
import ArticleTranslationPreview from "@/features/articles/ui/ArticleTranslationPreview";
import styles from "./index.module.scss";
import classNames from "classnames";

type CategoryArticlesListProps = {
    category: string;
    articles: Article[];
    locale: string;
    className?: string;
};

const CategoryArticlesList = ({ category, articles, locale, className = '' }: CategoryArticlesListProps) => {
    const t = useTranslations("categoriesArticles");
    const tCommon = useTranslations("common");

    const readyCategoryArticles = articles.filter((article) =>
        article.translations.some(tr=>tr.language === locale) && article.active
    ).map(article=> ({
        slug: article.slug,
        category: article.category,
        subcategory: article.subcategory,
        translation: article.translations.find(tr=>tr.language === locale) as ArticleTranslation
    }));

    return (
        <section className={classNames(styles.articlesSection, className)}>
            <h2 className={styles.listTitle}>{t(`${category}.explore`)}</h2>
            {!articles.length && (
                <p className={styles.notFoundText}>{tCommon("notFoundInYouLanguage")}</p>
            )}
            <ul className={styles.articlesList}>
                {readyCategoryArticles.map((article) => (
                    <li key={article.slug}>
                        <ArticleTranslationPreview
                            slug={article.slug}
                            category={article.category}
                            subcategory={article.subcategory}
                            translation={article.translation}
                        />
                    </li>
                ))}
            </ul>
        </section>
    );
};

export default CategoryArticlesList;
