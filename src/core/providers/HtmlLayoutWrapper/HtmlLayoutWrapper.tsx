import { Geist, Geist_Mono } from 'next/font/google';
import 'normalize.css';
import './globals.scss';
import Script from 'next/script';
import { SpeedInsights } from '@vercel/speed-insights/next';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

type LayoutWrapperProps = {
    locale: string;
    children: React.ReactNode;
};

export default function HtmlLayoutWrapper({ locale, children }: LayoutWrapperProps) {
    return (
        <html lang={locale}>
        <head>
            <link rel="preconnect" href="https://www.googletagmanager.com" />
            <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
            <link rel="preconnect" href="https://d3kixxf71ic3lt.cloudfront.net" />
            <link rel="dns-prefetch" href="https://d3kixxf71ic3lt.cloudfront.net" />
            <meta name="p:domain_verify" content="eef8309d47547069927596cc76d55f09" />
        </head>
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <SpeedInsights />
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
