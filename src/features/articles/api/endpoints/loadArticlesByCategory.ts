import {envConfig} from "@/shared/config/envConfig";
import {Article} from "@/features/articles/model/entities";

const minutes = 60;

export const loadArticlesByCategory = async (category: string): Promise<Article[]> => {
    const headers: HeadersInit = {};

    if (envConfig.secretKey) {
        headers['X-CLIENT-SECRET'] = envConfig.secretKey;
    }

    const res = await fetch(`${envConfig.serverUrl}/api/christianity/client/articles?category=${category}`, {
        headers,
        next: {
            revalidate: minutes
        }
    });

    if (!res.ok) {
        throw new Error('Failed to fetch articles');
    }

    return res.json();
};
