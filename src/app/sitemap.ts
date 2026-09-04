import type { MetadataRoute } from 'next';
import { articleCategoriesConfig } from "@/shared/config/categoriesConfig";
import { loadAllArticlePath } from "@/features/articles/api/endpoints/loadAllArticlePath";
import {loadVersePreviewList} from "@/features/verses/api/loadVersePreviewList";
import { logDuplicateDomainUrl } from "@/shared/utils/logDuplicateDomainUrl";
import { SUPPORTED_LOCALES, buildLocalizedUrl, sitePath } from "@/shared/seo";

const toLastModified = (value?: string): Date | undefined => {
    if (!value) {
        return undefined;
    }

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? undefined : date;
};

const withUrl = (url: string, lastModified?: Date): MetadataRoute.Sitemap[number] => {
    logDuplicateDomainUrl(url, { url });
    return lastModified ? { url, lastModified } : { url };
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const allPath = await loadAllArticlePath();
    const versePreviews = await loadVersePreviewList();

    const articlesUrls = allPath
        .filter(({ active }) => active)
        .map(({ slug, language, category, subcategory, updatedAt }) => {
            const url = buildLocalizedUrl({
                locale: language,
                pathname: sitePath.article(category, subcategory, slug),
            });
            logDuplicateDomainUrl(url, {
                language,
                category,
                subcategory,
                slug,
            });
            return withUrl(url, toLastModified(updatedAt));
        });

    const versesUrls = versePreviews.map(({ slug, language, updatedAt }) => {
        const url = buildLocalizedUrl({
            locale: language,
            pathname: sitePath.verse(slug),
        });
        logDuplicateDomainUrl(url, { language, slug });
        return withUrl(url, toLastModified(updatedAt));
    });

    const staticPathnames = [
        sitePath.home,
        ...articleCategoriesConfig.map(({ code }) => sitePath.category(code)),
        sitePath.verses,
        sitePath.about,
        sitePath.privacyPolicy,
    ];

    const staticUrls = SUPPORTED_LOCALES.flatMap((locale) =>
        staticPathnames.map((pathname) =>
            withUrl(buildLocalizedUrl({ locale, pathname }))
        )
    );

    const seen = new Set<string>();
    return [...staticUrls, ...articlesUrls, ...versesUrls].filter(({ url }) => {
        if (seen.has(url)) {
            return false;
        }
        seen.add(url);
        return true;
    });
}
