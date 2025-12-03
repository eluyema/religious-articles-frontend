import { envConfig } from "@/shared/config/envConfig";
import { ArticlePath } from "@/features/articles/model/entities";

const minutes = 60;

export const loadAllArticlePath = async (): Promise<ArticlePath[]> => {
    if (!envConfig.serverUrl) {
        return [];
    }

    const headers: HeadersInit = {};

    if (envConfig.secretKey) {
        headers['X-CLIENT-SECRET'] = envConfig.secretKey;
    }

    try {
        const res = await fetch(`${envConfig.serverUrl}/api/christianity/client/articles-paths`, {
            headers,
            next: {
                revalidate: minutes,
            },
        });

        if (!res.ok) {
            return [];
        }

        const data = await res.json();
        return Array.isArray(data) ? data : [];
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return [];
    }
};
