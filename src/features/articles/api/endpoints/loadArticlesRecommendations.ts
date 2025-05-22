import {envConfig} from "@/shared/config/envConfig";
import {Article} from "@/features/articles/model/entities";

const minutes = 60;

type Params = { category: string, limit: number }

export const loadArticlesRecommendations = async ({ category, limit = 5 }: Params): Promise<Article[]> => {
    const headers: HeadersInit = {};

    if (envConfig.secretKey) {
        headers['X-CLIENT-SECRET'] = envConfig.secretKey;
    }

    const res = await fetch(`${envConfig.serverUrl}/api/christianity/client/article/recommendations?category=${category}`, {
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
