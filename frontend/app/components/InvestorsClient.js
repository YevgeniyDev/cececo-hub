"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "../ui.module.css";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000";

async function fetchJSON(url) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return res.json();
}

export default function InvestorsClient({
  title = "Investors",
  subtitle = "",
}) {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [investorType, setInvestorType] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [countries, setCountries] = useState([]);
  const [countryId, setCountryId] = useState("");

  const params = useMemo(() => {
    const p = new URLSearchParams();
    if (q.trim()) p.set("q", q.trim());
    if (investorType) p.set("investor_type", investorType);
    if (countryId) p.set("country_id", countryId);
    return p.toString();
  }, [q, investorType, countryId]);

  async function load() {
    setLoading(true);
    setErr("");
    try {
      const [cList, data] = await Promise.all([
        fetchJSON(`${API_BASE}/api/v1/countries`),
        fetchJSON(`${API_BASE}/api/v1/investors?${params}`),
      ]);
      setCountries(cList);
      setItems(data);
    } catch (e) {
      setErr(e?.message || "Failed to load investors");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  return (
    <div className={styles.grid}>
      <div className={styles.rowBetween}>
        <div>
          <h1 className={styles.sectionTitle}>{title}</h1>
          {subtitle ? <p className={styles.sectionSub}>{subtitle}</p> : null}
          <div className={styles.smallMuted}>
            API: <span className={styles.mono}>{API_BASE}</span>
          </div>
        </div>

        <div className={styles.filtersRow}>
          <select
            className={styles.select}
            value={investorType}
            onChange={(e) => setInvestorType(e.target.value)}
          >
            <option value="">All types</option>
            <option value="fund">Fund</option>
            <option value="angel">Angel</option>
            <option value="corporate">Corporate</option>
            <option value="public">Public</option>
            <option value="ngo">NGO</option>
          </select>

          <select
            className={styles.select}
            value={countryId}
            onChange={(e) => setCountryId(e.target.value)}
          >
            <option value="">All countries</option>
            {countries.map((c) => (
              <option key={c.id} value={String(c.id)}>
                {c.name} ({c.iso2})
              </option>
            ))}
          </select>

          <input
            className={styles.input}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name / sectors / stages…"
          />
        </div>
      </div>

      {err ? (
        <div className={styles.card}>
          <div className={styles.tileTitle}>Error</div>
          <div className={styles.meta}>{err}</div>
          <div style={{ marginTop: 10 }}>
            <button className={styles.buttonSecondary} onClick={load}>
              Retry
            </button>
          </div>
        </div>
      ) : null}

      {loading ? (
        <div className={styles.card}>
          <div className={styles.meta}>Loading…</div>
        </div>
      ) : (
        <div className={styles.tilesGrid}>
          {items.map((inv) => (
            <div key={inv.id} className={styles.card}>
              <div className={styles.cardTop}>
                <h3 className={styles.cardTitleSm}>{inv.name}</h3>
                <span className={styles.badge}>{inv.investor_type}</span>
              </div>

              <div className={styles.chipsStack}>
                {/* Countries */}
                {inv.countries?.length ? (
                  <div className={styles.chipGroup}>
                    <div className={styles.chipGroupTitle}>Countries</div>
                    <div className={styles.chips}>
                      {inv.countries.map((c) => (
                        <span key={c.id} className={styles.chip}>
                          {c.name} ({c.iso2})
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                {/* Sectors */}
                {inv.focus_sectors ? (
                  <div className={styles.chipGroup}>
                    <div className={styles.chipGroupTitle}>Sectors</div>
                    <div className={styles.chips}>
                      {inv.focus_sectors
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean)
                        .map((s) => (
                          <span
                            key={`sector-${inv.id}-${s}`}
                            className={styles.chip}
                          >
                            {s}
                          </span>
                        ))}
                    </div>
                  </div>
                ) : null}

                {/* Stages */}
                {inv.stages ? (
                  <div className={styles.chipGroup}>
                    <div className={styles.chipGroupTitle}>Stages</div>
                    <div className={styles.chips}>
                      {inv.stages
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean)
                        .map((s) => (
                          <span
                            key={`stage-${inv.id}-${s}`}
                            className={styles.chip}
                          >
                            {s}
                          </span>
                        ))}
                    </div>
                  </div>
                ) : null}

                {/* Ticket */}
                {inv.ticket_min != null || inv.ticket_max != null ? (
                  <div className={styles.chipGroup}>
                    <div className={styles.chipGroupTitle}>Ticket</div>
                    <div className={styles.chips}>
                      <span className={styles.chip}>
                        {inv.ticket_min != null ? `$${inv.ticket_min}` : "—"} to{" "}
                        {inv.ticket_max != null ? `$${inv.ticket_max}` : "—"}
                      </span>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className={styles.kv}>
                <div>
                  ID: <span className={styles.mono}>{inv.id}</span>
                </div>
                {inv.website ? (
                  <div>
                    Website:{" "}
                    <a
                      className={styles.link}
                      href={inv.website}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {inv.website}
                    </a>
                  </div>
                ) : null}
                {inv.contact_email ? (
                  <div>
                    Email:{" "}
                    <span className={styles.mono}>{inv.contact_email}</span>
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
