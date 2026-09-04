import { DEFAULT_LOCALE, SITE_URL, SUPPORTED_LOCALES, buildLocalizedUrl, sitePath } from '@/shared/seo/urls';

export const ORGANIZATION_NAME = 'Jesus Near';
export const AUTHOR_NAME = 'Dan';

export const getAuthorUrl = () =>
    buildLocalizedUrl({ locale: DEFAULT_LOCALE, pathname: sitePath.about });

export const getPersonAuthorSchema = () => ({
    '@type': 'Person' as const,
    name: AUTHOR_NAME,
    url: getAuthorUrl(),
});

export const getPublisherSchema = () => ({
    '@type': 'Organization' as const,
    name: ORGANIZATION_NAME,
    url: SITE_URL,
    logo: {
        '@type': 'ImageObject' as const,
        url: `${SITE_URL}/jesusnear-v2.png`,
    },
});

export const getOrganizationSchema = (description?: string) => ({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: ORGANIZATION_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/jesusnear-v2.png`,
    ...(description ? { description } : {}),
    contactPoint: {
        '@type': 'ContactPoint',
        email: 'support@jesusnear.com',
        contactType: 'customer support',
        availableLanguage: [...SUPPORTED_LOCALES],
    },
});

export const getWebsiteSchema = (description?: string) => ({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: ORGANIZATION_NAME,
    url: SITE_URL,
    ...(description ? { description } : {}),
    inLanguage: [...SUPPORTED_LOCALES],
});

export const getArticleSchema = ({
    title,
    description,
    image,
    datePublished,
    dateModified,
    canonicalUrl,
}: {
    title: string;
    description: string;
    image?: string;
    datePublished?: string | null;
    dateModified?: string | null;
    canonicalUrl: string;
}) => ({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url: canonicalUrl,
    ...(image ? { image } : {}),
    author: getPersonAuthorSchema(),
    publisher: getPublisherSchema(),
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
    mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': canonicalUrl,
    },
});
