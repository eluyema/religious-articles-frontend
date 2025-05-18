'use client';
import styles from './index.module.scss';

import { useRouter, usePathname } from 'next/navigation';
import { supportedLocales, localeLabels } from '@/shared/config/supportedLocales';
import classNames from 'classnames';

type LocaleSwitcherProps = {
    className?: string;
};

const LocaleSwitcher = ({ className = '' }: LocaleSwitcherProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const currentLocale = pathname.split('/')[1];

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLocale = e.target.value;

        document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;

        const newPath = `/${newLocale}${pathname.replace(/^\/[a-z]{2}/, '')}`;

        router.push(newPath);
    };

    return (
        <select className={classNames(styles.select, className)} value={currentLocale} onChange={handleChange}>
            {supportedLocales.map((locale) => (
                <option key={locale} value={locale}>
                    {localeLabels[locale]}
                </option>
            ))}
        </select>
    );
};

export default LocaleSwitcher;
