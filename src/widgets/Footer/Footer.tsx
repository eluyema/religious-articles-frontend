import styles from "./index.module.scss";

const Footer = () => {
    return <footer className={styles.footer}>
        <nav className={styles.footerContent}>
            <ul>
                <li>
                    <a href="/privacy-policy" className={styles.link}>Privacy Policy</a>
                </li>
            </ul>
        </nav>
    </footer>
}

export default Footer;