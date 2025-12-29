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
  if (n >= 70) return { text: `${n}/100`, tone: "high", label: "Strong" };
  if (n >= 50) return { text: `${n}/100`, tone: "med", label: "Moderate" };
  return { text: `${n}/100`, tone: "low", label: "Early" };
}

function tonePill(tone) {
  if (tone === "high")
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (tone === "med") return "border-amber-200 bg-amber-50 text-amber-700";
  return "border-rose-200 bg-rose-50 text-rose-700";
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
  // Note: backend currently ignores limit/offset, but keep for future pagination
  params.set("limit", "20");
  params.set("offset", "0");
  const res = await fetch(`${API_BASE}/api/v1/news?${params.toString()}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch country news");
  return res.json();
}

/* ----------------------------- page ----------------------------- */
export default async function CountryBriefingPage({ params }) {
  const [country, countries, news] = await Promise.all([
    getCountry(params.id),
    getCountries(),
    getNews(params.id),
  ]);

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

  const newsItems = news?.items || news || [];
  const topNews = newsItems.slice(0, 6);

  const frameworksCount = (country.frameworks || []).length;
  const policiesCount = (country.policies || []).length;
  const updatesCount = newsItems.length;

  const kpiCards = [
    { label: "Updates", value: String(updatesCount), sub: "Recent signals" },
    {
      label: "Frameworks",
      value: String(frameworksCount),
      sub: "Regulatory context",
    },
    { label: "Plans", value: String(policiesCount), sub: "Actions & programs" },
    { label: "Ecosystem", value: "Explore", sub: "Projects & capital" },
  ];

  const snapshotCards = [
    ["Policy readiness", "policy_readiness", "Policy clarity and direction."],
    [
      "Investment attractiveness",
      "investment_attractiveness",
      "Signals relevant to capital deployment.",
    ],
    [
      "Renewable potential",
      "renewable_proxy",
      "Proxy view of resource and scale.",
    ],
    [
      "Efficiency opportunity",
      "efficiency_need",
      "Where demand-side gains are likely.",
    ],
    ["Grid readiness", "grid_proxy", "Enablers for integration and growth."],
  ];

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
            Country briefing
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

      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        {/* background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-28 -top-28 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute -right-28 top-10 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.10),transparent_45%),radial-gradient(circle_at_85%_25%,rgba(16,185,129,0.10),transparent_45%)]" />
        </div>

        <div className="relative p-7 md:p-10">
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
              Readiness signals
            </span>
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
              Policy context
            </span>
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
              Ecosystem navigation
            </span>
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
              Live updates
            </span>
          </div>

          <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:items-center">
            {/* Left */}
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 md:text-5xl">
                {country.name}
              </h1>

              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-700">
                A compact, decision-friendly view of clean-energy readiness,
                policy signals, and market activity — designed to help teams
                move from context to action.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                <Link
                  href={`/news?country_id=${country.id}`}
                  className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
                >
                  View updates →
                </Link>
                <Link
                  href={`/projects?country_id=${country.id}`}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
                >
                  Projects
                </Link>
                <Link
                  href={`/startups?country_id=${country.id}`}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
                >
                  Startups
                </Link>
                <Link
                  href={`/investors?country_id=${country.id}`}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
                >
                  Investors
                </Link>
              </div>

              <div className="mt-5 text-xs text-slate-500">
                Data sources: country indicators and summaries are curated;
                update links are fetched from public news sources via GDELT.
              </div>
            </div>

            {/* Right: KPIs / quick stats */}
            <div className="rounded-3xl border border-slate-200 bg-white/70 p-5 shadow-sm backdrop-blur-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-extrabold text-slate-900">
                    At a glance
                  </div>
                  <div className="mt-1 text-sm text-slate-600">
                    Signals, context, and pathways to explore.
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700">
                  Updated:{" "}
                  {topNews[0]?.published_at
                    ? formatDate(topNews[0].published_at)
                    : "—"}
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {kpiCards.map((k) => (
                  <div
                    key={k.label}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                      {k.label}
                    </div>
                    <div className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
                      {k.value}
                    </div>
                    <div className="mt-1 text-sm text-slate-600">{k.sub}</div>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                  Snapshot
                </div>
                <div className="mt-2 text-sm text-slate-700">
                  {safeText(
                    country.briefing,
                    "Country overview will appear here once added."
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Snapshot scores */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">
              Clean Energy Snapshot
            </h2>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">
              A consistent set of signals to compare readiness, opportunity, and
              enabling conditions across the region.
            </p>
          </div>

          <Link
            href="/countries"
            className="text-sm font-semibold text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-500"
          >
            Compare countries →
          </Link>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-5">
          {snapshotCards.map(([label, key, hint]) => {
            const it = ind[key];
            const s = it ? scoreLabel(it.value) : null;

            return (
              <div
                key={key}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="text-xs font-bold text-slate-700">
                    {label}
                  </div>
                  {s ? (
                    <span
                      className={[
                        "rounded-full border px-2 py-1 text-[11px] font-extrabold",
                        tonePill(s.tone),
                      ].join(" ")}
                      title={s.label}
                    >
                      {s.label}
                    </span>
                  ) : null}
                </div>

                <div className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
                  {s ? s.text : "—"}
                </div>

                <div className="mt-2 text-sm text-slate-600">
                  {it?.details ? it.details : hint}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Updates + Policy/Regulatory */}
      <section className="grid gap-4 lg:grid-cols-3">
        {/* Latest updates */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-1">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-extrabold text-slate-900">
              Latest updates
            </h2>
            <Link
              href={`/news?country_id=${country.id}`}
              className="text-sm font-semibold text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-500"
            >
              View all →
            </Link>
          </div>

          <p className="mt-2 text-sm text-slate-600">
            Recent policy and market signals relevant to clean energy.
          </p>

          <div className="mt-4 space-y-3">
            {topNews.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                No updates found yet for this country.
                <div className="mt-2 text-xs text-slate-500">
                  Tip: try “Live updates” in the top navigation and search.
                </div>
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
                    <span className="font-semibold text-slate-800">Type:</span>{" "}
                    <span className="font-mono">{n.impact_type}</span>{" "}
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

        {/* Regulatory & Policy */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">
                Policy & regulatory context
              </h2>
              <p className="mt-2 max-w-3xl text-sm text-slate-600">
                The key instruments and plans that shape the market environment,
                plus short “why it matters” notes for quick review.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href={`/projects?country_id=${country.id}`}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
              >
                See projects →
              </Link>
              <Link
                href={`/investors?country_id=${country.id}`}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
              >
                Find investors →
              </Link>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {/* Frameworks */}
            <div>
              <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                Frameworks
              </div>

              <div className="mt-3 space-y-3">
                {frameworksCount === 0 ? (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                    No frameworks added yet.
                  </div>
                ) : (
                  country.frameworks.map((f) => (
                    <div
                      key={f.id}
                      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="text-sm font-extrabold text-slate-900">
                          {f.name}
                        </div>
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-extrabold text-slate-700">
                          {safeText(f.status, "—")}
                        </span>
                      </div>

                      <div className="mt-2 text-xs text-slate-600">
                        <span className="font-semibold text-slate-800">
                          Type:
                        </span>{" "}
                        {safeText(f.framework_type)}
                      </div>

                      <p className="mt-2 text-sm text-slate-600">
                        {safeText(f.description, "No description provided.")}
                      </p>

                      {f.why_it_matters ? (
                        <p className="mt-3 text-sm text-slate-900">
                          <span className="font-extrabold">
                            Why it matters:
                          </span>{" "}
                          {f.why_it_matters}
                        </p>
                      ) : null}

                      {f.source_url ? (
                        <div className="mt-2">
                          <a
                            className="text-sm font-semibold text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-500"
                            href={f.source_url}
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

            {/* Policies */}
            <div>
              <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                Policies / action plans
              </div>

              <div className="mt-3 space-y-3">
                {policiesCount === 0 ? (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                    No policies added yet.
                  </div>
                ) : (
                  country.policies.map((p) => (
                    <div
                      key={p.id}
                      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="text-sm font-extrabold text-slate-900">
                          {p.title}
                        </div>
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-extrabold text-slate-700">
                          {safeText(p.status, "—")}
                        </span>
                      </div>

                      <div className="mt-2 text-xs text-slate-600">
                        <span className="font-semibold text-slate-800">
                          Type:
                        </span>{" "}
                        {safeText(p.policy_type)}
                      </div>

                      <p className="mt-2 text-sm text-slate-600">
                        {safeText(p.summary, "No summary provided.")}
                      </p>

                      {p.why_it_matters ? (
                        <p className="mt-3 text-sm text-slate-900">
                          <span className="font-extrabold">
                            Why it matters:
                          </span>{" "}
                          {p.why_it_matters}
                        </p>
                      ) : null}

                      {p.source_url ? (
                        <div className="mt-2">
                          <a
                            className="text-sm font-semibold text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-500"
                            href={p.source_url}
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
          </div>
        </div>
      </section>

      {/* Potential + guidance */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">
              Potential & implementation guidance
            </h2>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">
              A practical “what to focus on” section for teams planning policy,
              programs, pilots, or market entry.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href={`/startups?country_id=${country.id}`}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
            >
              Explore startups →
            </Link>
            <Link
              href={`/investors?country_id=${country.id}`}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
            >
              Explore investors →
            </Link>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
              Potential & priorities
            </div>
            <p className="mt-2 text-sm text-slate-600">
              {safeText(
                country.potential_notes,
                "Add a short paragraph describing the most promising clean-energy opportunities and priority sectors."
              )}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
              What works right now
            </div>
            <p className="mt-2 text-sm text-slate-600">
              {safeText(
                country.action_plan_notes,
                "Add actionable guidance: near-term steps, enabling reforms, and implementation considerations."
              )}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
