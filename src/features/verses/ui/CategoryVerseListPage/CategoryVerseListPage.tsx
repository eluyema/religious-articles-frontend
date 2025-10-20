import {useTranslations} from "next-intl";
import Image, {StaticImageData} from "next/image";
import styles from "./index.module.scss";
import versesImg from '@/assets/categories/verses.png';
import {VersePreview} from "@/features/verses/model/VersePreview";
import CategoryVerseList from "@/features/verses/ui/CateogoryVerseList/CateogoryVerseList";


type CategoryVerseListPageProps = {
    verses: VersePreview[];
    locale: string;
};

const CategoryVerseListPage = ({ locale, verses }:CategoryVerseListPageProps) => {
    const t = useTranslations('categoriesArticles');

    const imageUrl = versesImg as StaticImageData || "";

    return (
        <div>
            <section className={styles.categorySection}>
                <div className={styles.content}>
                    <div className={styles.textBlock}>
                        <h1 className={styles.title}>{t(`verses.title`)}</h1>
                        <p className={styles.description}>{t(`verses.description`)}</p>
                    </div>
                </div>
                <div className={styles.imageBlock}>
                    <Image priority className={styles.categoryImage} src={imageUrl} alt={t(`verses.imageAlt`)} fill
                           objectFit="contain"/>
                </div>
            </section>
            <CategoryVerseList verses={verses} locale={locale}/>
        </div>
    );
};

export default CategoryVerseListPage;