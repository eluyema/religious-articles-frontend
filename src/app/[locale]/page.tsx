import { getMessages } from 'next-intl/server';
import { Metadata } from 'next';
import { baseUrl } from '@/shared/config/baseUrl';
import {supportedLocales} from "@/shared/config/supportedLocales";
import HomePage from "@/shared/ui/HomePage/HomePage";
import {loadArticlesRecommendations} from "@/features/articles/api/endpoints/loadArticlesRecommendations";
import {categoriesConfig} from "@/shared/config/categoriesConfig";
import {shuffle} from "@/shared/utils/shuffle";
import {loadVersePreviewList} from "@/features/verses/api/loadVersePreviewList";

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
  const {locale} = await params;
  const messages = await getMessages({ locale });
  const meta = messages.meta as typeof messages.meta;
  const { canonical, languages } = generateAlternates({
    baseUrl,
    locale,
    locales: supportedLocales,
    path: '', // Root page
  });

  // Organization and WebSite structured data
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Jesus Near',
    url: baseUrl,
    logo: `${baseUrl}/jesusnear-v2.png`,
    description: meta.description,
    sameAs: [],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'support@jesusnear.com',
      contactType: 'customer support',
      availableLanguage: supportedLocales,
    },
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Jesus Near',
    url: baseUrl,
    description: meta.description,
    inLanguage: supportedLocales,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    authors: [{ name: "Jesus Near Team", url: "https://jesusnear.com" }],
    creator: "Jesus Near Team",
    metadataBase: new URL(baseUrl),
    viewport: {
      width: 'device-width',
      initialScale: 1,
    },
    themeColor: '#ffffff',
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
    other: {
      'application/ld+json': JSON.stringify([organizationSchema, websiteSchema]),
    },
  };
}

const loadVersesRecommendations = async () => {
  return shuffle((await loadVersePreviewList())).slice(0, 10); // TODO in server
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }){
  const { locale } = await params;

  const categoryArticlesPromise = Promise.all(
      categoriesConfig.map(({code}) => (
          async ()=> ({category: code, articles: await loadArticlesRecommendations({ category: code, limit: 3 })
          }))()
      ));

    const versePreviewListPromise = loadVersesRecommendations();

  const [categoryArticles,versePreviewList] = await Promise.all([categoryArticlesPromise, versePreviewListPromise]);

  return <HomePage categoryArticles={categoryArticles} locale={locale} versePreviewList={versePreviewList}/>
};