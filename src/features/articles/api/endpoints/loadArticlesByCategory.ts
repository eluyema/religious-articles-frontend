import { Article } from "@/features/articles/model/entities";
import { getArticlesByCategory } from "@/features/articles/api/staticArticleData";

export const loadArticlesByCategory = async (category: string): Promise<Article[]> => {
    return getArticlesByCategory(category);
};
