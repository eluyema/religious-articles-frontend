import ky from "ky";
import {envConfig} from "@/shared/config/envConfig";
import {ArticlePath, FullArticle} from "@/features/articles/model/entities";

export const loadAllArticlePath = async (): Promise<ArticlePath[]> => {
    return ky.get<FullArticle>(`${envConfig.serverUrl}/api/christianity/client/articles-paths`, {
        headers: {
            'X-CLIENT-SECRET': envConfig.secretKey
        }
    }).json()
}