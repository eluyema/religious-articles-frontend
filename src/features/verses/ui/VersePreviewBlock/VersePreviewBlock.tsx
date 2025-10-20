import {Link} from "@/i18n/navigation";
import styles from './index.module.scss';
import {useTranslations} from "next-intl";
import {VersePreview} from "@/features/verses/model/VersePreview";

type VersePreviewBlockProps = {
    versePreview: VersePreview;
}

const VersePreviewBlock = ({ versePreview }: VersePreviewBlockProps) => {
    const t = useTranslations('categoriesArticles');
    const tBooks = useTranslations('bibleBooks');

    return <article className={styles.card}>
        <div className={styles.cardContent}>
            <Link className={styles.categoryLink} href={`/verses`}>
                {t(`verses.title`)}
            </Link>
            <h3 className={styles.title}>
                <Link href={`/verses/${versePreview.slug}`}>
                    {versePreview.content}
                </Link>
            </h3>
            <p className={styles.description}>
                {tBooks(`${versePreview.book}`) + " " + versePreview.chapter + ":" + versePreview.verse}
            </p>
        </div>
    </article>
};

export default VersePreviewBlock;