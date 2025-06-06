import fs from 'fs/promises';
import path from 'path';
import { Metadata } from 'next';
import { getMessages } from 'next-intl/server';

import { baseUrl } from '@/shared/config/baseUrl';
import { defaultLocale, supportedLocales } from '@/shared/config/supportedLocales';

import Header from '@/widgets/Header';
import Footer from '@/widgets/Footer';
import styles from './index.module.scss';

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

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const locale = (await params).locale || defaultLocale;
    const messages = await getMessages({ locale });
    const meta = messages.meta?.privacyPolicy as typeof messages.meta.privacyPolicy;

    const { canonical, languages } = generateAlternates({
        baseUrl,
        locale,
        locales: supportedLocales,
        path: 'privacy-policy',
    });

    return {
        title: meta?.title ?? 'Privacy Policy',
        description: meta?.description,
        keywords: meta?.keywords,
        authors: [{ name: "Jesus Near Team", url: "https://jesusnear.com" }],
        creator: "Jesus Near Team",
        metadataBase: new URL(baseUrl),
        openGraph: {
            title: meta?.title,
            description: meta?.ogDescription,
            url: canonical,
            siteName: "Jesus Near",
            images: [
                {
                    url: "/jesusnear-v2.png",
                    width: 1200,
                    height: 630,
                    alt: meta?.title,
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

export default async function PrivacyPolicyPage({ }: { params: Promise<{ locale: string }> }) {
    const filePath = path.join(process.cwd(), 'src', 'app', '[locale]', 'privacy-policy', 'policy.html');
    const html = await fs.readFile(filePath, 'utf-8');

    return (
        <>
            <Header />
            <main className={styles.container}>
                <div
                    className={styles.content}
                    dangerouslySetInnerHTML={{ __html: html }}
                />
            </main>
            <Footer />
        </>
    );
}
