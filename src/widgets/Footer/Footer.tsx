import styles from "./index.module.scss";
import {useTranslations} from 'next-intl';
import {Link} from "@/i18n/navigation";

const Footer = () => {
    const t = useTranslations('footer');

    return (
        <footer className={styles.footer}>
            <div className={styles.footerContent}>
                {/* Навигационные ссылки */}
                <nav className={styles.links} aria-label="Footer navigation">
                    <ul>
                        <li>
                            <Link href="/about" className={styles.link}>
                                {t('about')}
                            </Link>
                        </li>
                        <li>
                            <Link href="/privacy-policy" className={styles.link}>
                                {t('privacyPolicy')}
                            </Link>
                        </li>
                    </ul>
                </nav>

                {/* Контактная информация */}
                <address className={styles.contacts}>
                    <h3 className={styles.contactsTitle}>{t('contactUs')}</h3>
                    <table className={styles.contactsTable}>
                        <tbody>
                        <tr>
                            <td>{t('email')}</td>
                            <td className={styles.valuecell}><b>support@jesusnear.com</b></td>
                        </tr>
                        </tbody>
                    </table>
                </address>
            </div>
        </footer>
    );
};

export default Footer;
