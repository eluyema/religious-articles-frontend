import styles from "./page.module.css";

export default function Home() {
  return (
      <div className={styles.page}>
        <main className={styles.main}>
          <h2>I Love Jesus</h2>
          <p>
            Welcome to <strong>Jesus Near</strong> — a place where you can explore the love and teachings of Jesus Christ.
            We believe that true peace and salvation are found in Him alone.
          </p>
          <p>
            Here you will find Christian articles, prayers, and spiritual reflections to help you grow in your faith, understand the Bible,
            and walk closer with the Lord every day.
          </p>
          <p>
            Jesus is near to all who call upon Him in truth (Psalm 145:18). Whether you&#39;re a believer or just searching for truth, we invite
            you to discover the good news of the Gospel and the hope we have in Jesus Christ.
          </p>
        </main>
      </div>
  );
}
