import styles from "../ui.module.css";
import Link from "next/link";

const API_BASE =
  process.env.API_INTERNAL_BASE ||
  process.env.NEXT_PUBLIC_API_BASE ||
  "http://localhost:8000";

async function getCountries() {
  const res = await fetch(`${API_BASE}/api/v1/countries`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch countries");
  return res.json();
}

export default async function CountriesPage() {
  const countries = await getCountries();

  return (
    <div className={styles.grid}>
      <div>
        <h1 className={styles.sectionTitle}>Countries</h1>
        <p className={styles.sectionSub}>
          CECECO member countries currently supported in the MVP.
        </p>
      </div>

      <div className={styles.tilesGrid}>
        {countries.map((c) => (
          <div key={c.id} className={styles.card}>
            <div className={styles.tileTitle}>{c.name}</div>

            <div className={styles.meta}>
              ISO2: <span className={styles.mono}>{c.iso2}</span>
            </div>

            {c.region ? (
              <div className={styles.meta}>Region: {c.region}</div>
            ) : null}

            {/* Actions */}
            <div className={styles.actions}>
              <Link
                className={styles.buttonSecondary}
                href={`/projects?country_id=${c.id}`}
              >
                Projects →
              </Link>

              <Link
                className={styles.buttonSecondary}
                href={`/startups?country_id=${c.id}`}
              >
                Startups →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
