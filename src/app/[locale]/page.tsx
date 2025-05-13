import styles from "./page.module.scss";
import Image from "next/image";
import jesusIntro from '../../assets/jesus-with-family.png';
import classNames from "classnames";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations('homepage');

  return (
      <div className={styles.page}>
        <main className={styles.main}>
          <section className={styles.introSection}>
            <div className={styles.introSectionContent}>
              <h1
                  className={styles.introTitle}
                  dangerouslySetInnerHTML={{ __html: t.raw('introTitle') }}
              />
              <p className={styles.introText}>{t('introText')}</p>
              <button className={styles.introButton}>{t('introButton')}</button>

              <Image
                  src={jesusIntro}
                  alt={t('introImageAlt')}
                  className={classNames(styles.introImage, styles.desktop)}
                  width={600}
                  height={400}
              />
              <Image
                  src={jesusIntro}
                  alt={t('introImageAlt')}
                  className={classNames(styles.introImage, styles.mobile)}
                  width={350}
                  height={235}
              />
            </div>
          </section>

          <section className={styles.missionSection}>
            <p className={styles.missionSectionCapture}>{t('missionCaption')}</p>
            <h2
                className={styles.missionSectionText}
                dangerouslySetInnerHTML={{ __html: t.raw('missionText') }}
            />
          </section>
        </main>
      </div>
  );
}
