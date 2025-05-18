import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';

import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script"; // Import Script from next
import "normalize.css";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export default async function RootLayout({children, params
                                   }: Readonly<{
    children: React.ReactNode;
    params: Promise<{locale: string}>
}>) {
    const { locale } = await params;
    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }

    return (
        <html lang={locale}>
        <head>
            <meta name="theme-color" content="#ffffff"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <link rel="shortcut icon" href="/favicon.ico"/>

            {/* Google Analytics */}
            <Script strategy="afterInteractive"
                    src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}`}/>
            <Script id="google-analytics" strategy="afterInteractive">
                {`window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}');`}
            </Script>
            <link rel="apple-touch-icon" href="/apple-touch-icon.png"/>
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
            <link rel="manifest" href="/manifest.json"/>

        </head>
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <NextIntlClientProvider>
            {children}
        </NextIntlClientProvider>
        </body>
        </html>
    );
}
