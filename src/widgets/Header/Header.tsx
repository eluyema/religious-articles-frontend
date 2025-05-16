import Image from "next/image";
import Link from "next/link";
import LocaleSwitcher from "@/shared/ui/LocaleSwitcher";
import styles from './index.module.scss';

import { useTranslations } from "next-intl";
import MobileMenu from "./MobileMenu"; // Client component
import {categoriesConfig} from "@/shared/config/categoriesConfig";
import classNames from "classnames";

type HeaderProps = {activeCategory?: string};

const Header = ({activeCategory}:HeaderProps) => {
    const t = useTranslations('categories');

    return (
        <header className={styles.header}>
            <div className={styles.headerContent}>
                <MobileMenu/>

                <div className={styles.logoBlock}>
                    <Link href="/" className={styles.link}>
                        <Image className={classNames(styles.icon, styles.desktop)} width={42} height={42} src="/jesusnear.png"
                               alt="Christian cross logo of website"/>
                        <Image className={classNames(styles.icon, styles.mobile)} width={28} height={28} src="/jesusnear.png"
                               alt="Christian cross logo of website"/>
                        <p className={styles.logoText}>Jesus Near</p>
                    </Link>
                </div>

                <nav className={styles.navigation}>
                    <ul className={styles.navigationContent}>
                        {categoriesConfig.map((category) => (
                            <Link className={classNames(styles.navLink, {[styles.navLinkActive]: activeCategory === category.code})} href={`/articles/${category.code}`} key={category.code}>
                                <span className={styles.navLinkText}>
                                    {t(`${category.code}.title`)}
                                </span>
                            </Link>
                        ))}
                    </ul>
                </nav>

                <div className={styles.localeSwitcherBlock}>
                    <LocaleSwitcher className={styles.localeSwitcher}/>
                </div>
            </div>
        </header>
    );
};

export default Header;
