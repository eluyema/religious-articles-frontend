'use client';

import { useEffect, useState } from 'react';
import styles from './index.module.scss';

type HeadingItem = {
    id: string;
    text: string;
    level: number;
};

type TableOfContentsProps = {
    headings: HeadingItem[];
};

const TableOfContents = ({ headings }: TableOfContentsProps) => {
    const [activeId, setActiveId] = useState<string>('');

    useEffect(() => {
        if (headings.length === 0) return;

        const observerOptions = {
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0,
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveId(entry.target.id);
                }
            });
        }, observerOptions);

        // Observe all heading elements
        headings.forEach(({ id }) => {
            const element = document.getElementById(id);
            if (element) {
                observer.observe(element);
            }
        });

        return () => {
            headings.forEach(({ id }) => {
                const element = document.getElementById(id);
                if (element) {
                    observer.unobserve(element);
                }
            });
        };
    }, [headings]);

    const handleClick = (id: string, e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            const offset = 100; // Offset for fixed header
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth',
            });

            // Update URL without triggering scroll
            window.history.pushState(null, '', `#${id}`);
            setActiveId(id);
        }
    };

    if (headings.length === 0) {
        return null;
    }

    return (
        <nav className={styles.toc} aria-label="Table of contents">
            <h2 className={styles.tocTitle}>Table of Contents</h2>
            <ul className={styles.tocList}>
                {headings.map((heading) => (
                    <li
                        key={heading.id}
                        className={`${styles.tocItem} ${styles[`level${heading.level}`]} ${
                            activeId === heading.id ? styles.active : ''
                        }`}
                    >
                        <a
                            href={`#${heading.id}`}
                            onClick={(e) => handleClick(heading.id, e)}
                            className={styles.tocLink}
                        >
                            {heading.text}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default TableOfContents;

