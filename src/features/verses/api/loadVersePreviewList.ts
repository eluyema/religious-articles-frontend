import { envConfig } from "@/shared/config/envConfig";
import { VersePreview } from "@/features/verses/model/VersePreview";

const minutes = 60;

export const loadVersePreviewList = async (): Promise<VersePreview[]> => {
    const headers: HeadersInit = {};

    if (envConfig.secretKey) {
        headers['X-CLIENT-SECRET'] = envConfig.secretKey;
    }

    const res = await fetch(`${envConfig.serverUrl}/api/christianity/client/verse-posts/preview-list`, {
        headers,
        next: {
            revalidate: minutes,
        },
    });

    if (!res.ok) {
        throw new Error('Failed to fetch verse preview list');
    }

    return res.json();
};
