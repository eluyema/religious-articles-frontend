import Image from "next/image";
import Link from "next/link";
import LocaleSwitcher from "@/shared/ui/LocaleSwitcher";
import styles from './index.module.scss';

const Header = () => {

    return <header className={styles.header}>
        <div className={styles.headerContent}>
            <Link href="/" className={styles.link}>
                <Image className={styles.icon} width={42} height={42} src="/jesusnear.png"
                       alt="Christian cross logo of website"/>
                <p className={styles.logoText}>Jesus Near</p>
            </Link>
            <nav className={styles.navigation}>
                <ul>
                    <li>

                    </li>
                </ul>
            </nav>
            <div className={styles.localeSwitcherBlock}>
                <LocaleSwitcher
                    className={styles.localeSwitcher}
                />
            </div>
        </div>
    </header>
};

export default Header;