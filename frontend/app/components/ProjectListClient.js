"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ||
  process.env.API_INTERNAL_BASE ||
  "https://cececo-hub.onrender.com";

async function fetchJSON(url) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return res.json();
}

function Pill({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700">
      {children}
    </span>
  );
}

function Chip({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700">
      {children}
    </span>
  );
}

function SkeletonRow() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="h-3 w-1/2 rounded-full bg-slate-100" />
      <div className="mt-3 h-3 w-1/3 rounded-full bg-slate-100" />
      <div className="mt-3 h-3 w-4/5 rounded-full bg-slate-100" />
    </div>
  );
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
  const [matchById, setMatchById] = useState({});

  // keep local state in sync when user navigates via links
  useEffect(() => {
    setCountryId(urlCountryId);
    setQ(urlQ);
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
      return { ...prev, [projectId]: { ...cur, showAll: !cur.showAll } };
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
    setMatchById((prev) => {
      const cur = prev[projectId] || {
        open: true,
        loading: false,
        error: "",
        data: null,
        showAll: false,
        strictCountry: false,
      };
      return { ...prev, [projectId]: { ...cur, strictCountry: value } };
    });

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
    <div className="space-y-6">
      {/* Header + Filters */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>
          {subtitle ? (
            <p className="mt-2 max-w-3xl text-sm text-slate-600">{subtitle}</p>
          ) : null}
          <div className="mt-2 text-xs text-slate-500">
            API: <span className="font-mono">{API_BASE}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-800 shadow-sm outline-none hover:bg-slate-50 focus:border-slate-400"
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

          <div className="relative">
            <input
              className="h-10 w-64 rounded-xl border border-slate-200 bg-white pl-3 pr-9 text-sm text-slate-800 shadow-sm outline-none placeholder:text-slate-400 hover:bg-slate-50 focus:border-slate-400"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search title/summary…"
            />

            {q ? (
              <button
                type="button"
                onClick={() => setQ("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Clear search"
              >
                ✕
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* Error */}
      {err ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-5 text-rose-900">
          <div className="font-bold">Error</div>
          <div className="mt-1 text-sm text-rose-800">{err}</div>
          <div className="mt-4">
            <button
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              onClick={load}
            >
              Retry
            </button>
          </div>
        </div>
      ) : null}

      {/* Loading */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
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
              <div
                key={p.id}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold leading-snug">
                      {p.title}
                    </h3>
                    <div className="mt-1 text-xs text-slate-500">
                      ID: <span className="font-mono">{p.id}</span>
                    </div>
                  </div>

                  <Pill>{p.kind}</Pill>
                </div>

                <p className="mt-3 text-sm leading-6 text-slate-700">
                  {p.summary}
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {p.sector ? <Chip>Sector: {p.sector}</Chip> : null}
                  {p.stage ? <Chip>Stage: {p.stage}</Chip> : null}
                  {p.country_id ? (
                    <Chip>
                      Country:{" "}
                      {countryNameById.get(p.country_id) || `#${p.country_id}`}
                    </Chip>
                  ) : null}
                </div>

                {p.website ? (
                  <div className="mt-3 text-sm text-slate-700">
                    Website:{" "}
                    <a
                      className="font-semibold text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-500"
                      href={p.website}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {p.website}
                    </a>
                  </div>
                ) : null}

                {/* Match widget */}
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <button
                    className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
                    onClick={() => toggleMatches(p.id)}
                  >
                    {matchState.open ? "Hide investors" : "Match investors →"}
                  </button>

                  {matchState.open ? (
                    <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <input
                        type="checkbox"
                        checked={!!matchState.strictCountry}
                        onChange={(e) =>
                          setStrictCountry(p.id, e.target.checked)
                        }
                        className="h-4 w-4 accent-slate-900"
                      />
                      Same country only
                    </label>
                  ) : null}
                </div>

                {matchState.open ? (
                  <div className="mt-4 space-y-3 border-t border-slate-200 pt-4">
                    {matchState.loading ? (
                      <>
                        <SkeletonRow />
                        <SkeletonRow />
                      </>
                    ) : matchState.error ? (
                      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
                        {matchState.error}
                      </div>
                    ) : Array.isArray(matchState.data) ? (
                      <>
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-xs text-slate-500">
                            Showing{" "}
                            {matchState.showAll
                              ? allMatches.length
                              : Math.min(3, allMatches.length)}{" "}
                            of {allMatches.length}
                          </div>

                          {allMatches.length > 3 ? (
                            <button
                              className="text-sm font-semibold text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-500"
                              onClick={() => toggleShowAll(p.id)}
                            >
                              {matchState.showAll ? "Show top 3" : "See all"}
                            </button>
                          ) : null}
                        </div>

                        {shownMatches.length === 0 ? (
                          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                            No matches.
                          </div>
                        ) : (
                          shownMatches.map((m) => (
                            <div
                              key={m.investor.id}
                              className="rounded-2xl border border-slate-200 bg-white p-4"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="text-sm font-bold">
                                  {m.investor.name}
                                </div>
                                <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700">
                                  Match:{" "}
                                  {typeof m.score_100 === "number"
                                    ? m.score_100
                                    : 0}{" "}
                                  / 100
                                </span>
                              </div>

                              <div className="mt-1 text-xs text-slate-500">
                                Type:{" "}
                                {m.why ? (
                                  <div className="mt-2 text-sm text-slate-700">
                                    {m.why}
                                  </div>
                                ) : null}
                                <span className="font-mono">
                                  {m.investor.investor_type}
                                </span>
                              </div>

                              <div className="mt-2 flex flex-wrap gap-2">
                                {Array.isArray(m.reason_points) &&
                                m.reason_points.length
                                  ? m.reason_points.map((rp, i) => (
                                      <Chip key={i}>
                                        {rp.label}
                                        {typeof rp.points === "number"
                                          ? ` (+${rp.points})`
                                          : ""}
                                      </Chip>
                                    ))
                                  : (m.reasons || []).map((r, i) => (
                                      <Chip key={i}>{r}</Chip>
                                    ))}
                              </div>

                              {m.investor.website ? (
                                <div className="mt-2 text-sm">
                                  <a
                                    className="font-semibold text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-500"
                                    href={m.investor.website}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    {m.investor.website}
                                  </a>
                                </div>
                              ) : null}

                              <div className="mt-3 flex flex-wrap items-center gap-2">
                                <button
                                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-100"
                                  onClick={() =>
                                    router.push(
                                      `/investors?q=${encodeURIComponent(
                                        m.investor.name
                                      )}`
                                    )
                                  }
                                >
                                  Open investor →
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </>
                    ) : (
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                        No matches.
                      </div>
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
