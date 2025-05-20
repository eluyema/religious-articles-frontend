import type { MetadataRoute } from 'next'
import { supportedLocales } from "@/shared/config/supportedLocales";
import { categoriesConfig } from "@/shared/config/categoriesConfig";
import { loadAllArticlePath } from "@/features/articles/api/endpoints/loadAllArticlePath";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const allPath = await loadAllArticlePath();

    const articlesUrls: MetadataRoute.Sitemap = allPath
        .filter(({ active }) => active)
        .map(({ slug, language, category, subcategory, updatedAt }) => ({
            url: `https://www.jesusnear.com/${language}/articles/${category}/${subcategory}/${slug}`,
            lastModified: new Date(updatedAt),
            changeFrequency: 'monthly',
            priority: 0.4,
        }));

    const now = new Date();

    return [
        ...supportedLocales.flatMap(locale => [
            {
                url: `https://www.jesusnear.com/${locale}`,
                lastModified: now,
                changeFrequency: 'weekly' as const,
                priority: 1,
            },
            ...categoriesConfig.map(category => category.code).map(categoryCode => ({
                url: `https://www.jesusnear.com/${locale}/articles/${categoryCode}`,
                lastModified: now,
                changeFrequency: 'weekly' as const,
                priority: 0.8,
            })),
            {
                url: `https://www.jesusnear.com/${locale}/privacy-policy`,
                lastModified: now,
                changeFrequency: 'monthly' as const,
                priority: 0.5,
            },
        ]),
        ...articlesUrls
    ];
}
