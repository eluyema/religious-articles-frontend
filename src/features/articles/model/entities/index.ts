export interface Article {
    id: string;
    category: string;
    subcategory: string;
    slug: string;
    active: boolean | null;
    author: Author;
    updatedAt: string; // ISO date string
    translations: ArticleTranslation[];
}

export interface Author {
    username: string;
    email: string;
    roles: string;
}

export interface ArticleTranslation {
    id: string;
    language: string;
    title: string;
    description: string;
    previewImageUrl: string;
    previewImageAlt: string;
    previewBlurImageImageUrl: string;
    content: string | null;
}
