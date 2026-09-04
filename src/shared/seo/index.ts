export {
    SITE_URL,
    SUPPORTED_LOCALES,
    DEFAULT_LOCALE,
    sitePath,
    isSupportedLocale,
    buildLocalizedPath,
    buildLocalizedUrl,
    buildLanguageAlternates,
    buildAlternates,
} from './urls';
export type { SupportedLocale } from './urls';

export { default as JsonLd } from './JsonLd';

export {
    ORGANIZATION_NAME,
    AUTHOR_NAME,
    getAuthorUrl,
    getPersonAuthorSchema,
    getPublisherSchema,
    getOrganizationSchema,
    getWebsiteSchema,
    getArticleSchema,
} from './schemas';
