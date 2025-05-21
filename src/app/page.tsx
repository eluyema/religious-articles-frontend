import styles from "./page.module.scss";
import Image from "next/image";
import jesusIntro from '../assets/jesus-with-family.png';
import classNames from "classnames";
import { useTranslations } from "next-intl";
import Header from "@/widgets/Header";
import Footer from "@/widgets/Footer";
import { getMessages } from 'next-intl/server';
import { Metadata } from 'next';
import { baseUrl } from '@/shared/config/baseUrl';
import { Link } from "@/i18n/navigation";
import {supportedLocales} from "@/shared/config/supportedLocales";

// 🔹 Utility function to generate alternate URLs
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
                    url: "/jesusnear.png",
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
                { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
                { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
                { url: '/favicon.ico', type: 'image/x-icon' },
            ],
            apple: '/apple-touch-icon.png',
            shortcut: '/favicon.ico',
            other: [
                { rel: 'icon', url: '/android-chrome-192x192.png' },
                { rel: 'icon', url: '/android-chrome-512x512.png' },
            ],
        },
    };
}

export default function Page() {
    const t = useTranslations('homepage');

    return (
        <>
            <Header />
            <div className={styles.page}>
                <main className={styles.main}>
                    <section className={styles.introSection}>
                        <div className={styles.introSectionContent}>
                            <h1
                                className={styles.introTitle}
                                dangerouslySetInnerHTML={{ __html: t.raw('introTitle') }}
                            />
                            <p className={styles.introText}>{t('introText')}</p>
                            <Link href="/articles/bible" className={styles.introButton}>
                                {t('introButton')}
                            </Link>

                            <Image
                                src={jesusIntro}
                                alt={t('introImageAlt')}
                                className={classNames(styles.introImage, styles.desktop)}
                                width={600}
                                height={400}
                            />
                            <Image
                                src={jesusIntro}
                                priority
                                alt={t('introImageAlt')}
                                className={classNames(styles.introImage, styles.mobile)}
                                width={350}
                                height={235}
                            />
                        </div>
                    </section>

                    <section className={styles.missionSection}>
                        <p className={styles.missionSectionCapture}>{t('missionCaption')}</p>
                        <h2
                            className={styles.missionSectionText}
                            dangerouslySetInnerHTML={{ __html: t.raw('missionText') }}
                        />
                    </section>
                </main>
            </div>
            <Footer />
        </>
    );
}
