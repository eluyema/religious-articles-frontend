import styles from "./page.module.scss";
import Image from "next/image";
import jesusIntro from '../../assets/jesus-with-family.png';
import classNames from "classnames";
import { useTranslations } from "next-intl";

import { getMessages } from 'next-intl/server';
import { Metadata } from 'next';
import { baseUrl } from '@/shared/config/baseUrl';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const {locale} = await params;

  const messages = await getMessages({ locale });
  const meta = messages.meta as typeof messages.meta;

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
      url: baseUrl + '/' + locale,
      siteName: "Jesus Near",
      images: [
        {
          url: "/jesusnear.png",
          width: 1200,
          height: 630,
          alt: meta.title,
        },
      ],
      locale: locale.replace('-', '_'), // e.g. en-US
      type: "website",
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
    }
  };
}

export default function Home() {
  const t = useTranslations('homepage');

  return (
      <div className={styles.page}>
        <main className={styles.main}>
          <section className={styles.introSection}>
            <div className={styles.introSectionContent}>
              <h1
                  className={styles.introTitle}
                  dangerouslySetInnerHTML={{ __html: t.raw('introTitle') }}
              />
              <p className={styles.introText}>{t('introText')}</p>
              <button className={styles.introButton}>{t('introButton')}</button>

              <Image
                  src={jesusIntro}
                  alt={t('introImageAlt')}
                  className={classNames(styles.introImage, styles.desktop)}
                  width={600}
                  height={400}
              />
              <Image
                  src={jesusIntro}
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
  );
}
