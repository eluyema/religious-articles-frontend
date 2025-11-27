import { NextIntlClientProvider } from 'next-intl';
import {getMessages} from "next-intl/server";
import HtmlLayoutWrapper from "@/core/providers/HtmlLayoutWrapper";
import { handleNotFound } from "@/shared/utils/handleNotFound";

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
    } catch (error) {
        handleNotFound(error, { locale });
    }

    return (
        <HtmlLayoutWrapper locale={locale}>
            <NextIntlClientProvider locale={locale} messages={messages}>
                {children}
            </NextIntlClientProvider>
        </HtmlLayoutWrapper>
    );
}
