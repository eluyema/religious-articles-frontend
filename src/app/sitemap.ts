import type { MetadataRoute } from 'next';
import { supportedLocales } from "@/shared/config/supportedLocales";
import { categoriesConfig } from "@/shared/config/categoriesConfig";
import { loadAllArticlePath } from "@/features/articles/api/endpoints/loadAllArticlePath";
import {loadVersePreviewList} from "@/features/verses/api/loadVersePreviewList";
import { logDuplicateDomainUrl } from "@/shared/utils/logDuplicateDomainUrl";

const getBase = (locale: string) => {
    if(locale === "en") return "https://www.jesusnear.com";

    return `https://www.jesusnear.com/${locale}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> { // TODO: make it more clean 0_0
    const allPath = await loadAllArticlePath();
    const versePreviews = await loadVersePreviewList();

    const articlesUrls: MetadataRoute.Sitemap = allPath
        .filter(({ active }) => active)
        .map(({ slug, language, category, subcategory, updatedAt }) => {
            const base = getBase(language);
            const url = `${base}/articles/${category}/${subcategory}/${slug}`;
            logDuplicateDomainUrl(url, { 
                language, 
                category, 
                subcategory, 
                slug,
                base,
                rawData: { slug, language, category, subcategory }
            });
            return ({
            url,
            lastModified: new Date(updatedAt),
            changeFrequency: 'yearly',
            priority: 0.4,
        })});

    const versesUrls: MetadataRoute.Sitemap = versePreviews
        .map(({ slug, language, updatedAt }) => {
            const base = getBase(language);
            const url = `${base}/verses/${slug}`;
            logDuplicateDomainUrl(url, { 
                language, 
                slug,
                base,
                rawData: { slug, language }
            });
            return ({
                url,
                lastModified: new Date(updatedAt),
                changeFrequency: 'yearly',
                priority: 0.4,
            })});

    const now = new Date();

    const staticUrls: MetadataRoute.Sitemap = supportedLocales.flatMap(locale => {
        const baseUrl = getBase(locale);

        const categoryUrls = categoriesConfig.map(category => ({
            url: category.code === "verses" ?`${baseUrl}/verses` : `${baseUrl}/articles/${category.code}`,
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
        urls.push({
            url: `${baseUrl}/about`,
            lastModified: now,
            changeFrequency: 'monthly' as const,
            priority: 0.6,
        });

        return urls;
    });


    return [...staticUrls, ...articlesUrls, ...versesUrls];
}
