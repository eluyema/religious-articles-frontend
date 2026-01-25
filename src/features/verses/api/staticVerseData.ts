import contentData from "@/data/content.json";
import { Verse } from "@/features/verses/model/Verse";
import { VersePreview } from "@/features/verses/model/VersePreview";

type ContentDataShape = {
    verses?: Verse[];
    versePreviews?: VersePreview[];
};

const getData = (): ContentDataShape => {
    return contentData as ContentDataShape;
};

export const getVerse = ({ locale, slug }: { locale: string; slug: string }): Verse => {
    const { verses = [] } = getData();
    const verse = verses.find((item) => item.slug === slug && item.lang === locale);

    if (!verse) {
        throw new Error(`Verse not found: ${slug}`);
    }

    return verse;
};

export const getVersePreviewList = (): VersePreview[] => {
    const { versePreviews = [] } = getData();
    return versePreviews;
};
