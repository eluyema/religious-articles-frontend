import { Metadata } from 'next';
import Image from 'next/image';
import Script from 'next/script';
import { getMessages, getTranslations } from 'next-intl/server';

import heroImage from '@/assets/jesus-with-family.png';
import Header from '@/widgets/Header';
import Footer from '@/widgets/Footer';
import styles from './index.module.scss';
import { baseUrl } from '@/shared/config/baseUrl';
import { defaultLocale, supportedLocales } from '@/shared/config/supportedLocales';

type Highlight = { title: string; description: string };
type ValueItem = { title: string; description: string };
type TimelineItem = { label: string; title: string; description: string };

const aboutPath = 'about';

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
    const aboutMeta = (messages as { about?: { meta?: Record<string, unknown> } }).about?.meta as {
        title?: string;
        description?: string;
        keywords?: string[];
        ogDescription?: string;
    };

    const { canonical, languages } = generateAlternates({
        baseUrl,
        locale,
        locales: supportedLocales,
        path: aboutPath,
    });

    return {
        title: aboutMeta?.title ?? 'About Jesus Near',
        description: aboutMeta?.description,
        keywords: aboutMeta?.keywords,
        authors: [{ name: 'Dan – Jesus Near', url: 'https://www.jesusnear.com' }],
        creator: 'Dan – Jesus Near',
        metadataBase: new URL(baseUrl),
        openGraph: {
            title: aboutMeta?.title,
            description: aboutMeta?.ogDescription ?? aboutMeta?.description,
            url: canonical,
            siteName: 'Jesus Near',
            images: [
                {
                    url: '/jesusnear-v2.png',
                    width: 1200,
                    height: 630,
                    alt: aboutMeta?.title ?? 'About Jesus Near',
                },
            ],
            locale: locale.replace('-', '_'),
            type: 'website',
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

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'about' });

    const heroHighlights = t.raw('hero.highlights') as Highlight[];
    const missionList = t.raw('mission.list') as string[];
    const danDetails = t.raw('dan.details') as string[];
    const values = t.raw('values.items') as ValueItem[];
    const timelineItems = t.raw('timeline.items') as TimelineItem[];
    const trustPoints = t.raw('trust.points') as string[];

    const localizedUrl = `${baseUrl}/${locale === defaultLocale ? '' : `${locale}/`}${aboutPath}`.replace(/\/+/g, '/');
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Dan',
        jobTitle: t('hero.badgeTitle'),
        description: t('hero.description'),
        url: localizedUrl,
        image: `${baseUrl}/jesusnear-v2.png`,
        affiliation: {
            '@type': 'Organization',
            name: 'Jesus Near',
            url: baseUrl,
        },
        knowsAbout: ['Jesus Christ', 'Bible study', 'Christian discipleship'],
        sameAs: [baseUrl, localizedUrl],
        contactPoint: [
            {
                '@type': 'ContactPoint',
                email: 'support@jesusnear.com',
                contactType: 'customer support',
                availableLanguage: supportedLocales,
            },
        ],
    };

    return (
        <>
            <Header />
            <main className={styles.page}>
                <section className={styles.hero}>
                    <div className={styles.heroText}>
                        <p className={styles.eyebrow}>{t('hero.eyebrow')}</p>
                        <h1 className={styles.title}>{t('hero.title')}</h1>
                        <p className={styles.lead}>{t('hero.description')}</p>
                        <ul className={styles.highlights} aria-label="Highlights about Jesus Near">
                            {heroHighlights.map((item) => (
                                <li key={item.title} className={styles.highlightCard}>
                                    <h3>{item.title}</h3>
                                    <p>{item.description}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className={styles.heroMedia}>
                        <div className={styles.imageFrame}>
                            <Image
                                src={heroImage}
                                alt={t('hero.imageAlt')}
                                className={styles.heroImage}
                                priority
                            />
                        </div>
                        <div className={styles.heroBadge}>
                            <p>{t('hero.badgeTitle')}</p>
                            <span>{t('hero.badgeSubtitle')}</span>
                        </div>
                    </div>
                </section>

                <section className={styles.mission}>
                    <div className={styles.sectionIntro}>
                        <p className={styles.eyebrow}>{t('mission.title')}</p>
                        <p className={styles.sectionText}>{t('mission.description')}</p>
                    </div>
                    <ul className={styles.missionList}>
                        {missionList.map((item) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>
                </section>

                <section className={styles.profile}>
                    <article className={styles.card}>
                        <p className={styles.eyebrow}>{t('dan.title')}</p>
                        <p className={styles.sectionText}>{t('dan.lead')}</p>
                        <ul className={styles.list}>
                            {danDetails.map((detail) => (
                                <li key={detail}>{detail}</li>
                            ))}
                        </ul>
                    </article>
                    <article className={styles.card}>
                        <p className={styles.eyebrow}>{t('values.title')}</p>
                        <p className={styles.sectionText}>{t('values.description')}</p>
                        <div className={styles.valuesGrid}>
                            {values.map((value) => (
                                <div key={value.title} className={styles.valueItem}>
                                    <h3>{value.title}</h3>
                                    <p>{value.description}</p>
                                </div>
                            ))}
                        </div>
                    </article>
                </section>

                <section className={styles.timeline}>
                    <div className={styles.sectionIntro}>
                        <p className={styles.eyebrow}>{t('timeline.title')}</p>
                    </div>
                    <div className={styles.timelineGrid}>
                        {timelineItems.map((item) => (
                            <div key={item.title} className={styles.timelineItem}>
                                <span className={styles.timelineLabel}>{item.label}</span>
                                <h3>{item.title}</h3>
                                <p>{item.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className={styles.trust}>
                    <div className={styles.trustContent}>
                        <p className={styles.eyebrow}>{t('trust.title')}</p>
                        <p className={styles.sectionText}>{t('trust.description')}</p>
                        <ul className={styles.list}>
                            {trustPoints.map((point) => (
                                <li key={point}>{point}</li>
                            ))}
                        </ul>
                    </div>
                    <div className={styles.trustQuote}>
                        <Image src="/christian_cross.svg" alt="Christian cross icon" width={64} height={64} />
                        <p>{t('trust.quote')}</p>
                        <span>{t('trust.signature')}</span>
                    </div>
                </section>

                <section className={styles.cta}>
                    <div className={styles.sectionIntro}>
                        <p className={styles.eyebrow}>{t('cta.title')}</p>
                        <p className={styles.sectionText}>{t('cta.description')}</p>
                    </div>
                    <div className={styles.ctaActions}>
                        <a className={styles.ctaButton} href="mailto:support@jesusnear.com">
                            {t('cta.button')}
                        </a>
                        <span className={styles.ctaEmail}>
                            {t('cta.emailLabel')}: <a href="mailto:support@jesusnear.com">support@jesusnear.com</a>
                        </span>
                    </div>
                </section>
            </main>
            <Footer />
            <Script
                id="about-jsonld"
                type="application/ld+json"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
        </>
    );
}

