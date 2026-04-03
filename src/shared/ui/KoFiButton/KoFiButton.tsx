'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import kofiSymbol from '@/assets/kofi_brandasset/kofi_symbol.png';
import styles from './KoFiButton.module.scss';

const KOFI_URL = 'https://ko-fi.com/jesusnear';

type KoFiButtonProps = {
    /** Article CTA: symbol + short “Support us” label (full context in aria-label) */
    variant?: 'prominent' | 'inline';
    className?: string;
};

export default function KoFiButton({ variant = 'prominent', className }: KoFiButtonProps) {
    const t = useTranslations('support');

    if (variant === 'inline') {
        return (
            <a
                href={KOFI_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.inline} ${className ?? ''}`.trim()}
                aria-label={t('kofiAria')}
            >
                <Image
                    src={kofiSymbol}
                    alt=""
                    width={kofiSymbol.width}
                    height={kofiSymbol.height}
                    className={styles.inlineSymbol}
                />
                <span>{t('kofi')}</span>
            </a>
        );
    }

    return (
        <a
            href={KOFI_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.prominent} ${className ?? ''}`.trim()}
            aria-label={t('kofiAriaArticle')}
        >
            <Image
                src={kofiSymbol}
                alt=""
                width={kofiSymbol.width}
                height={kofiSymbol.height}
                className={styles.prominentSymbol}
            />
            <span>{t('kofiHeaderLabel')}</span>
        </a>
    );
}
