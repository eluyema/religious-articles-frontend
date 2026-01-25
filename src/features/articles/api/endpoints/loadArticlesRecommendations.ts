import { Article } from "@/features/articles/model/entities";
import { getArticleRecommendations } from "@/features/articles/api/staticArticleData";

type Params = { category: string; limit: number };

export const loadArticlesRecommendations = async ({ category, limit = 5 }: Params): Promise<Article[]> => {
    return getArticleRecommendations(category, limit);
};
