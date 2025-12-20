import "./globals.css";
import styles from "./ui.module.css";
import Navbar from "./components/Navbar";

export const metadata = { title: "CECECO Hub MVP" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Inter, Arial, sans-serif",
          textRendering: "optimizeLegibility",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        }}
      >
        <header className={styles.header}>
          <div className={styles.headerInner}>
            <div className={styles.brand}>
              <span className={styles.brandName}>CECECO Hub</span>
              <span className={styles.brandTag}>MVP</span>
            </div>

            <Navbar />
          </div>
        </header>

        <main className={styles.page}>{children}</main>

        <footer className={styles.footer}>
          <div className={styles.footerInner}>
            <span>
              CECECO Hub MVP • Built for CECECO Clean Energy Hackathon
            </span>
            <a
              className={styles.footerLink}
              href="http://localhost:8000/docs"
              target="_blank"
            >
              API Docs
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
