import type { MetadataRoute } from 'next';
import { supportedLocales } from "@/shared/config/supportedLocales";
import { categoriesConfig } from "@/shared/config/categoriesConfig";
import { loadAllArticlePath } from "@/features/articles/api/endpoints/loadAllArticlePath";

const getBase = (locale: string) => {
    if(locale === "en") return "https://www.jesusnear.com";

    return `https://www.jesusnear.com/${locale}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const allPath = await loadAllArticlePath();

    const articlesUrls: MetadataRoute.Sitemap = allPath
        .filter(({ active }) => active)
        .map(({ slug, language, category, subcategory, updatedAt }) => {
            const base = getBase(language);

            return ({
            url: `${base}/articles/${category}/${subcategory}/${slug}`,
            lastModified: new Date(updatedAt),
            changeFrequency: 'monthly',
            priority: 0.4,
        })});

    const now = new Date();

    const staticUrls: MetadataRoute.Sitemap = supportedLocales.flatMap(locale => {
        const baseUrl = getBase(locale);

        const categoryUrls = categoriesConfig.map(category => ({
            url: `${baseUrl}/articles/${category.code}`,
            lastModified: now,
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }));

        const urls = [
            {
                url: baseUrl,
                lastModified: now,
                changeFrequency: 'weekly' as 'weekly' | 'monthly',
                priority: 1,
            },
            ...categoryUrls,
        ];


            urls.push({
                url: `${baseUrl}/privacy-policy`,
                lastModified: now,
                changeFrequency: 'monthly' as const,
                priority: 0.5,
            });

        return urls;
    });


    return [...staticUrls, ...articlesUrls];
}
