import type { MetadataRoute } from 'next';
import { supportedLocales } from "@/shared/config/supportedLocales";
import { categoriesConfig } from "@/shared/config/categoriesConfig";
import { loadAllArticlePath } from "@/features/articles/api/endpoints/loadAllArticlePath";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const allPath = await loadAllArticlePath();

    const articlesUrls: MetadataRoute.Sitemap = allPath
        .filter(({ active }) => active)
        .map(({ slug, language, category, subcategory, updatedAt }) => ({
            url: `https://www.jesusnear.com/${language === 'en' ? '' : language}/articles/${category}/${subcategory}/${slug}`,
            lastModified: new Date(updatedAt),
            changeFrequency: 'monthly',
            priority: 0.4,
        }));

    const now = new Date();

    const staticUrls: MetadataRoute.Sitemap = supportedLocales.flatMap(locale => {
        const categoryUrls = categoriesConfig.map(category => ({
            url: `https://www.jesusnear.com/${locale === 'en' ? '' : locale}/articles/${category.code}`,
            lastModified: now,
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }));

        const urls = [
            {
                url: `https://www.jesusnear.com/${locale === 'en' ? '' : locale}`,
                lastModified: now,
                changeFrequency: 'weekly' as 'weekly' | 'monthly',
                priority: 1,
            },
            ...categoryUrls,
        ];

        // Only include privacy policy if not already removed — and adjust for default locale
        if (locale !== 'en') {
            urls.push({
                url: `https://www.jesusnear.com/${locale}/privacy-policy`,
                lastModified: now,
                changeFrequency: 'monthly' as const,
                priority: 0.5,
            });
        } else {
            urls.push({
                url: `https://www.jesusnear.com/privacy-policy`,
                lastModified: now,
                changeFrequency: 'monthly' as const,
                priority: 0.5,
            });
        }

        return urls;
    });


    return [...staticUrls, ...articlesUrls];
}
