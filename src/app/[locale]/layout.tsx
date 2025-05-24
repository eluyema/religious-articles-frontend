import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import {getMessages} from "next-intl/server";
import HtmlLayoutWrapper from "@/core/providers/HtmlLayoutWrapper";

export default async function LocaleLayout({
                                               children,
                                               params,
                                           }: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    let messages;
    try {
        messages = await getMessages({ locale });
    } catch {
        notFound();
    }

    return (
        <HtmlLayoutWrapper locale={locale}>
            <NextIntlClientProvider locale={locale} messages={messages}>
                {children}
            </NextIntlClientProvider>
        </HtmlLayoutWrapper>
    );
}
