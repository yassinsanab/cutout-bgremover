import dynamic from 'next/dynamic';
import styles from './page.module.css';

const BgRemover = dynamic(() => import('@/components/BgRemover'), {
  ssr: false,
  loading: () => (
    <div className={styles.loadingCard}>
      <div className={styles.loadingSpinner} />
    </div>
  ),
});

export default function Home() {
  return (
    <div className={styles.wrapper}>
      <header className={styles.navbar}>
        <span className={styles.logo}>cutout</span>
        <nav className={styles.nav}>
          <a href="#how-it-works">How it works</a>
          <a
            href="https://github.com/yassinsanab/cutout-bgremover"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </nav>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>
            Remove backgrounds
            <br />
            <em className={styles.heroAccent}>in seconds.</em>
          </h1>
          <p className={styles.heroSub}>
            AI-powered background removal that runs entirely on your device.
            Your images never leave your browser.
          </p>
        </section>

        <section className={styles.uploadSection}>
          <BgRemover />
        </section>

        <section id="how-it-works" className={styles.howSection}>
          <h2 className={styles.sectionTitle}>How it works</h2>
          <div className={styles.steps}>
            <div className={styles.step}>
              <div className={styles.stepIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 15V4M12 4L8 8M12 4L16 8"
                    stroke="#0071e3"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path d="M4 19h16" stroke="#0071e3" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <h3>Upload</h3>
              <p>Drop any JPG, PNG or WEBP image</p>
            </div>

            <div className={styles.step}>
              <div className={styles.stepIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="4" stroke="#0071e3" strokeWidth="1.5" />
                  <path
                    d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
                    stroke="#0071e3"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h3>Process</h3>
              <p>AI removes the background in seconds</p>
            </div>

            <div className={styles.step}>
              <div className={styles.stepIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 4v12M12 16L8 12M12 16L16 12"
                    stroke="#0071e3"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path d="M4 19h16" stroke="#0071e3" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <h3>Download</h3>
              <p>Save as transparent PNG, free forever</p>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>cutout — Free background removal. No signup. No limits.</p>
      </footer>
    </div>
  );
}
