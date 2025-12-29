import Link from "next/link";

const API_BASE =
  process.env.API_INTERNAL_BASE ||
  process.env.NEXT_PUBLIC_API_BASE ||
  "http://localhost:8000";

/* ----------------------------- helpers ----------------------------- */
function clamp01(v) {
  const n = Number(v);
  if (Number.isNaN(n)) return null;
  return Math.max(0, Math.min(1, n));
}

function scoreLabel(v) {
  const vv = clamp01(v);
  if (vv === null) return null;
  const n = Math.round(vv * 100);
  if (n >= 75) return { text: `${n}`, tone: "high", label: "Strong" };
  if (n >= 55) return { text: `${n}`, tone: "med", label: "Moderate" };
  return { text: `${n}`, tone: "low", label: "Early" };
}

function tonePill(tone) {
  if (tone === "high")
    return "border-emerald-200 bg-emerald-50 text-emerald-800";
  if (tone === "med") return "border-amber-200 bg-amber-50 text-amber-800";
  return "border-rose-200 bg-rose-50 text-rose-800";
}

function formatDate(iso) {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "—";
    return new Intl.DateTimeFormat("en", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }).format(d);
  } catch {
    return "—";
  }
}

function safeText(v, fallback = "—") {
  const s = typeof v === "string" ? v.trim() : "";
  return s.length ? s : fallback;
}

function uniq(arr) {
  return Array.from(new Set(arr));
}

