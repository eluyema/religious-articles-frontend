import ky from "ky";
import {envConfig} from "@/shared/config/envConfig";
import { FullArticle } from "@/features/articles/model/entities";

export const loadFullArticle = async ({locale, slug}: {locale: string; slug: string;}): Promise<FullArticle> => {
    const article = await ky.get<FullArticle & {content: string}>(`${envConfig.serverUrl}/api/christianity/client/translations/${slug}/${locale}`, {
        headers: {
            'X-CLIENT-SECRET': envConfig.secretKey
        }
    }).json();

    return {
        ...article,
        content: JSON.parse(article.content)
    }
}