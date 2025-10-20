import styles from "./index.module.scss";
import {Link} from "@/i18n/navigation";
import {useTranslations} from "next-intl";
import {Verse} from "@/features/verses/model/Verse";
import {VersePreview} from "@/features/verses/model/VersePreview";
import CategoryVerseList from "@/features/verses/ui/CateogoryVerseList/CateogoryVerseList";
import classNames from "classnames";

type VersePageProps = {
    verse: Verse;
    recommendations: VersePreview[]
    locale: string;
};

const VersePage = ({ verse, recommendations, locale }: VersePageProps) => {
    const t = useTranslations('categoriesArticles');
    const tBooks  = useTranslations('bibleBooks');
    return (
        <>
        <section className={styles.previewSection}>
            <div className={styles.container}>
                <div className={styles.textBlock}>
                    <Link className={styles.categoryLink} href={`/verses`}>
                        {t(`verses.title`)}
                    </Link>
                </div>
                <div className={styles.verseBlock}>
                    <h3 className={styles.title}>
                            {verse.verseText}
                    </h3>
                    <p className={styles.description}>
                        {tBooks(`${verse.book}`) + " " + verse.chapter + ":" + verse.verse}
                    </p>
                </div>
            </div>
        </section>
            <section className={styles.articleSection}>
                <div className={classNames(styles.verseArticle, styles.container)} dangerouslySetInnerHTML={{__html: verse.content}}>
                </div>
            </section>
            <CategoryVerseList className={styles.categorySection} verses={recommendations} locale={locale}/>)
    </>
    );
};

export default VersePage;
