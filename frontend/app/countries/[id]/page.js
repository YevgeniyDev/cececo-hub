import Link from "next/link";

const API_BASE =
  process.env.API_INTERNAL_BASE ||
  process.env.NEXT_PUBLIC_API_BASE ||
  "http://localhost:8000" ||
  "https://cececo-hub.onrender.com" ||
  "https://cececo-hub.vercel.app";

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
  if (n >= 75) return { n, tone: "high", label: "Strong" };
  if (n >= 55) return { n, tone: "med", label: "Moderate" };
  return { n, tone: "low", label: "Early" };
}

function tonePill(tone) {
  if (tone === "high")
    return "border-emerald-200 bg-emerald-50 text-emerald-800";
  if (tone === "med") return "border-amber-200 bg-amber-50 text-amber-800";
  return "border-rose-200 bg-rose-50 text-rose-800";
}

function toneDot(tone) {
  if (tone === "high") return "bg-emerald-500";
  if (tone === "med") return "bg-amber-500";
  return "bg-rose-500";
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
  return Array.from(new Set(arr.filter(Boolean)));
}

function normalizeToken(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
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

/* ----------------------------- derived: focus & signals ----------------------------- */
function computeFocusAreas({ projects, startups, newsItems }) {
  const sectorCounts = buildCounts(
    [...(projects || []), ...(startups || [])],
    (x) => (x.sector ? String(x.sector).trim() : "")
  );
  const stageCounts = buildCounts(
    [...(projects || []), ...(startups || [])],
    (x) => (x.stage ? String(x.stage).trim() : "")
  );
  const topicCounts = buildCounts(newsItems || [], (x) =>
    x.impact_type ? String(x.impact_type).trim() : ""
  );

  const topSectors = topNFromCounts(sectorCounts, 5);
  const topStages = topNFromCounts(stageCounts, 5);
  const topTopics = topNFromCounts(topicCounts, 5);

  const focusAreas = topSectors.map((x) => x.key).filter(Boolean);

  return {
    topSectors,
    topStages,
    topTopics,
    focusAreas: focusAreas.length
      ? focusAreas
      : ["Solar", "Wind", "Grid", "Efficiency"],
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
    .filter(Boolean);

  const present = scored.filter((x) => x.score);
  const sorted = present
    .slice()
    .sort((a, b) => (b.score?.n || 0) - (a.score?.n || 0));

  return { all: scored, sorted };
}

/* ----------------------------- derived: market mechanics ----------------------------- */
/**
 * Convert frameworks + policies into actionable buckets.
 * Goal: show “how execution works” instead of dumping lists.
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
        /auction|tender|procurement|competitive|bid/.test(normalizeToken(x)),
      unlocks: [
        "Clear route to utility-scale deals",
        "Price discovery and bankability signals",
      ],
    },
    {
      key: "revenue",
      title: "Revenue contracts (PPAs)",
      subtitle: "What reduces revenue risk for developers",
      match: (x) => /ppa|power purchase|contract/.test(normalizeToken(x)),
      unlocks: ["Stable revenue structures", "Corporate procurement pathways"],
    },
    {
      key: "distributed",
      title: "Distributed energy rules",
      subtitle: "Net metering, rooftop solar, small generation",
      match: (x) =>
        /net metering|distributed|rooftop|small scale|feed in/.test(
          normalizeToken(x)
        ),
      unlocks: [
        "SME/household adoption",
        "Fast deployment and local installers",
      ],
    },
    {
      key: "grid",
      title: "Grid access & integration",
      subtitle: "Interconnection, grid codes, flexibility",
      match: (x) =>
        /grid|interconnection|connection|code|flexibility|demand response|ancillary|storage/.test(
          normalizeToken(x)
        ),
      unlocks: [
        "Lower integration risk",
        "Storage/flexibility business models",
      ],
    },
    {
      key: "efficiency",
      title: "Efficiency & standards",
      subtitle: "Buildings, industry, and demand-side measures",
      match: (x) =>
        /efficiency|standard|retrofit|building|appliance|loss/.test(
          normalizeToken(x)
        ),
      unlocks: [
        "Stable demand for efficiency solutions",
        "Measurable near-term impact",
      ],
    },
    {
      key: "finance",
      title: "Incentives & enabling programs",
      subtitle: "What improves economics and delivery",
      match: (x) =>
        /incentive|support|subsidy|tax|grant|program|roadmap|strategy|target|plan/.test(
          normalizeToken(x)
        ),
      unlocks: [
        "Improved unit economics",
        "Clear priority sectors and timelines",
      ],
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

  for (const f of frameworks) {
    const hay = `${f.framework_type || ""} ${f.name || ""} ${
      f.description || ""
    }`;
    const key =
      buckets.find((b) => b.match(hay))?.key ||
      (f.framework_type ? "grid" : "finance");
    results[key].items.push(addItem(key, f, "framework"));
  }

  for (const p of policies) {
    const hay = `${p.policy_type || ""} ${p.title || ""} ${p.summary || ""}`;
    const key = buckets.find((b) => b.match(hay))?.key || "finance";
    results[key].items.push(addItem(key, p, "policy"));
  }

  const bucketList = Object.values(results);

  const present = bucketList.filter((b) => b.items.length > 0);
  const missing = bucketList.filter((b) => b.items.length === 0);

  // quick “so what”
  const insight =
    present.length >= 4
      ? "Execution pathways are well-defined across multiple levers."
      : present.length >= 2
      ? "Some pathways are defined; a few key levers are still emerging."
      : "Limited recorded pathways — add more policies/frameworks to clarify execution.";

  // highlight 2 strongest buckets by item count
  const topBuckets = present
    .slice()
    .sort((a, b) => b.items.length - a.items.length)
    .slice(0, 2)
    .map((b) => b.title);

  return {
    buckets: bucketList,
    insight,
    missingTop: missing.slice(0, 2).map((b) => b.title),
    topBuckets,
  };
}

/* ----------------------------- UI helpers ----------------------------- */
function Anchor({ href, children }) {
  return (
    <a
      href={href}
      className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
    >
      {children}
    </a>
  );
}

function MiniStat({ label, value, sub }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-[11px] font-extrabold uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950">
        {value}
      </div>
      {sub ? <div className="mt-1 text-sm text-slate-600">{sub}</div> : null}
    </div>
  );
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
  const latestDate = newsItems?.[0]?.published_at
    ? formatDate(newsItems[0].published_at)
    : "—";

  // indicators map
  const ind = {};
  for (const x of country.indicators || []) ind[x.key] = x;

  // prev/next
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
  const signals = scoreCardsFromIndicators(ind);
  const mechanics = bucketMechanics(country);

  const projectsCount = (projects || []).length;
  const startupsCount = (startups || []).length;
  const frameworksCount = (country.frameworks || []).length;
  const policiesCount = (country.policies || []).length;

  const topNews = newsItems.slice(0, 6);

  const topSector = focus.topSectors?.[0]?.key || "—";
  const topStage = focus.topStages?.[0]?.key || "—";
  const topTopic = focus.topTopics?.[0]?.key || null;

  const strongest = signals.sorted.slice(0, 2);
  const weakest = signals.sorted.slice(-2);

  const heroBadges = uniq([
    `ISO:${country.iso2}`,
    ...focus.focusAreas.slice(0, 2),
    country.region,
  ]).slice(0, 4);

  return (
    <div className="space-y-6">
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

      {/* HERO: concise, decision-first */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute -right-24 top-0 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(59,130,246,0.10),transparent_45%),radial-gradient(circle_at_82%_18%,rgba(16,185,129,0.10),transparent_45%)]" />
        </div>

        <div className="relative p-6 md:p-8">
          {/* badges */}
          <div className="flex flex-wrap gap-2">
            {heroBadges.map((b) => (
              <span
                key={b}
                className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700"
              >
                {b}
              </span>
            ))}
            {topTopic ? (
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                Topic: {topTopic}
              </span>
            ) : null}
          </div>

          <div className="mt-5 grid gap-6 lg:grid-cols-12 lg:items-start">
            {/* left */}
            <div className="lg:col-span-7">
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 md:text-5xl">
                {country.name}
              </h1>

              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-700">
                {safeText(
                  country.briefing,
                  "A structured view of readiness, market rules, and ecosystem activity — built for quick, practical decisions."
                )}
              </p>

              {/* section anchors (helps usability) */}
              <div className="mt-5 flex flex-wrap gap-2">
                <Anchor href="#signals">Readiness</Anchor>
                <Anchor href="#mechanics">Market mechanics</Anchor>
                <Anchor href="#ecosystem">Ecosystem</Anchor>
                <Anchor href="#signals-feed">Signals</Anchor>
              </div>

              {/* primary actions */}
              <div className="mt-6 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                <Link
                  href={`/projects?country_id=${country.id}`}
                  className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
                >
                  Explore projects →
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
                <Link
                  href={`/news?country_id=${country.id}`}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
                >
                  Latest signals
                </Link>
              </div>

              {/* strongest/weakest quick insight */}
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                    What looks strong
                  </div>
                  <div className="mt-2 space-y-2">
                    {strongest.length ? (
                      strongest.map((s) => (
                        <div
                          key={s.key}
                          className="flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={`h-2.5 w-2.5 rounded-full ${toneDot(
                                s.score.tone
                              )}`}
                            />
                            <div className="text-sm font-semibold text-slate-900">
                              {s.label}
                            </div>
                          </div>
                          <div className="text-sm font-extrabold text-slate-900">
                            {s.score.n}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-slate-600">
                        No indicators yet.
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                    What needs attention
                  </div>
                  <div className="mt-2 space-y-2">
                    {weakest.length ? (
                      weakest.map((s) => (
                        <div
                          key={s.key}
                          className="flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={`h-2.5 w-2.5 rounded-full ${toneDot(
                                s.score.tone
                              )}`}
                            />
                            <div className="text-sm font-semibold text-slate-900">
                              {s.label}
                            </div>
                          </div>
                          <div className="text-sm font-extrabold text-slate-900">
                            {s.score.n}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-slate-600">
                        No indicators yet.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* right: decision cards */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-extrabold text-slate-900">
                      Decision snapshot
                    </div>
                    <div className="mt-1 text-sm text-slate-600">
                      Fast context for planning, scouting, and outreach.
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700">
                    Updated: {latestDate}
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <MiniStat
                    label="Primary focus"
                    value={topSector}
                    sub={
                      focus.topSectors?.[0]
                        ? `${focus.topSectors[0].count} listings tagged`
                        : "Add sector tags"
                    }
                  />
                  <MiniStat
                    label="Stage momentum"
                    value={topStage}
                    sub={
                      focus.topStages?.[0]
                        ? `${focus.topStages[0].count} listings tagged`
                        : "Add stage tags"
                    }
                  />
                  <MiniStat
                    label="Listings"
                    value={String(projectsCount + startupsCount)}
                    sub={`${projectsCount} projects • ${startupsCount} startups`}
                  />
                  <MiniStat
                    label="Market mechanics"
                    value={String(
                      mechanics.buckets.filter((b) => b.items.length > 0).length
                    )}
                    sub={`${frameworksCount} frameworks • ${policiesCount} policies`}
                  />
                </div>

                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                    Focus areas
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {focus.focusAreas.slice(0, 8).map((x) => (
                      <span
                        key={x}
                        className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-800"
                      >
                        {x}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 text-xs text-slate-500">
                  Indicators are normalized signals (0–100 display). Update
                  links come from public sources.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BODY: responsive layout */}
      <section className="grid gap-4 lg:grid-cols-12">
        {/* MAIN */}
        <div className="space-y-4 lg:col-span-8">
          {/* Readiness signals */}
          <div
            id="signals"
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
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
                Compare countries →
              </Link>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {signals.all.map((c) => (
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
                      {c.score ? c.score.n : "—"}
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

          {/* Market mechanics */}
          <div
            id="mechanics"
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">
                  Market mechanics
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  Not just “policies”: these are the levers that determine how
                  projects get contracted, connected, and financed.
                </p>
              </div>
              <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                {frameworksCount} frameworks • {policiesCount} policies
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <span className="font-bold text-slate-900">Quick read: </span>
              {mechanics.insight}
              {mechanics.topBuckets.length ? (
                <span className="text-slate-600">
                  {" "}
                  Strongest areas:{" "}
                  <span className="font-semibold text-slate-900">
                    {mechanics.topBuckets.join(", ")}
                  </span>
                  .
                </span>
              ) : null}
              {mechanics.missingTop.length ? (
                <span className="text-slate-600">
                  {" "}
                  Missing coverage:{" "}
                  <span className="font-semibold text-slate-900">
                    {mechanics.missingTop.join(", ")}
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

                  <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <div className="text-[11px] font-extrabold uppercase tracking-wide text-slate-500">
                      What this unlocks
                    </div>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                      {b.unlocks.map((u) => (
                        <li key={u}>{u}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4 space-y-2">
                    {b.items.length === 0 ? (
                      <div className="rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-600">
                        No items recorded yet.
                        <div className="mt-1 text-xs text-slate-500">
                          Add 1–2 sourced entries here and the page becomes
                          dramatically more credible.
                        </div>
                      </div>
                    ) : (
                      b.items.slice(0, 4).map((it) => (
                        <details
                          key={`${it.type}-${it.id}`}
                          className="group rounded-xl border border-slate-200 bg-white p-4"
                        >
                          <summary className="cursor-pointer list-none">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="text-sm font-extrabold text-slate-900">
                                  {it.title}
                                </div>
                                <div className="mt-1 text-xs text-slate-500">
                                  <span className="font-semibold text-slate-700">
                                    {it.type === "framework"
                                      ? "Framework"
                                      : "Policy"}
                                  </span>{" "}
                                  <span className="text-slate-300">•</span>{" "}
                                  <span className="font-mono">
                                    {safeText(it.meta)}
                                  </span>
                                </div>
                              </div>
                              <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-extrabold text-slate-700">
                                {safeText(it.status, "—")}
                              </span>
                            </div>
                            <div className="mt-2 text-xs font-semibold text-slate-500 group-open:hidden">
                              Expand →
                            </div>
                          </summary>

                          <div className="mt-3 space-y-3">
                            <p className="text-sm text-slate-700">
                              {safeText(it.desc, "No description provided.")}
                            </p>

                            {it.why ? (
                              <p className="text-sm text-slate-900">
                                <span className="font-extrabold">Benefit:</span>{" "}
                                {it.why}
                              </p>
                            ) : null}

                            {it.source ? (
                              <a
                                className="inline-flex items-center text-sm font-semibold text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-500"
                                href={it.source}
                                target="_blank"
                                rel="noreferrer"
                              >
                                Open source →
                              </a>
                            ) : (
                              <div className="text-xs text-slate-500">
                                Add a source URL to make this publish-grade.
                              </div>
                            )}
                          </div>
                        </details>
                      ))
                    )}
                  </div>

                  {b.items.length > 4 ? (
                    <div className="mt-2 text-xs text-slate-500">
                      Showing 4 of {b.items.length}.
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          {/* Recent signals */}
          <div
            id="signals-feed"
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
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

        {/* SIDEBAR */}
        <aside id="ecosystem" className="space-y-4 lg:col-span-4">
          {/* Ecosystem navigation */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
              Ecosystem
            </div>
            <div className="mt-2 text-base font-extrabold text-slate-900">
              Explore pipeline
            </div>
            <p className="mt-2 text-sm text-slate-600">
              Browse active listings and use the matching system from project
              pages.
            </p>

            <div className="mt-4 grid gap-2">
              <Link
                href={`/projects?country_id=${country.id}`}
                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
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

            {/* top sectors + stages */}
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                  Top sectors
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {focus.topSectors.length ? (
                    focus.topSectors.slice(0, 6).map((x) => (
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
                      Add sector tags to listings to surface focus areas.
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                  Stage distribution
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {focus.topStages.length ? (
                    focus.topStages.slice(0, 6).map((x) => (
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
                      Add stage tags to make pipeline maturity visible.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Practical guidance */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
              Guidance
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
