import ky from "ky";
import {envConfig} from "@/shared/config/envConfig";
import {Article} from "@/features/articles/model/entities";

export const loadArticlesByCategory = async (category: string): Promise<Article[]> => {
    return ky.get<Article[]>(`${envConfig.serverUrl}/api/christianity/client/articles?category=${category}`, {
        headers: {
            'X-CLIENT-SECRET': envConfig.secretKey
        }
    }).json()
}