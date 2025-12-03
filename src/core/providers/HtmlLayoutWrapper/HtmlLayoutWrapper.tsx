import { Geist, Geist_Mono } from 'next/font/google';
import 'normalize.css';
import './globals.scss';
import Script from 'next/script';
import ResourceHints from './ResourceHints';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

type LayoutWrapperProps = {
    locale: string;
    children: React.ReactNode;
};

export default function HtmlLayoutWrapper({ locale, children }: LayoutWrapperProps) {
    return (
        <html lang={locale}>
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ResourceHints />
        <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}`}
        />
        <Script id="google-analytics" strategy="afterInteractive">
            {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}');
          `}
        </Script>
        {children}
        </body>
        </html>
    );
}
