import styles from "./index.module.scss";
import {Link} from "@/i18n/navigation";
import {useTranslations} from "next-intl";
import {Verse} from "@/features/verses/model/Verse";
import {VersePreview} from "@/features/verses/model/VersePreview";
import CategoryVerseList from "@/features/verses/ui/CateogoryVerseList/CateogoryVerseList";
import ShareButtons from "@/shared/ui/ShareButtons";
import {baseUrl} from "@/shared/config/baseUrl";
import classNames from "classnames";
import AdSenseAd from "@/shared/ui/AdSenseAd/AdSenseAd";

const IN_CONTENT_AD_SLOT = '8774714496';
const BETWEEN_SECTIONS_AD_SLOT = '3091142973';

type VersePageProps = {
    verse: Verse;
    recommendations: VersePreview[]
    locale: string;
    slug: string;
};

const VersePage = ({ verse, recommendations, locale, slug }: VersePageProps) => {
    const t = useTranslations('categoriesArticles');
    const tBooks  = useTranslations('bibleBooks');
    
    // Generate canonical URL for sharing
    const versePath = `verses/${slug}`;
    const localePrefix = locale === 'en' ? '' : `${locale}/`;
    // Construct URL and normalize slashes (remove double slashes except after protocol)
    const shareUrl = `${baseUrl}/${localePrefix}${versePath}`.replace(/([^:]\/)\/+/g, '$1');
    const shareTitle = `${verse.verseText} - ${tBooks(`${verse.book}`)} ${verse.chapter}:${verse.verse}`;
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
                <div className={classNames(styles.verseArticle, styles.container)}>
                    <div dangerouslySetInnerHTML={{__html: verse.content}} />
                    <AdSenseAd adSlot={IN_CONTENT_AD_SLOT} adFormat="fluid" className={styles.inContentAd} />
                    <ShareButtons
                        url={shareUrl}
                        title={shareTitle}
                        description={verse.metadata?.description || verse.verseText}
                    />
                </div>
            </section>
            <div className={styles.adBetweenSections}>
                <AdSenseAd adSlot={BETWEEN_SECTIONS_AD_SLOT} />
            </div>
            <CategoryVerseList className={styles.categorySection} verses={recommendations} locale={locale}/>)
    </>
    );
};

export default VersePage;
