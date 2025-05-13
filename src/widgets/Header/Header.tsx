import Image from "next/image";

import styles from './index.module.scss';
import Link from "next/link";

const Header = () => {
    return <header className={styles.header}>
        <div className={styles.headerContent}>
            <Link href="/" className={styles.link}>
                <Image className={styles.icon} width={42} height={42} src="/jesusnear.png" alt="Christian cross logo of website" />
                <p className={styles.logoText}>Jesus Near</p>
            </Link>
            <nav>
                <ul>
                    <li>

                    </li>
                </ul>
            </nav>
        </div>
    </header>
};

export default Header;