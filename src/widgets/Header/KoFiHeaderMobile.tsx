'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import kofiSymbol from '@/assets/kofi_brandasset/kofi_symbol.png';
import styles from './KoFiHeaderMobile.module.scss';

const KOFI_URL = 'https://ko-fi.com/jesusnear';

export default function KoFiHeaderMobile() {
    const t = useTranslations('support');

    return (
        <a
            href={KOFI_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
            aria-label={t('kofiAriaArticle')}
        >
            <Image
                src={kofiSymbol}
                alt=""
                width={kofiSymbol.width}
                height={kofiSymbol.height}
                className={styles.icon}
            />
            <span className={styles.label}>{t('kofiHeaderLabel')}</span>
        </a>
    );
}
