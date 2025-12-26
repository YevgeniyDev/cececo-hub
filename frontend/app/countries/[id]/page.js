import Link from "next/link";

const API_BASE =
  process.env.API_INTERNAL_BASE ||
  process.env.NEXT_PUBLIC_API_BASE ||
  "http://localhost:8000";

function scoreLabel(v) {
  const n = Math.round(v * 100);
  if (n >= 70) return { text: `${n}/100`, tone: "high", label: "High" };
  if (n >= 50) return { text: `${n}/100`, tone: "med", label: "Medium" };
  return { text: `${n}/100`, tone: "low", label: "Low" };
}

function tonePill(tone) {
  if (tone === "high")
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (tone === "med") return "border-amber-200 bg-amber-50 text-amber-700";
  return "border-rose-200 bg-rose-50 text-rose-700";
}

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
  const res = await fetch(`${API_BASE}/api/v1/news?${params.toString()}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch country news");
  return res.json();
}

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

  const topNews = (news || []).slice(0, 6);

  return (
    <div className="space-y-6">
      {/* NAV */}
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/countries"
          className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
        >
          ← All countries
        </Link>

        {/* Previous/Next buttons on the right */}
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

      {/* header */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
            Knowledge hub
          </span>
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
            Regulatory frameworks
          </span>
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
            Curated indicators
          </span>
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight">
          {country.name} <span className="text-slate-300">—</span>{" "}
          <span className="text-slate-400">Briefing</span>
        </h1>

        {/* Action buttons under country name */}
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
          <Link
            href={`/news?country_id=${country.id}`}
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
          >
            Updates →
          </Link>
          <Link
            href={`/projects?country_id=${country.id}`}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
          >
            Projects →
          </Link>
          <Link
            href={`/startups?country_id=${country.id}`}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
          >
            Startups →
          </Link>
          <Link
            href={`/investors?country_id=${country.id}`}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
          >
            Investors →
          </Link>
        </div>

        <p className="max-w-3xl text-sm text-slate-600">
          MVP briefing with curated indicators and policy/framework summaries.
          Production version connects to public datasets and official sources.
        </p>
      </div>

      {/* Snapshot */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-extrabold">Clean Energy Snapshot</h2>
        <p className="mt-2 max-w-4xl text-sm text-slate-600">
          {country.briefing ||
            "No briefing text yet (seed this country narrative)."}
        </p>

        <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-5">
          {[
            ["Policy readiness", "policy_readiness"],
            ["Investment attractiveness", "investment_attractiveness"],
            ["Renewable potential", "renewable_proxy"],
            ["Efficiency opportunity", "efficiency_need"],
            ["Grid readiness", "grid_proxy"],
          ].map(([label, key]) => {
            const it = ind[key];
            const s = it ? scoreLabel(it.value) : null;

            return (
              <div
                key={key}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="text-xs font-bold text-slate-700">
                    {label}
                  </div>
                  {s ? (
                    <span
                      className={[
                        "rounded-full border px-2 py-1 text-[11px] font-extrabold",
                        tonePill(s.tone),
                      ].join(" ")}
                    >
                      {s.label}
                    </span>
                  ) : null}
                </div>

                <div className="mt-2 text-2xl font-extrabold tracking-tight">
                  {s ? s.text : "—"}
                </div>

                <div className="mt-2 text-sm text-slate-600">
                  {it?.details || "Curated MVP (transparent)."}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Latest updates + Signals */}
      <section className="grid gap-4 lg:grid-cols-3">
        {/* Latest updates */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-1">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-extrabold">Latest updates</h2>
            <Link
              href={`/news?country_id=${country.id}`}
              className="text-sm font-semibold text-slate-900 underline underline-offset-4 hover:opacity-80"
            >
              View all →
            </Link>
          </div>

          <p className="mt-2 text-sm text-slate-600">
            Approved updates related to policies, regulations, projects, and
            achievements.
          </p>

          <div className="mt-4 space-y-3">
            {topNews.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                No approved news items yet.
              </div>
            ) : (
              topNews.map((n) => (
                <div
                  key={n.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-sm font-extrabold leading-snug">
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
                    {new Date(n.published_at).toLocaleDateString()}
                  </div>

                  <p className="mt-2 text-sm text-slate-600">{n.summary}</p>

                  {n.source_url ? (
                    <div className="mt-2">
                      <a
                        className="text-sm font-semibold text-slate-900 underline underline-offset-4 hover:opacity-80"
                        href={n.source_url}
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

        {/* Regulatory & Policy Signals */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="text-lg font-extrabold">
            Regulatory & Policy Signals
          </h2>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {/* Frameworks */}
            <div>
              <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                Frameworks
              </div>

              <div className="mt-3 space-y-3">
                {(country.frameworks || []).length === 0 ? (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                    No frameworks seeded yet.
                  </div>
                ) : (
                  country.frameworks.map((f) => (
                    <div
                      key={f.id}
                      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="text-sm font-extrabold">{f.name}</div>
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-extrabold text-slate-700">
                          {f.status}
                        </span>
                      </div>

                      <div className="mt-2 text-xs text-slate-600">
                        <span className="font-semibold text-slate-800">
                          Type:
                        </span>{" "}
                        {f.framework_type}
                      </div>

                      <p className="mt-2 text-sm text-slate-600">
                        {f.description}
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
                            className="text-sm font-semibold text-slate-900 underline underline-offset-4 hover:opacity-80"
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
                Policies / Action Plans
              </div>

              <div className="mt-3 space-y-3">
                {(country.policies || []).length === 0 ? (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                    No policies seeded yet.
                  </div>
                ) : (
                  country.policies.map((p) => (
                    <div
                      key={p.id}
                      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="text-sm font-extrabold">{p.title}</div>
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-extrabold text-slate-700">
                          {p.status}
                        </span>
                      </div>

                      <div className="mt-2 text-xs text-slate-600">
                        <span className="font-semibold text-slate-800">
                          Type:
                        </span>{" "}
                        {p.policy_type}
                      </div>

                      <p className="mt-2 text-sm text-slate-600">{p.summary}</p>

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
                            className="text-sm font-semibold text-slate-900 underline underline-offset-4 hover:opacity-80"
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
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-extrabold">
          Clean Energy Potential & Implementation Guidance
        </h2>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
              Potential & priorities
            </div>
            <p className="mt-2 text-sm text-slate-600">
              {country.potential_notes ||
                "No potential notes yet (seed this narrative)."}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
              What works right now
            </div>
            <p className="mt-2 text-sm text-slate-600">
              {country.action_plan_notes ||
                "No action guidance yet (seed this narrative)."}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
