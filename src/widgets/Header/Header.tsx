import Image from "next/image";
import {Link} from "@/i18n/navigation";
import LocaleSwitcher from "../../shared/ui/LocaleSwitcher";
import styles from './index.module.scss';

import { useTranslations } from "next-intl";
import MobileMenu from "./MobileMenu";
import {categoriesConfig} from "@/shared/config/categoriesConfig";
import classNames from "classnames";
import HeaderScrollScript from "@/widgets/Header/HeaderScrollScript";

type HeaderProps = {activeCategory?: string; className?: string};

const Header = ({activeCategory, className = ''}:HeaderProps) => {
    const t = useTranslations('categories');

    return (
        <header id="main-header" className={classNames(styles.header, className)}>
            <HeaderScrollScript/>
            <div className={styles.headerContent}>
                <MobileMenu/>

                <div className={styles.logoBlock}>
                    <Link href="/" className={styles.link}>
                        <Image className={classNames(styles.icon, styles.desktop)} width={42} height={42} src="/jesusnear-v2.png"
                               alt="Christian cross logo of website"/>
                        <Image className={classNames(styles.icon, styles.mobile)} width={28} height={28} src="/jesusnear-v2.png"
                               alt="Christian cross logo of website"/>
                        <p className={styles.logoText}>Jesus Near</p>
                    </Link>
                </div>

                <nav className={styles.navigation}>
                    <ul className={styles.navigationContent}>
                        {categoriesConfig.map((category) => (
                            <li key={category.code} className={classNames(styles.navLinkBlock, {[styles.navLinkBlockActive]: activeCategory === category.code})}>
                                <Link className={styles.navLink} href={`/articles/${category.code}`}>
                                <span className={styles.navLinkText}>
                                    {t(`${category.code}.title`)}
                                </span>
                                </Link>
                            </li>
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
