import {useTranslations} from "next-intl";
import Header from "@/widgets/Header";
import styles from "./page.module.scss";
import {Link} from "@/i18n/navigation";
import Image from "next/image";
import jesusIntro from "@/assets/jesus-with-family.png";
import classNames from "classnames";
import Footer from "@/widgets/Footer";
import {Article} from "@/features/articles/model/entities";
import CategoryArticlesList from "@/features/articles/ui/CateogoryArticleList/CateogoryArticleList";
import {categoriesConfig} from "@/shared/config/categoriesConfig";
import {VersePreview} from "@/features/verses/model/VersePreview";
import CategoryVerseList from "@/features/verses/ui/CateogoryVerseList/CateogoryVerseList";

type HomePageProps = {
    categoryArticles: {category: string; articles: Article[] }[]
    versePreviewList: VersePreview[];
    locale: string;
};

const HomePage = ({categoryArticles, locale, versePreviewList}:HomePageProps) => {
    const t = useTranslations('homepage');
    const tCategories = useTranslations('categories');

    return (<>
            <Header />
            <div className={styles.page}>
                <main className={styles.main}>
                    <section className={styles.introSection}>
                        <div className={styles.introSectionContent}>
                            <h1
                                className={styles.introTitle}
                                dangerouslySetInnerHTML={{__html: t.raw('introTitle')}}
                            />
                            <p className={styles.introText}>{t('introText')}</p>
                            <Link href="/articles/bible" className={styles.introButton}>
                                {t('introButton')}
                            </Link>

                            <Image
                                src={jesusIntro}
                                alt={t('introImageAlt')}
                                className={classNames(styles.introImage, styles.desktop)}
                                width={600}
                                height={400}
                            />
                            <Image
                                src={jesusIntro}
                                priority
                                alt={t('introImageAlt')}
                                className={classNames(styles.introImage, styles.mobile)}
                                width={350}
                                height={235}
                            />
                        </div>
                    </section>

                    <section className={styles.missionSection}>
                        <p className={styles.missionSectionCapture}>{t('missionCaption')}</p>
                        <h2
                            className={styles.missionSectionText}
                            dangerouslySetInnerHTML={{__html: t.raw('missionText')}}
                        />
                    </section>
                    <section className={styles.findCategorySection}>
                        <h2 className={styles.findCategoryTitle}>
                            {t("findCategoriesTitle")}
                        </h2>
                        <p className={styles.findCategoryDescription}>
                            {t("findCategoriesDescription")}
                        </p>

                        <div className={styles.categoriesLinksBlock}>
                            {categoriesConfig.filter(({code})=>code!== 'verses').map(({code})=> <Link key={code} className={styles.categoriesLink} href={`/articles/${code}`}>{tCategories(`${code}.title`)}</Link>)}
                        </div>
                    </section>
                    {categoryArticles.filter(({category})=>category !== 'verses').map(({category, articles}) =>
                        <CategoryArticlesList className={styles.categorySection} key={category} category={category} locale={locale} articles={articles}/>)}

                    <CategoryVerseList className={styles.categorySection} locale={locale} verses={versePreviewList}/>)
                </main>
            </div>
        <Footer/>
    </>)
};

export default HomePage;