import { ArticlePath } from "@/features/articles/model/entities";
import { getAllArticlePaths } from "@/features/articles/api/staticArticleData";

export const loadAllArticlePath = async (): Promise<ArticlePath[]> => {
    return getAllArticlePaths();
};
