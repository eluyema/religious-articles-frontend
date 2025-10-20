export interface Verse {
    slug: string;
    lang: string;

    verseText: string;

    book: number;
    chapter: number;
    verse: number;

    content: string;
    metadata: {
         title: string;
         description: string;
         canonical: string;
         keywords: string[];
         ogTitle: string;
         ogDescription: string;
     },
    createdAt: string;
    updatedAt: string;
}