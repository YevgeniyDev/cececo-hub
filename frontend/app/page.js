import styles from "./ui.module.css";

export default function Home() {
  return (
    <div className={styles.grid}>
      <section className={styles.hero}>
        <div className={styles.badgesRow}>
          <span className={styles.badge}>Knowledge hub</span>
          <span className={styles.badge}>Policy-ready</span>
          <span className={styles.badge}>Startup ↔ Investor</span>
        </div>

        <h1 className={styles.h1}>CECECO Hub MVP</h1>

        <p className={styles.pLead}>
          A structured regional portal for clean-energy initiatives across
          CECECO member countries — combining a curated knowledge base
          (policies, roadmaps, datasets) with a searchable directory of
          projects, startups, investors, and partners.
        </p>

        <div className={styles.actions}>
          <a className={styles.buttonPrimary} href="/countries">
            Explore Countries →
          </a>
          <a
            className={styles.buttonSecondary}
            href="http://localhost:8000/docs"
            target="_blank"
          >
            Open API Docs
          </a>
        </div>
      </section>

      <section className={styles.cardsGrid}>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>What it solves</h3>
          <ul className={styles.list}>
            <li>
              Hard to find reliable, comparable clean energy info across
              countries
            </li>
            <li>Fragmented startup + investor landscape</li>
            <li>
              Lack of “single source of truth” for policy + implementation
            </li>
          </ul>
        </div>

        <div className={styles.card}>
          <h3 className={styles.cardTitle}>MVP modules</h3>
          <ul className={styles.list}>
            <li>Countries (done)</li>
            <li>Projects registry (next)</li>
            <li>Startups & investors directory (next)</li>
            <li>Knowledge library: policies, datasets, toolkits (next)</li>
          </ul>
        </div>

        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Why this is credible</h3>
          <ul className={styles.list}>
            <li>Structured data model (PostgreSQL + migrations)</li>
            <li>Transparent API (OpenAPI/Swagger)</li>
            <li>Deployment-ready (Docker Compose)</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
