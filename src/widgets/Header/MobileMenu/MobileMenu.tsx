'use client';

import { useState } from 'react';
import BurgerIcon from "@/widgets/Header/BurgerIcon";
import CrossIcon from "@/widgets/Header/CrossIcon";
import styles from './index.module.scss';
import {Link} from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import classNames from "classnames";

type MobileMenuProps = {
    categories: {code: string; name: string}[];
    buttons: {closeMenu: string}
};

const MobileMenu = ({categories}:MobileMenuProps) => {
    const [open, setOpen] = useState(false);
    const tHeader = useTranslations('header');

    return (
            <div className={styles.menuBlock}>
                <button onClick={() => setOpen(!open)} className={styles.burgerButton} aria-label={open ? tHeader("closeMenu") : tHeader("openMenu") }>
                    {open ? <CrossIcon/> : <BurgerIcon/>}
                </button>
                <div
                    className={classNames(styles.mobileNavOverlay, {
                        [styles.mobileNavOverlayOpen]: open,
                    })}
                >
                    <nav className={styles.navigation}>
                        <ul className={styles.navigationContent}>
                            {categories.map((category) => (
                                <li className={styles.navLinkBlock} key={category.code}>
                                    <Link onClick={()=>setOpen(false)} className={styles.navLink} href={`/articles/${category.code}`}>
                                        <span className={styles.navLinkText}>
                                            {category.name}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </div>
    );
};

export default MobileMenu;
