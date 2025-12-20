"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
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

export default function MatchClient() {
  const sp = useSearchParams();
  const projectId = sp.get("project_id") || "";

  const [projects, setProjects] = useState([]);
  const [selected, setSelected] = useState(projectId);
  const [matches, setMatches] = useState([]);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    setSelected(projectId);
  }, [projectId]);

  const matchesUrl = useMemo(() => {
    if (!selected) return "";
    return `${API_BASE}/api/v1/projects/${selected}/matches`;
  }, [selected]);

  async function load() {
    setLoading(true);
    setErr("");
    try {
      const p = await fetchJSON(`${API_BASE}/api/v1/projects`);
      setProjects(p);

      if (selected) {
        const m = await fetchJSON(matchesUrl);
        setMatches(m);
      } else {
        setMatches([]);
      }
    } catch (e) {
      setErr(e?.message || "Failed to load match data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchesUrl]);

  return (
    <div className={styles.grid}>
      <div className={styles.rowBetween}>
        <div>
          <h1 className={styles.sectionTitle}>Match</h1>
          <p className={styles.sectionSub}>
            Pick a project/startup → get ranked investors (MVP scoring).
          </p>
        </div>

        <div className={styles.filtersRow}>
          <select
            className={styles.select}
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
          >
            <option value="">Select a project…</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                [{p.kind}] {p.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {err ? (
        <div className={styles.card}>
          <div className={styles.tileTitle}>Error</div>
          <div className={styles.meta}>{err}</div>
        </div>
      ) : null}

      {loading ? (
        <div className={styles.card}>
          <div className={styles.meta}>Loading…</div>
        </div>
      ) : selected ? (
        <div className={styles.tilesGrid}>
          {matches.map((m, idx) => (
            <div key={`${m.investor.id}-${idx}`} className={styles.card}>
              <div className={styles.cardTop}>
                <h3 className={styles.cardTitleSm}>{m.investor.name}</h3>
                <span className={styles.badge}>Score: {m.score}</span>
              </div>

              <div className={styles.meta}>
                Type:{" "}
                <span className={styles.mono}>{m.investor.investor_type}</span>
              </div>

              <div className={styles.chips}>
                {m.reasons?.map((r, i) => (
                  <span key={i} className={styles.chip}>
                    {r}
                  </span>
                ))}
              </div>

              <div className={styles.kv}>
                {m.investor.focus_sectors ? (
                  <div>Sectors: {m.investor.focus_sectors}</div>
                ) : null}
                {m.investor.stages ? (
                  <div>Stages: {m.investor.stages}</div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.card}>
          <div className={styles.meta}>Select a project to see matches.</div>
        </div>
      )}
    </div>
  );
}
