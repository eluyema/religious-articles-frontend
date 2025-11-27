'use client';
import styles from './index.module.scss';

import {usePathname, useRouter} from '@/i18n/navigation';
import {supportedLocales, localeLabels, defaultLocale} from '@/shared/config/supportedLocales';
import {useParams} from 'next/navigation';
import * as Sentry from '@sentry/nextjs';

import classNames from 'classnames';

type LocaleSwitcherProps = {
    className?: string;
};

const LocaleSwitcher = ({ className = '' }: LocaleSwitcherProps) => {
    const router = useRouter();
    const params = useParams();
    const pathname = usePathname();

    // Correctly extract current locale from the route param
    const currentLocale = typeof params?.locale === 'string' && supportedLocales.includes(params.locale)
        ? params.locale
        : defaultLocale;

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLocale = e.target.value;

        document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;

        // Check if pathname contains domain (shouldn't happen, but log if it does)
        if (pathname.includes('jesusnear.com')) {
            Sentry.captureMessage('Domain found in pathname', {
                level: 'warning',
                tags: { error_type: 'domain_in_pathname' },
                extra: { pathname, newLocale, currentLocale },
            });
        }

        // Use next-intl's router which handles locale properly
        router.replace(pathname, { locale: newLocale });
    };

    return (
        <select className={classNames(styles.select, className)} value={currentLocale} onChange={handleChange} aria-label="Select language">
            {supportedLocales.map((locale) => (
                <option key={locale} value={locale}>
                    {localeLabels[locale]}
                </option>
            ))}
        </select>
    );
};

export default LocaleSwitcher;