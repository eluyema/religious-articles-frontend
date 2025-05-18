'use client';

import { useState } from 'react';
import BurgerIcon from "@/widgets/Header/BurgerIcon";
import CrossIcon from "@/widgets/Header/CrossIcon";
import styles from './index.module.scss';
// import dynamic from 'next/dynamic';
import {categoriesConfig} from "@/shared/config/categoriesConfig";
import {Link} from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import classNames from "classnames";

const MobileMenu = () => {
    const [open, setOpen] = useState(false);
    const t = useTranslations('categories');

    return (
            <div className={styles.menuBlock}>
                <button onClick={() => setOpen(!open)} className={styles.burgerButton}>
                    {open ? <CrossIcon/> : <BurgerIcon/>}
                </button>
                <div
                    className={classNames(styles.mobileNavOverlay, {
                        [styles.mobileNavOverlayOpen]: open,
                    })}
                >
                    <nav className={styles.navigation}>
                        <ul className={styles.navigationContent}>
                            {categoriesConfig.map((category) => (
                                <Link onClick={()=>setOpen(false)} className={styles.navLink} href={`/articles/${category.code}`}
                                      key={category.code}>
                                <span className={styles.navLinkText}>
                                    {t(`${category.code}.title`)}
                                </span>
                                </Link>
                            ))}
                        </ul>
                    </nav>
                </div>
            </div>
    );
};

export default MobileMenu;
