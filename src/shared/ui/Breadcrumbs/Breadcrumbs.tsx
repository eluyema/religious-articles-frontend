'use client';

import { Link } from '@/i18n/navigation';
import { baseUrl } from '@/shared/config/baseUrl';
import styles from './index.module.scss';

type BreadcrumbItem = {
    label: string;
    href: string;
};

type BreadcrumbsProps = {
    items: BreadcrumbItem[];
    locale: string;
};

const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
    // Generate structured data
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.label,
            item: `${baseUrl}${item.href}`,
        })),
    };

    return (
        <>
            <nav aria-label="Breadcrumb" className={styles.breadcrumbs}>
                <ol className={styles.breadcrumbList}>
                    {items.map((item, index) => (
                        <li key={index} className={styles.breadcrumbItem}>
                            {index < items.length - 1 ? (
                                <>
                                    <Link href={item.href} className={styles.breadcrumbLink}>
                                        {item.label}
                                    </Link>
                                    <span aria-hidden="true" className={styles.separator}>
                                        /
                                    </span>
                                </>
                            ) : (
                                <span className={styles.breadcrumbCurrent} aria-current="page">
                                    {item.label}
                                </span>
                            )}
                        </li>
                    ))}
                </ol>
            </nav>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
        </>
    );
};

export default Breadcrumbs;
