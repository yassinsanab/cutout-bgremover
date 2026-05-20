import BgRemover from "@/components/BgRemover";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoText}>cutout</span>
        </div>
        <nav className={styles.nav}>
          <a href="#how">How it works</a>
          <a href="https://github.com" target="_blank" rel="noopener">GitHub</a>
        </nav>
      </header>

      <section className={styles.hero}>
        <div className={styles.badge}>100% Free · No signup · Runs in browser</div>
        <h1 className={styles.title}>
          Remove backgrounds<br />
          <em>in seconds.</em>
        </h1>
        <p className={styles.subtitle}>
          AI-powered background removal that runs entirely on your device.<br />
          Your images never leave your browser.
        </p>
      </section>

      <BgRemover />

      <section className={styles.features} id="how">
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🔒</div>
            <h3>100% Private</h3>
            <p>Everything runs in your browser. No uploads, no servers, no data collection.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>⚡</div>
            <h3>Instant Results</h3>
            <p>AI model loads once, then processes images at full speed locally on your device.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>∞</div>
            <h3>Unlimited Use</h3>
            <p>No credits, no limits, no subscription. Remove as many backgrounds as you want.</p>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>Built with <a href="https://img.ly/background-removal" target="_blank" rel="noopener">@imgly/background-removal</a> · Open source AI · No data collected</p>
      </footer>
    </main>
  );
}
