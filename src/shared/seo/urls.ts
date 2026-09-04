import { baseUrl } from '@/shared/config/baseUrl';
import { defaultLocale, supportedLocales } from '@/shared/config/supportedLocales';

export const SITE_URL = baseUrl;
export const SUPPORTED_LOCALES = supportedLocales;
export const DEFAULT_LOCALE = defaultLocale;

export type SupportedLocale = (typeof supportedLocales)[number];

export function isSupportedLocale(locale: string): locale is SupportedLocale {
    return (supportedLocales as readonly string[]).includes(locale);
}

/** Unprefixed app paths. Always include the real route prefix (e.g. `/articles/`). */
export const sitePath = {
    home: '/',
    about: '/about',
    privacyPolicy: '/privacy-policy',
    verses: '/verses',
    verse: (slug: string) => `/verses/${slug}`,
    category: (category: string) => `/articles/${category}`,
    article: (category: string, subcategory: string, slug: string) =>
        `/articles/${category}/${subcategory}/${slug}`,
} as const;

function normalizePathname(pathname: string): string {
    const trimmed = pathname.trim();
    if (!trimmed || trimmed === '/') {
        return '/';
    }

    const withLeadingSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
    const collapsed = withLeadingSlash.replace(/\/+/g, '/');

    return collapsed.length > 1 && collapsed.endsWith('/')
        ? collapsed.slice(0, -1)
        : collapsed;
}

export function buildLocalizedPath({
    locale,
    pathname,
}: {
    locale: string;
    pathname: string;
}): string {
    const normalizedPath = normalizePathname(pathname);

    if (!locale || locale === DEFAULT_LOCALE) {
        return normalizedPath;
    }

    if (normalizedPath === '/') {
        return `/${locale}`;
    }

    return `/${locale}${normalizedPath}`;
}

export function buildLocalizedUrl({
    locale,
    pathname,
}: {
    locale: string;
    pathname: string;
}): string {
    const localizedPath = buildLocalizedPath({ locale, pathname });
    const url = new URL(localizedPath, `${SITE_URL}/`);

    if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
        url.pathname = url.pathname.slice(0, -1);
    }

    if (url.pathname === '/') {
        return SITE_URL;
    }

    return url.toString();
}

export function buildLanguageAlternates({
    pathname,
    locales = SUPPORTED_LOCALES,
}: {
    pathname: string;
    locales?: readonly string[];
}): Record<string, string> {
    const languages: Record<string, string> = {};

    for (const locale of locales) {
        languages[locale] = buildLocalizedUrl({ locale, pathname });
    }

    const defaultAlternateLocale = locales.includes(DEFAULT_LOCALE)
        ? DEFAULT_LOCALE
        : locales[0];

    if (defaultAlternateLocale) {
        languages['x-default'] = buildLocalizedUrl({
            locale: defaultAlternateLocale,
            pathname,
        });
    }

    return languages;
}

export function buildAlternates({
    locale,
    pathname,
    locales = SUPPORTED_LOCALES,
}: {
    locale: string;
    pathname: string;
    locales?: readonly string[];
}) {
    return {
        canonical: buildLocalizedUrl({ locale, pathname }),
        languages: buildLanguageAlternates({ pathname, locales }),
    };
}
