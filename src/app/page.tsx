import { getMessages } from 'next-intl/server';
import { Metadata } from 'next';
import { baseUrl } from '@/shared/config/baseUrl';
import {defaultLocale, supportedLocales} from "@/shared/config/supportedLocales";
import HomePage from "@/shared/ui/HomePage/HomePage";
import {categoriesConfig} from "@/shared/config/categoriesConfig";
import {loadArticlesRecommendations} from "@/features/articles/api/endpoints/loadArticlesRecommendations";
import {NextIntlClientProvider} from "next-intl";
import HtmlLayoutWrapper from "@/core/providers/HtmlLayoutWrapper";

function generateAlternates({
                                baseUrl,
                                locale,
                                locales,
                                path = '',
                            }: {
    baseUrl: string;
    locale: string;
    locales: string[];
    path?: string;
}) {
    const normalize = (lng: string) =>
        `${baseUrl}/${lng === 'en' ? '' : lng}/${path}`.replace(/\/+/g, '/');

    return {
        canonical: normalize(locale),
        languages: Object.fromEntries(locales.map((lng) => [lng, normalize(lng)])),
    };
}

export async function generateMetadata(): Promise<Metadata> {
    const locale = 'en';
    const messages = await getMessages({ locale });
    const meta = messages.meta as typeof messages.meta;

    const { canonical, languages } = generateAlternates({
        baseUrl,
        locale,
        locales: supportedLocales,
        path: '',
    });

    return {
        title: meta.title,
        description: meta.description,
        keywords: meta.keywords,
        authors: [{ name: "Jesus Near Team", url: "https://jesusnear.com" }],
        creator: "Jesus Near Team",
        metadataBase: new URL(baseUrl),
        openGraph: {
            title: meta.title,
            description: meta.ogDescription,
            url: canonical,
            siteName: "Jesus Near",
            images: [
                {
                    url: "/jesusnear-v2.png",
                    width: 1200,
                    height: 630,
                    alt: meta.title,
                },
            ],
            locale: locale.replace('-', '_'),
            type: "website",
        },
        alternates: {
            canonical,
            languages,
        },
        icons: {
            icon: [
                { url: '/favicon-32x32-v2.png', sizes: '32x32', type: 'image/png' },
                { url: '/favicon-16x16-v2.png', sizes: '16x16', type: 'image/png' },
                { url: '/favicon-v2.ico', type: 'image/x-icon' },
            ],
            apple: '/apple-touch-icon-v2.png',
            shortcut: '/favicon-v2.ico',
            other: [
                { rel: 'icon', url: '/android-chrome-192x192-v2.png' },
                { rel: 'icon', url: '/android-chrome-512x512-v2.png' },
            ],
        },
    };
}

export default async function Page(){
    const categoryArticles = await Promise.all(
        categoriesConfig.map(({code}) => (
            async ()=> ({category: code, articles: await loadArticlesRecommendations({ category: code, limit: 3 })
            }))()
        ));
    return <HtmlLayoutWrapper locale={defaultLocale}>
        <NextIntlClientProvider locale={defaultLocale}><HomePage categoryArticles={categoryArticles} locale={defaultLocale}/> </NextIntlClientProvider></HtmlLayoutWrapper>;
};
