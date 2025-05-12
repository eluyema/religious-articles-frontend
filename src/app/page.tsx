import styles from "./page.module.scss";
import Image from "next/image";
import jesusIntro from '../assets/jesus-with-family.png';
import classNames from "classnames";

export default function Home() {
  return (
      <div className={styles.page}>
        <main className={styles.main}>
          <section className={styles.introSection}>
            <div className={styles.introSectionContent}>
              <h1 className={styles.introTitle}>
                Your <em>faithful companion</em> on the journey<br/> to knowing Christ
              </h1>

              <p className={styles.introText}>
                Discover insightful articles that deepen your understanding of Jesus and strengthen your spiritual walk.
                JesusNear.com is here to guide you closer to God.
              </p>
              <button className={styles.introButton}>
                Learn more
              </button>
              <Image src={jesusIntro} alt={"Jesus with your family"} className={classNames(styles.introImage, styles.desktop)} width={600} height={400}/>
              <Image src={jesusIntro} alt={"Jesus with your family"} className={classNames(styles.introImage, styles.mobile)} width={350} height={235}/>

            </div>
          </section>
          <section className={styles.missionSection}>
            <p className={styles.missionSectionCapture}>
              Our Mission
            </p>
            <h2 className={styles.missionSectionText}>
              We <em><span></span><span>support</span></em> your journey toward faith, peace, and purpose — by helping
              you connect with Jesus in your everyday life
            </h2>
          </section>
        </main>
      </div>
  );
}
