import { envConfig } from "@/shared/config/envConfig";
import { ArticlePath } from "@/features/articles/model/entities";

const minutes = 60;

export const loadAllArticlePath = async (): Promise<ArticlePath[]> => {
    const headers: HeadersInit = {};

    if (envConfig.secretKey) {
        headers['X-CLIENT-SECRET'] = envConfig.secretKey;
    }

    const res = await fetch(`${envConfig.serverUrl}/api/christianity/client/articles-paths`, {
        headers,
        next: {
            revalidate: minutes,
        },
    });

    if (!res.ok) {
        throw new Error('Failed to fetch article paths');
    }

    return res.json();
};
