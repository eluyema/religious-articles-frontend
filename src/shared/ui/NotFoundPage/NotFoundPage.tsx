'use client';

import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import styles from './index.module.scss';

const NotFoundPage = () => {
  const t = useTranslations('notFound');

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.imageWrapper}>
          <Image
            src="/not_found.png"
            alt={t('title')}
            width={400}
            height={400}
            className={styles.image}
            priority
          />
        </div>
        <Link href="/" className={styles.homeButton}>
          {t('goHome')}
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;