function normalizeToken(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function parseCSVishList(s) {
  if (!s) return [];
  return String(s)
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

function topNFromCounts(counts, n = 5) {
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([k, v]) => ({ key: k, count: v }));
}

function buildCounts(items, getter) {
  const counts = {};
  for (const it of items || []) {
    const v = getter(it);
    if (!v) continue;
    counts[v] = (counts[v] || 0) + 1;
  }
  return counts;
}

/* ----------------------------- data fetch ----------------------------- */
async function getCountry(id) {
  const res = await fetch(`${API_BASE}/api/v1/countries/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch country briefing");
  return res.json();
}

async function getCountries() {
  const res = await fetch(`${API_BASE}/api/v1/countries`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch countries");
  return res.json();
}

async function getNews(countryId) {
  const params = new URLSearchParams();
  params.set("country_id", String(countryId));
  params.set("limit", "40");
  params.set("offset", "0");
  const res = await fetch(`${API_BASE}/api/v1/news?${params.toString()}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch country news");
  return res.json();
}

async function getProjects(countryId, kind) {
  const params = new URLSearchParams();
  params.set("country_id", String(countryId));
  params.set("kind", String(kind));
  const res = await fetch(`${API_BASE}/api/v1/projects?${params.toString()}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch projects");
  return res.json();
}

/* ----------------------------- mechanics mapping ----------------------------- */
/**
 * Turn frameworks + policies into actionable “market mechanics” buckets.
 * This is what makes the page feel valuable (not just “lists”).
 */
function bucketMechanics(country) {
  const frameworks = country.frameworks || [];
  const policies = country.policies || [];

  const buckets = [
    {
      key: "procurement",
      title: "Procurement & auctions",
      subtitle: "How utility-scale projects get contracted",
      match: (x) =>
        /auction|tender|procurement|competitive/.test(normalizeToken(x)),
    },
    {
      key: "revenue",
      title: "Revenue contracts (PPAs)",
      subtitle: "What reduces revenue risk for developers",
      match: (x) => /ppa|power purchase|contract/.test(normalizeToken(x)),
    },
    {
      key: "distributed",
      title: "Distributed energy rules",
      subtitle: "Net metering, rooftop solar, small generation",
      match: (x) =>
        /net metering|distributed|rooftop|small scale/.test(normalizeToken(x)),
    },
    {
      key: "grid",
      title: "Grid access & integration",
      subtitle: "Interconnection, grid codes, flexibility",
      match: (x) =>
        /grid|interconnection|connection|code|flexibility|demand response|ancillary|storage/.test(
          normalizeToken(x)
        ),
    },
    {
      key: "efficiency",
      title: "Efficiency & standards",
      subtitle: "Buildings, industry, and demand-side measures",
      match: (x) =>
        /efficiency|standard|retrofit|building|appliance/.test(
          normalizeToken(x)
        ),
    },
    {
      key: "finance",
      title: "Incentives & enabling programs",
      subtitle: "What improves economics and delivery",
      match: (x) =>
        /incentive|support|subsidy|tax|grant|program|roadmap|strategy|target/.test(
          normalizeToken(x)
        ),
    },
  ];

  const addItem = (bucketKey, item, type) => {
    const title = type === "framework" ? item.name : item.title;
    const desc = type === "framework" ? item.description : item.summary;
    const status = item.status || "—";
    const why = item.why_it_matters || null;
    const source = item.source_url || null;
    return {
      type,
      id: item.id,
      title,
      desc,
      status,
      why,
      source,
      meta:
        type === "framework"
          ? item.framework_type
          : item.policy_type || "policy",
      bucket: bucketKey,
    };
  };

  const results = {};
  for (const b of buckets) results[b.key] = { ...b, items: [] };

  // frameworks into buckets
  for (const f of frameworks) {
    const hay = `${f.framework_type || ""} ${f.name || ""} ${
      f.description || ""
    }`;
    const key =
      buckets.find((b) => b.match(hay))?.key ||
      (f.framework_type ? "grid" : "finance");
    results[key].items.push(addItem(key, f, "framework"));
  }

  // policies into buckets
  for (const p of policies) {
    const hay = `${p.policy_type || ""} ${p.title || ""} ${p.summary || ""}`;
    const key =
      buckets.find((b) => b.match(hay))?.key ||
      (p.policy_type ? "finance" : "finance");
    results[key].items.push(addItem(key, p, "policy"));
  }

  // Provide “what this unlocks” hints based on present mechanics
  const present = Object.values(results).filter((b) => b.items.length > 0);
  const missing = Object.values(results).filter((b) => b.items.length === 0);

  const insights = {
    presentCount: present.length,
    missingCount: missing.length,
    missingTop: missing.slice(0, 2).map((b) => b.title),
  };

  return { buckets: Object.values(results), insights };
}

function computeFocusAreas({ projects, startups, newsItems }) {
  const sectorCounts = buildCounts(
    [...(projects || []), ...(startups || [])],
    (x) => (x.sector ? String(x.sector).trim() : "")
  );
  const stageCounts = buildCounts(
    [...(projects || []), ...(startups || [])],
    (x) => (x.stage ? String(x.stage).trim() : "")
  );

  // extra “signal topics” from news impact_type
  const topicCounts = buildCounts(newsItems || [], (x) =>
    x.impact_type ? String(x.impact_type).trim() : ""
  );

  const topSectors = topNFromCounts(sectorCounts, 5);
  const topStages = topNFromCounts(stageCounts, 5);
  const topTopics = topNFromCounts(topicCounts, 5);

  // build a readable “focus” array prioritizing sectors
  const focus = topSectors.map((x) => x.key).filter(Boolean);

  return {
    topSectors,
    topStages,
    topTopics,
    focusAreas: focus.length ? focus : ["Solar", "Wind", "Grid", "Efficiency"],
  };
}

function scoreCardsFromIndicators(ind) {
  const base = [
    {
      label: "Policy readiness",
      key: "policy_readiness",
      hint: "Clarity of direction and implementation signals.",
    },
    {
      label: "Investment attractiveness",
      key: "investment_attractiveness",
      hint: "Signals relevant to capital deployment.",
    },
    {
      label: "Renewable potential",
      key: "renewable_proxy",
      hint: "Proxy view of resource and scale.",
    },
    {
      label: "Efficiency opportunity",
      key: "efficiency_need",
      hint: "Where demand-side gains are likely.",
    },
    {
      label: "Grid readiness",
      key: "grid_proxy",
      hint: "Enablers for integration and growth.",
    },
  ];

  const scored = base
    .map((c) => {
      const it = ind[c.key];
      const s = it ? scoreLabel(it.value) : null;
      return {
        ...c,
        score: s,
        details: it?.details || c.hint,
        method: it?.method || null,
      };
    })
    .sort((a, b) => (b.score?.text || 0) - (a.score?.text || 0));

  return scored;
}

/* ----------------------------- page ----------------------------- */
export default async function CountryBriefingPage({ params }) {
  const [country, countries, newsRaw, projects, startups] = await Promise.all([
    getCountry(params.id),
    getCountries(),
    getNews(params.id),
    getProjects(params.id, "project"),
    getProjects(params.id, "startup"),
  ]);

  const newsItems = newsRaw?.items || newsRaw || [];
  const topNews = newsItems.slice(0, 8);

  // indicators map
  const ind = {};
  for (const x of country.indicators || []) ind[x.key] = x;

  // prev/next (by id order from API)
  const ids = (countries || []).map((c) => c.id);
  const idx = ids.indexOf(country.id);
  const prevId = idx > 0 ? ids[idx - 1] : null;
  const nextId = idx >= 0 && idx < ids.length - 1 ? ids[idx + 1] : null;

  const prevName =
    prevId != null
      ? countries.find((c) => c.id === prevId)?.name ?? "Previous"
      : null;
  const nextName =
    nextId != null
      ? countries.find((c) => c.id === nextId)?.name ?? "Next"
      : null;

  const focus = computeFocusAreas({ projects, startups, newsItems });
  const scoredSignals = scoreCardsFromIndicators(ind);

  const mechanics = bucketMechanics(country);
  const frameworksCount = (country.frameworks || []).length;
  const policiesCount = (country.policies || []).length;

  const projectsCount = (projects || []).length;
  const startupsCount = (startups || []).length;

  const latestUpdateDate = topNews[0]?.published_at
    ? formatDate(topNews[0].published_at)
    : "—";

  const quickBadges = uniq([
    ...focus.focusAreas.slice(0, 3),
    country.region ? country.region : "",
  ]).filter(Boolean);

  // “ecosystem highlight” cards derived from data (unique per country)
  const topSector = focus.topSectors?.[0]?.key || null;
  const topStage = focus.topStages?.[0]?.key || null;

  const ecosystemHighlights = [
    {
      label: "Primary focus",
      value: topSector ? topSector : "—",
      sub: topSector ? `Most common sector in listings` : "Add sector data",
    },
    {
      label: "Stage momentum",
      value: topStage ? topStage : "—",
      sub: topStage
        ? `Most common stage across projects/startups`
        : "Add stage data",
    },
    {
      label: "Listings",
      value: `${projectsCount + startupsCount}`,
      sub: `${projectsCount} projects • ${startupsCount} startups`,
    },
    {
      label: "Signals",
      value: `${newsItems.length}`,
      sub: `Recent public updates`,
    },
  ];

  // Institutions / targets (optional; will render if you add them)
  const institutions = country.institutions || [];
  const targets = country.targets || [];

  return (
    <div className="space-y-8">
      {/* Top navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Link
            href="/countries"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
          >
            ← Countries
          </Link>

          <span className="hidden sm:inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
            Briefing
          </span>
        </div>

        <div className="flex items-center gap-2">
          {prevId ? (
            <Link
              href={`/countries/${prevId}`}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
              title={`Previous: ${prevName}`}
            >
              <span className="hidden sm:inline">← {prevName}</span>
              <span className="sm:hidden">← Prev</span>
            </Link>
          ) : (
            <span className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-400">
              <span className="hidden sm:inline">← Start</span>
              <span className="sm:hidden">←</span>
            </span>
          )}

          {nextId ? (
            <Link
              href={`/countries/${nextId}`}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
              title={`Next: ${nextName}`}
            >
              <span className="hidden sm:inline">{nextName} →</span>
              <span className="sm:hidden">Next →</span>
            </Link>
          ) : (
            <span className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-400">
              <span className="hidden sm:inline">End →</span>
              <span className="sm:hidden">→</span>
            </span>
          )}
        </div>
      </div>

      {/* Header (NOT like main page) */}
      <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="p-6 md:p-8">
          {/* Top row: title + meta */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                  ISO: {country.iso2}
                </span>
                {quickBadges.slice(0, 3).map((b) => (
                  <span
                    key={b}
                    className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700"
                  >
                    {b}
                  </span>
                ))}
              </div>

              <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-950 md:text-5xl">
                {country.name}
              </h1>

              <p className="mt-3 max-w-3xl text-base leading-7 text-slate-700">
                {safeText(
                  country.briefing,
                  "A structured briefing that combines readiness signals, market mechanics, and ecosystem navigation in one place."
                )}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <Link
                  href={`/news?country_id=${country.id}`}
                  className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
                >
                  View updates →
                </Link>
                <Link
                  href={`/projects?country_id=${country.id}`}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
                >
                  Projects
                </Link>
                <Link
                  href={`/startups?country_id=${country.id}`}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
                >
                  Startups
                </Link>
                <Link
                  href={`/investors?country_id=${country.id}`}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
                >
                  Investors
                </Link>
              </div>
            </div>

            {/* Right meta card */}
            <div className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-5 md:w-[340px]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                    Coverage
                  </div>
                  <div className="mt-1 text-sm font-semibold text-slate-900">
                    Listings, mechanisms, signals
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700">
                  Updated: {latestUpdateDate}
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {ecosystemHighlights.map((k) => (
                  <div
                    key={k.label}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <div className="text-[11px] font-extrabold uppercase tracking-wide text-slate-500">
                      {k.label}
                    </div>
                    <div className="mt-2 text-xl font-extrabold tracking-tight text-slate-900">
                      {k.value}
                    </div>
                    <div className="mt-1 text-sm text-slate-600">{k.sub}</div>
                  </div>
                ))}
              </div>

              <div className="mt-4 text-xs text-slate-500">
                Indicators are normalized signals (0–100 display). Updates are
                from public sources.
              </div>
            </div>
          </div>

          {/* Focus areas strip (data-derived, unique per country) */}
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
              Focus areas:
            </span>
            {focus.focusAreas.slice(0, 6).map((x) => (
              <span
                key={x}
                className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-800"
              >
                {x}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 2-column body: Signals + Sidebar */}
      <section className="grid gap-4 lg:grid-cols-3">
        {/* Left (main) */}
        <div className="space-y-4 lg:col-span-2">
          {/* Signals */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">
                  Readiness signals
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  A consistent set of signals to compare opportunity and
                  enabling conditions.
                </p>
              </div>

              <Link
                href="/countries"
                className="text-sm font-semibold text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-500"
              >
                Compare →
              </Link>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {scoredSignals.map((c) => (
                <div
                  key={c.key}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-sm font-extrabold text-slate-900">
                      {c.label}
                    </div>
                    {c.score ? (
                      <span
                        className={[
                          "rounded-full border px-2 py-1 text-[11px] font-extrabold",
                          tonePill(c.score.tone),
                        ].join(" ")}
                        title={c.score.label}
                      >
                        {c.score.label}
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-2 flex items-baseline gap-2">
                    <div className="text-3xl font-extrabold tracking-tight text-slate-950">
                      {c.score ? c.score.text : "—"}
                    </div>
                    <div className="text-sm font-semibold text-slate-500">
                      / 100
                    </div>
                  </div>

                  <div className="mt-2 text-sm text-slate-600">
                    {safeText(c.details, c.hint)}
                  </div>

                  {c.method ? (
                    <div className="mt-3 text-xs text-slate-500">
                      Method: {c.method}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          {/* Market mechanics (THIS is what makes policies/frameworks valuable) */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">
                  Market mechanics
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  The practical rules that determine how projects get built,
                  contracted, connected, and financed.
                </p>
              </div>

              <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                {frameworksCount} frameworks • {policiesCount} policies
              </div>
            </div>

            {/* “coverage insight” */}
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <span className="font-bold text-slate-900">Quick read: </span>
              {mechanics.insights.presentCount >= 4 ? (
                <>Strong coverage across multiple market mechanics.</>
              ) : mechanics.insights.presentCount >= 2 ? (
                <>Some key mechanics are defined; a few are still emerging.</>
              ) : (
                <>
                  Mechanics coverage is limited — add more frameworks/policies
                  for a clearer pathway.
                </>
              )}
              {mechanics.insights.missingCount > 0 ? (
                <span className="text-slate-600">
                  {" "}
                  Common missing areas:{" "}
                  <span className="font-semibold text-slate-900">
                    {mechanics.insights.missingTop.join(", ")}
                  </span>
                  .
                </span>
              ) : null}
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {mechanics.buckets.map((b) => (
                <div
                  key={b.key}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-base font-extrabold text-slate-900">
                        {b.title}
                      </div>
                      <div className="mt-1 text-sm text-slate-600">
                        {b.subtitle}
                      </div>
                    </div>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-extrabold text-slate-700">
                      {b.items.length}
                    </span>
                  </div>

                  <div className="mt-4 space-y-3">
                    {b.items.length === 0 ? (
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                        No items recorded yet.
                        <div className="mt-1 text-xs text-slate-500">
                          Add a framework/policy here to clarify execution
                          pathways.
                        </div>
                      </div>
                    ) : (
                      b.items.slice(0, 3).map((it) => (
                        <div
                          key={`${it.type}-${it.id}`}
                          className="rounded-xl border border-slate-200 bg-white p-4"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="text-sm font-extrabold text-slate-900">
                              {it.title}
                            </div>
                            <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-extrabold text-slate-700">
                              {safeText(it.status, "—")}
                            </span>
                          </div>

                          <div className="mt-2 text-xs text-slate-500">
                            <span className="font-semibold text-slate-700">
                              {it.type === "framework" ? "Framework" : "Policy"}
                            </span>{" "}
                            <span className="text-slate-300">•</span>{" "}
                            <span className="font-mono">
                              {safeText(it.meta)}
                            </span>
                          </div>

                          <p className="mt-2 text-sm text-slate-600">
                            {safeText(it.desc, "No description provided.")}
                          </p>

                          {it.why ? (
                            <p className="mt-3 text-sm text-slate-900">
                              <span className="font-extrabold">Benefit:</span>{" "}
                              {it.why}
                            </p>
                          ) : null}

                          {it.source ? (
                            <div className="mt-2">
                              <a
                                className="text-sm font-semibold text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-500"
                                href={it.source}
                                target="_blank"
                                rel="noreferrer"
                              >
                                Source →
                              </a>
                            </div>
                          ) : null}
                        </div>
                      ))
                    )}
                  </div>

                  {b.items.length > 3 ? (
                    <div className="mt-3 text-xs text-slate-500">
                      Showing 3 of {b.items.length}.
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          {/* Latest updates */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-extrabold text-slate-900">
                Recent signals
              </h2>
              <Link
                href={`/news?country_id=${country.id}`}
                className="text-sm font-semibold text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-500"
              >
                View all →
              </Link>
            </div>

            <p className="mt-2 text-sm text-slate-600">
              Public updates related to regulation, projects, financing, and
              market movement.
            </p>

            <div className="mt-4 space-y-3">
              {topNews.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                  No updates found yet for this country.
                </div>
              ) : (
                topNews.map((n) => (
                  <article
                    key={n.id}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="text-sm font-extrabold leading-snug text-slate-900 line-clamp-2">
                        {n.title}
                      </div>
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-extrabold text-slate-700">
                        {n.impact_score}
                      </span>
                    </div>

                    <div className="mt-2 text-xs text-slate-600">
                      <span className="font-semibold text-slate-800">
                        Type:
                      </span>{" "}
                      <span className="font-mono">
                        {safeText(n.impact_type)}
                      </span>{" "}
                      <span className="text-slate-300">•</span>{" "}
                      {formatDate(n.published_at)}
                    </div>

                    <p className="mt-2 text-sm text-slate-600 line-clamp-3">
                      {safeText(n.summary, "No summary available.")}
                    </p>

                    {n.source_url ? (
                      <div className="mt-2">
                        <a
                          className="text-sm font-semibold text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-500"
                          href={n.source_url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Open source →
                        </a>
                      </div>
                    ) : null}
                  </article>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <aside className="space-y-4 lg:col-span-1">
          {/* Ecosystem quick navigation */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
              Ecosystem
            </div>
            <div className="mt-2 text-base font-extrabold text-slate-900">
              Explore listings
            </div>
            <p className="mt-2 text-sm text-slate-600">
              Navigate the active pipeline in {country.name}.
            </p>

            <div className="mt-4 grid gap-2">
              <Link
                href={`/projects?country_id=${country.id}`}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
              >
                Projects ({projectsCount}) →
              </Link>
              <Link
                href={`/startups?country_id=${country.id}`}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
              >
                Startups ({startupsCount}) →
              </Link>
              <Link
                href={`/investors?country_id=${country.id}`}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
              >
                Investors →
              </Link>
            </div>

            {/* Derived “top sectors” */}
            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                Top sectors
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {focus.topSectors.length ? (
                  focus.topSectors.slice(0, 4).map((x) => (
                    <span
                      key={x.key}
                      className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-800"
                      title={`${x.count} listings`}
                    >
                      {x.key}
                    </span>
                  ))
                ) : (
                  <div className="text-sm text-slate-600">
                    Add sector tags to listings to see focus areas here.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Institutions (optional; renders if present) */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
              Key institutions
            </div>
            <div className="mt-2 text-base font-extrabold text-slate-900">
              Who shapes the market
            </div>
            <p className="mt-2 text-sm text-slate-600">
              Reference points for regulation, planning, and grid access.
            </p>

            <div className="mt-4 space-y-3">
              {institutions.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                  Add institutions (ministry, regulator, TSO) to make briefings
                  more actionable.
                </div>
              ) : (
                institutions.slice(0, 6).map((i) => (
                  <div
                    key={i.id}
                    className="rounded-2xl border border-slate-200 bg-white p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="text-sm font-extrabold text-slate-900">
                        {i.name}
                      </div>
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-extrabold text-slate-700">
                        {safeText(i.institution_type, "institution")}
                      </span>
                    </div>
                    {i.description ? (
                      <p className="mt-2 text-sm text-slate-600">
                        {i.description}
                      </p>
                    ) : null}
                    <div className="mt-2 flex flex-wrap gap-3 text-sm">
                      {i.website ? (
                        <a
                          className="font-semibold text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-500"
                          href={i.website}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Website →
                        </a>
                      ) : null}
                      {i.contact_email ? (
                        <a
                          className="font-semibold text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-500"
                          href={`mailto:${i.contact_email}`}
                        >
                          Email →
                        </a>
                      ) : null}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Targets (optional; renders if present) */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
              Targets & milestones
            </div>
            <div className="mt-2 text-base font-extrabold text-slate-900">
              What the country is aiming for
            </div>
            <p className="mt-2 text-sm text-slate-600">
              Useful for prioritization and alignment across projects and
              capital.
            </p>

            <div className="mt-4 space-y-3">
              {targets.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                  Add 2–5 official targets with sources for a
                  “publication-ready” briefing.
                </div>
              ) : (
                targets
                  .slice()
                  .sort((a, b) => (a.year || 0) - (b.year || 0))
                  .slice(0, 6)
                  .map((t) => (
                    <div
                      key={t.id}
                      className="rounded-2xl border border-slate-200 bg-white p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="text-sm font-extrabold text-slate-900">
                          {t.title}
                        </div>
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-extrabold text-slate-700">
                          {t.year || "—"}
                        </span>
                      </div>

                      <div className="mt-2 text-sm text-slate-700">
                        <span className="font-extrabold text-slate-900">
                          {safeText(t.value, "—")}
                        </span>{" "}
                        <span className="text-slate-500">{t.unit || ""}</span>
                      </div>

                      {t.notes ? (
                        <p className="mt-2 text-sm text-slate-600">{t.notes}</p>
                      ) : null}

                      {t.source_url ? (
                        <div className="mt-2">
                          <a
                            className="text-sm font-semibold text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-500"
                            href={t.source_url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Source →
                          </a>
                        </div>
                      ) : null}
                    </div>
                  ))
              )}
            </div>
          </div>

          {/* Practical guidance (unique content already seeded) */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
              Implementation guidance
            </div>
            <div className="mt-2 text-base font-extrabold text-slate-900">
              What to focus on next
            </div>

            <div className="mt-4 space-y-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                  Priority opportunities
                </div>
                <p className="mt-2 text-sm text-slate-700">
                  {safeText(
                    country.potential_notes,
                    "Add a short paragraph describing the most promising clean-energy opportunities and priority sectors."
                  )}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                  Practical next steps
                </div>
                <p className="mt-2 text-sm text-slate-700">
                  {safeText(
                    country.action_plan_notes,
                    "Add actionable guidance: near-term steps, enabling reforms, and implementation considerations."
                  )}
                </p>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
