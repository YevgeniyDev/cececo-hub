"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

export default function ProjectListClient({
  defaultKind = "project", // "project" | "startup"
  title = "Projects",
  subtitle = "",
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL -> state
  const urlCountryId = searchParams.get("country_id") || "";
  const urlQ = searchParams.get("q") || "";

  const [countries, setCountries] = useState([]);
  const [items, setItems] = useState([]);

  const [countryId, setCountryId] = useState(urlCountryId);
  const [q, setQ] = useState(urlQ);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // Match widget state (per project id)
  // { [id]: { open: bool, loading: bool, error: string, data: [], showAll: bool, strictCountry: bool } }
  const [matchById, setMatchById] = useState({});

  // keep local state in sync when user navigates via links
  useEffect(() => {
    setCountryId(urlCountryId);
    setQ(urlQ);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlCountryId, urlQ]);

  // State -> URL
  useEffect(() => {
    const sp = new URLSearchParams(searchParams.toString());

    if (countryId) sp.set("country_id", String(countryId));
    else sp.delete("country_id");

    if (q.trim()) sp.set("q", q.trim());
    else sp.delete("q");

    const next = sp.toString();
    const current = searchParams.toString();
    if (next !== current) router.replace(`?${next}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryId, q]);

  const apiQuery = useMemo(() => {
    const p = new URLSearchParams();
    p.set("kind", defaultKind);
    if (countryId) p.set("country_id", String(countryId));
    if (q.trim()) p.set("q", q.trim());
    return p.toString();
  }, [defaultKind, countryId, q]);

  async function load() {
    setLoading(true);
    setErr("");
    try {
      const [cList, pList] = await Promise.all([
        fetchJSON(`${API_BASE}/api/v1/countries`),
        fetchJSON(`${API_BASE}/api/v1/projects?${apiQuery}`),
      ]);
      setCountries(cList);
      setItems(pList);

      // collapse match widgets on new list load
      setMatchById({});
    } catch (e) {
      setErr(e?.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiQuery]);

  const countryNameById = useMemo(() => {
    const m = new Map();
    for (const c of countries) m.set(c.id, c.name);
    return m;
  }, [countries]);

  function toggleShowAll(projectId) {
    setMatchById((prev) => {
      const cur = prev[projectId];
      if (!cur) return prev;
      return {
        ...prev,
        [projectId]: { ...cur, showAll: !cur.showAll },
      };
    });
  }

  async function toggleMatches(projectId) {
    const current = matchById[projectId];
    const willOpen = !current?.open;
    const alreadyLoaded = Array.isArray(current?.data);

    // toggle open immediately
    setMatchById((prev) => {
      const cur = prev[projectId] || {
        open: false,
        loading: false,
        error: "",
        data: null,
        showAll: false,
        strictCountry: false,
      };
      return { ...prev, [projectId]: { ...cur, open: !cur.open } };
    });

    // If opening and not loaded yet -> fetch
    if (willOpen && !alreadyLoaded) {
      setMatchById((prev) => ({
        ...prev,
        [projectId]: {
          open: true,
          loading: true,
          error: "",
          data: null,
          showAll: prev[projectId]?.showAll ?? false,
          strictCountry: prev[projectId]?.strictCountry ?? false,
        },
      }));

      try {
        const strict = matchById[projectId]?.strictCountry ?? false;
        const data = await fetchJSON(
          `${API_BASE}/api/v1/projects/${projectId}/matches?strict_country=${
            strict ? "true" : "false"
          }`
        );
        setMatchById((prev) => ({
          ...prev,
          [projectId]: {
            open: true,
            loading: false,
            error: "",
            data,
            showAll: prev[projectId]?.showAll ?? false,
            strictCountry: prev[projectId]?.strictCountry ?? false,
          },
        }));
      } catch (e) {
        setMatchById((prev) => ({
          ...prev,
          [projectId]: {
            open: true,
            loading: false,
            error: e?.message || "Failed to load matches",
            data: null,
            showAll: prev[projectId]?.showAll ?? false,
            strictCountry: prev[projectId]?.strictCountry ?? false,
          },
        }));
      }
    }
  }

  async function setStrictCountry(projectId, value) {
    // update UI immediately
    setMatchById((prev) => {
      const cur = prev[projectId] || {
        open: true,
        loading: false,
        error: "",
        data: null,
        showAll: false,
        strictCountry: false,
      };
      return {
        ...prev,
        [projectId]: { ...cur, strictCountry: value },
      };
    });

    // If not open, don't fetch yet
    const isOpen = matchById[projectId]?.open;
    if (!isOpen) return;

    setMatchById((prev) => ({
      ...prev,
      [projectId]: {
        ...(prev[projectId] || {}),
        open: true,
        loading: true,
        error: "",
      },
    }));

    try {
      const data = await fetchJSON(
        `${API_BASE}/api/v1/projects/${projectId}/matches?strict_country=${
          value ? "true" : "false"
        }`
      );
      setMatchById((prev) => ({
        ...prev,
        [projectId]: {
          ...(prev[projectId] || {}),
          open: true,
          loading: false,
          error: "",
          data,
        },
      }));
    } catch (e) {
      setMatchById((prev) => ({
        ...prev,
        [projectId]: {
          ...(prev[projectId] || {}),
          open: true,
          loading: false,
          error: e?.message || "Failed to load matches",
          data: null,
        },
      }));
    }
  }

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
            placeholder="Search title/summary…"
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
          {items.map((p) => {
            const matchState = matchById[p.id] || {
              open: false,
              loading: false,
              error: "",
              data: null,
              showAll: false,
              strictCountry: false,
            };

            const allMatches = Array.isArray(matchState.data)
              ? matchState.data
              : [];
            const shownMatches = matchState.showAll
              ? allMatches
              : allMatches.slice(0, 3);

            return (
              <div key={p.id} className={styles.card}>
                <div className={styles.cardTop}>
                  <h3 className={styles.cardTitleSm}>{p.title}</h3>
                  <span className={styles.badge}>{p.kind}</span>
                </div>

                <p className={styles.cardSub}>{p.summary}</p>

                <div className={styles.chips}>
                  {p.sector ? (
                    <span className={styles.chip}>Sector: {p.sector}</span>
                  ) : null}
                  {p.stage ? (
                    <span className={styles.chip}>Stage: {p.stage}</span>
                  ) : null}
                  {p.country_id ? (
                    <span className={styles.chip}>
                      Country:{" "}
                      {countryNameById.get(p.country_id) || `#${p.country_id}`}
                    </span>
                  ) : null}
                </div>

                <div className={styles.kv}>
                  <div>
                    ID: <span className={styles.mono}>{p.id}</span>
                  </div>
                  {p.website ? (
                    <div>
                      Website:{" "}
                      <a
                        className={styles.link}
                        href={p.website}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {p.website}
                      </a>
                    </div>
                  ) : null}
                </div>

                {/* Inline Match Widget */}
                <div className={styles.cardActionsRow}>
                  <button
                    className={styles.buttonTiny}
                    onClick={() => toggleMatches(p.id)}
                  >
                    {matchState.open ? "Hide investors" : "Match investors →"}
                  </button>

                  {matchState.open ? (
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={!!matchState.strictCountry}
                        onChange={(e) =>
                          setStrictCountry(p.id, e.target.checked)
                        }
                        style={{ marginRight: 6 }}
                      />
                      Same country only
                    </label>
                  ) : null}
                </div>

                {matchState.open ? (
                  <div className={styles.matchBox}>
                    {matchState.loading ? (
                      <div className={styles.skeletonBlock}>
                        <div className={styles.matchRow}>
                          <div
                            className={styles.skeletonLine}
                            style={{ width: "55%" }}
                          />
                          <div
                            className={styles.skeletonLine}
                            style={{ width: "35%" }}
                          />
                          <div
                            className={styles.skeletonLine}
                            style={{ width: "80%" }}
                          />
                        </div>
                        <div className={styles.matchRow}>
                          <div
                            className={styles.skeletonLine}
                            style={{ width: "50%" }}
                          />
                          <div
                            className={styles.skeletonLine}
                            style={{ width: "40%" }}
                          />
                          <div
                            className={styles.skeletonLine}
                            style={{ width: "75%" }}
                          />
                        </div>
                        <div className={styles.matchRow}>
                          <div
                            className={styles.skeletonLine}
                            style={{ width: "45%" }}
                          />
                          <div
                            className={styles.skeletonLine}
                            style={{ width: "30%" }}
                          />
                          <div
                            className={styles.skeletonLine}
                            style={{ width: "85%" }}
                          />
                        </div>
                      </div>
                    ) : matchState.error ? (
                      <div className={styles.meta}>{matchState.error}</div>
                    ) : Array.isArray(matchState.data) ? (
                      <>
                        <div className={styles.miniRowBetween}>
                          <div className={styles.meta}>
                            Showing{" "}
                            {matchState.showAll
                              ? allMatches.length
                              : Math.min(3, allMatches.length)}{" "}
                            of {allMatches.length}
                          </div>

                          {allMatches.length > 3 ? (
                            <button
                              className={styles.buttonLink}
                              onClick={() => toggleShowAll(p.id)}
                            >
                              {matchState.showAll ? "Show top 3" : "See all"}
                            </button>
                          ) : null}
                        </div>

                        {shownMatches.map((m) => (
                          <div key={m.investor.id} className={styles.matchRow}>
                            <div className={styles.matchTop}>
                              <div className={styles.matchName}>
                                {m.investor.name}
                              </div>
                              <span className={styles.scoreBadge}>
                                Score: {m.score}
                              </span>
                            </div>

                            <div className={styles.meta}>
                              Type:{" "}
                              <span className={styles.mono}>
                                {m.investor.investor_type}
                              </span>
                            </div>

                            <div className={styles.chips}>
                              {(m.reasons || []).map((r, i) => (
                                <span key={i} className={styles.chip}>
                                  {r}
                                </span>
                              ))}
                            </div>

                            {m.investor.website ? (
                              <div className={styles.meta}>
                                <a
                                  className={styles.link}
                                  href={m.investor.website}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  {m.investor.website}
                                </a>
                              </div>
                            ) : null}
                          </div>
                        ))}
                      </>
                    ) : (
                      <div className={styles.meta}>No matches.</div>
                    )}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
