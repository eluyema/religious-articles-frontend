import { useTranslations } from "next-intl";
import styles from "./index.module.scss";
import classNames from "classnames";
import {VersePreview} from "@/features/verses/model/VersePreview";
import VersePreviewBlock from "@/features/verses/ui/VersePreviewBlock";

type CategoryVerseListProps = {
    verses: VersePreview[];
    locale: string;
    className?: string;
};

const CategoryVerseList = ({ verses, locale, className = '' }: CategoryVerseListProps) => {
    const t = useTranslations("categoriesArticles");
    const tCommon = useTranslations("common");

    const versesPreview = verses.filter((verse) =>
        verse.language === locale
    );

    return (
        <section className={classNames(styles.articlesSection, className)}>
            <h2 className={styles.listTitle}>{t(`verses.explore`)}</h2>
            {!versesPreview.length && (
                <p className={styles.notFoundText}>{tCommon("notFoundInYouLanguage")}</p>
            )}
            <ul className={styles.articlesList}>
                {versesPreview.map((versePreview) => (
                    <li key={versePreview.slug}>
                        <VersePreviewBlock
                            versePreview={versePreview}
                        />
                    </li>
                ))}
            </ul>
        </section>
    );
};

export default CategoryVerseList;
