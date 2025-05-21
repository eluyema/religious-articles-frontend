import {defineRouting} from 'next-intl/routing';
import {defaultLocale, supportedLocales} from "@/shared/config/supportedLocales";

export const routing = defineRouting({
    // A list of all locales that are supported
    locales: supportedLocales,

    // Used when no locale matches
    defaultLocale: defaultLocale,
    localePrefix: 'as-needed'
});