import Image from "next/image";

import styles from './index.module.scss';

const Header = () => {
    return <header className={styles.header}>
        <div className={styles.headerContent}>
            <Image className={styles.icon} width={42} height={42} src="/jesusnear.png" alt="Christian cross logo of website" />
            <p className={styles.logoText}>Jesus Near</p>
        </div>
    </header>
};

export default Header;