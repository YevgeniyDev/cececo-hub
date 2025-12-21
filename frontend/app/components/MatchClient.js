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

export default function ProjectMatches({ projectId }) {
  const [open, setOpen] = useState(false);
  const [sameCountryOnly, setSameCountryOnly] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // Fetch many once (50), display 3 by default, expand to 10+
  const fetchLimit = 50;
  const visibleLimit = expanded ? 10 : 3;

  const url = useMemo(() => {
    if (!projectId) return "";
    const qs = new URLSearchParams();
    qs.set("strict_country", String(sameCountryOnly));
    qs.set("limit", String(fetchLimit));
    return `${API_BASE}/api/v1/projects/${projectId}/matches?${qs.toString()}`;
  }, [projectId, sameCountryOnly]);

  useEffect(() => {
    if (!open) return;

    let alive = true;

    async function run() {
      setLoading(true);
      setErr("");
      try {
        const data = await fetchJSON(url);
        if (!alive) return;
        setMatches(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!alive) return;
        setMatches([]);
        setErr(e?.message || "Failed to load matches");
      } finally {
        if (alive) setLoading(false);
      }
    }

    run();
    return () => {
      alive = false;
    };
  }, [open, url]);

  const visible = matches.slice(0, visibleLimit);

  return (
    <div style={{ marginTop: 10 }}>
      <button
        type="button"
        className={styles.buttonSecondary}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "Hide investors" : "Show investors"}
      </button>

      {open ? (
        <>
          <div style={{ marginTop: 10 }}>
            <label className={styles.meta} style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                type="checkbox"
                checked={sameCountryOnly}
                onChange={(e) => {
                  setSameCountryOnly(e.target.checked);
                  setExpanded(false);
                }}
              />
              Same country only
            </label>
          </div>

          {loading ? (
            <div className={styles.meta} style={{ marginTop: 10 }}>
              Loading…
            </div>
          ) : err ? (
            <div className={styles.meta} style={{ marginTop: 10 }}>
              {err}
            </div>
          ) : (
            <>
              <div className={styles.meta} style={{ marginTop: 10 }}>
                Showing {visible.length} of {matches.length}
              </div>

              <div style={{ display: "grid", gap: 10, marginTop: 10 }}>
                {visible.map((m, idx) => (
                  <div key={`${m.investor.id}-${idx}`} className={styles.cardSoft}>
                    <div className={styles.cardTop}>
                      <h3 className={styles.cardTitleSm}>{m.investor.name}</h3>
                      <span className={styles.badge}>Score: {m.score}</span>
                    </div>

                    <div className={styles.meta}>
                      Type: <span className={styles.mono}>{m.investor.investor_type}</span>
                    </div>

                    <div className={styles.chips}>
                      {m.reasons?.map((r, i) => (
                        <span key={i} className={styles.chip}>
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {matches.length > 3 ? (
                <div style={{ marginTop: 10 }}>
                  <button
                    type="button"
                    className={styles.buttonSecondary}
                    onClick={() => setExpanded((v) => !v)}
                  >
                    {expanded ? "Show less" : "Show more"}
                  </button>
                </div>
              ) : null}
            </>
          )}
        </>
      ) : null}
    </div>
  );
}
