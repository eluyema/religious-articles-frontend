import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';

import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script"; // Import Script from next
import "normalize.css";
import "./globals.css";
import Header from "@/widgets/Header/Header";
import Footer from "@/widgets/Footer/Footer";
import {baseUrl} from "@/shared/config/baseUrl";

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
            <meta name="theme-color" content="#ffffff" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />

            {/* Google Analytics */}
            <Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}`} />
            <Script id="google-analytics" strategy="afterInteractive">
                {`window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}');`}
            </Script>

            {/* todo: move it from root layout*/}
            <link rel="alternate" hrefLang="x-default" href={`${baseUrl}/en`} />
            {routing.locales.filter(loc=>loc !== locale).map((loc) => (
                <link
                    key={loc}
                    rel="alternate"
                    hrefLang={loc}
                    href={`${baseUrl}/${loc}`}
                />
            ))}
        </head>
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Header/>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
        <Footer/>
        </body>
        </html>
    );
}
