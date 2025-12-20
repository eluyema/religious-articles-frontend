import Image from 'next/image';
import Link from 'next/link';
import { defaultLocale } from '@/shared/config/supportedLocales';
import { NextIntlClientProvider } from 'next-intl';
import HtmlLayoutWrapper from '@/core/providers/HtmlLayoutWrapper';
import Header from '@/widgets/Header';
import Footer from '@/widgets/Footer';
import NotFoundPage from '@/shared/ui/NotFoundPage';
import styles from './not-found.module.scss';

export default async function NotFound() {
  // Use default locale since this page is outside the [locale] route
  const messages = (await import(`../../messages/${defaultLocale}.json`)).default;

  return (
    <HtmlLayoutWrapper locale={defaultLocale}>
      <NextIntlClientProvider locale={defaultLocale} messages={messages}>
        <Header />
        <NotFoundPage />
        <Footer />
      </NextIntlClientProvider>
    </HtmlLayoutWrapper>
  );
}

