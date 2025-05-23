'use client';
import styles from './index.module.scss';

import { usePathname, useRouter} from 'next/navigation';
import {supportedLocales, localeLabels, defaultLocale} from '@/shared/config/supportedLocales';

import classNames from 'classnames';

type LocaleSwitcherProps = {
    className?: string;
    currentLocale: string;
};

const LocaleSwitcher = ({ className = '', currentLocale}: LocaleSwitcherProps) => {
    const router = useRouter();

    const pathname = usePathname();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLocale = e.target.value;

        document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;

        const withoutLocale = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, '');

        const newPath = newLocale === defaultLocale
            ? withoutLocale || '/'
            : `/${newLocale}${withoutLocale}`;

        router.push(newPath);
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