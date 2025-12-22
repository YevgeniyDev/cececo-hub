const API_BASE =
  process.env.API_INTERNAL_BASE ||
  process.env.NEXT_PUBLIC_API_BASE ||
  "http://localhost:8000";

function scoreLabel(v) {
  const n = Math.round(v * 100);
  if (n >= 70) return { text: `${n}/100`, level: "High" };
  if (n >= 50) return { text: `${n}/100`, level: "Medium" };
  return { text: `${n}/100`, level: "Low" };
}

function levelBadge(level) {
  if (level === "High")
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (level === "Medium") return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-rose-50 text-rose-700 border-rose-200";
}

async function getCountry(id) {
  const res = await fetch(`${API_BASE}/api/v1/countries/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch country briefing");
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
  const [country, news] = await Promise.all([
    getCountry(params.id),
    getNews(params.id),
  ]);

  const ind = {};
  for (const x of country.indicators || []) ind[x.key] = x;
  const topNews = (news || []).slice(0, 6);

  const metrics = [
    { key: "policy_readiness", name: "Policy readiness" },
    { key: "investment_attractiveness", name: "Investment attractiveness" },
    { key: "renewable_proxy", name: "Renewable potential" },
    { key: "efficiency_need", name: "Efficiency opportunity" },
    { key: "grid_proxy", name: "Grid readiness" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
            Knowledge hub
          </span>
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
            Regulatory frameworks
          </span>
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
            Curated indicators
          </span>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              {country.name} <span className="text-slate-400">— Briefing</span>
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">
              MVP briefing with curated indicators and policy/framework
              summaries. Production version connects to public datasets and
              official sources.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <a
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
              href={`/projects?country_id=${country.id}`}
            >
              Projects →
            </a>
            <a
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
              href={`/startups?country_id=${country.id}`}
            >
              Startups →
            </a>
            <a
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
              href={`/news?country_id=${country.id}`}
            >
              Updates →
            </a>
          </div>
        </div>
      </div>

      {/* Snapshot */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-bold">Clean Energy Snapshot</h2>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
              {country.briefing ||
                "No briefing text yet (seed this country narrative)."}
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {metrics.map((m) => {
            const item = ind[m.key];
            const val = item?.value;
            const scored = val != null ? scoreLabel(val) : null;

            return (
              <div
                key={m.key}
                className="rounded-2xl border border-slate-200 bg-white p-4"
              >
                <div className="text-xs font-semibold text-slate-600">
                  {m.name}
                </div>

                <div className="mt-2 flex items-center justify-between gap-2">
                  <div className="text-lg font-extrabold">
                    {scored ? scored.text : "—"}
                  </div>
                  {scored ? (
                    <span
                      className={`rounded-full border px-2 py-1 text-[11px] font-semibold ${levelBadge(
                        scored.level
                      )}`}
                    >
                      {scored.level}
                    </span>
                  ) : null}
                </div>

                <div className="mt-2 text-xs text-slate-500">
                  {item?.details || "Curated MVP (transparent)."}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Latest updates + Reg/Policy grid */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Latest updates */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-1">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-bold">Latest updates</h2>
            <a
              className="text-sm font-semibold text-slate-800 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-500"
              href={`/news?country_id=${country.id}`}
            >
              View all →
            </a>
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
                <article
                  key={n.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-sm font-bold leading-snug">
                      {n.title}
                    </div>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-700">
                      {n.impact_score}
                    </span>
                  </div>

                  <div className="mt-1 text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">
                      {n.impact_type}
                    </span>{" "}
                    • {new Date(n.published_at).toLocaleDateString()}
                  </div>

                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    {n.summary}
                  </p>

                  {n.source_url ? (
                    <a
                      className="mt-2 inline-block text-sm font-semibold text-slate-800 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-500"
                      href={n.source_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Source →
                    </a>
                  ) : null}
                </article>
              ))
            )}
          </div>
        </section>

        {/* Regulatory + Policy */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="text-base font-bold">Regulatory & Policy Signals</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {/* Frameworks */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wide text-slate-500">
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
                      className="rounded-2xl border border-slate-200 bg-white p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="text-sm font-bold">{f.name}</div>
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-600">
                          {f.status}
                        </span>
                      </div>

                      <div className="mt-1 text-xs text-slate-500">
                        <span className="font-semibold text-slate-700">
                          Type:
                        </span>{" "}
                        {f.framework_type}
                      </div>

                      <p className="mt-2 text-sm leading-6 text-slate-700">
                        {f.description}
                      </p>

                      {f.why_it_matters ? (
                        <p className="mt-2 text-sm font-semibold text-slate-900">
                          Why it matters:{" "}
                          <span className="font-normal text-slate-700">
                            {f.why_it_matters}
                          </span>
                        </p>
                      ) : null}

                      {f.source_url ? (
                        <a
                          className="mt-2 inline-block text-sm font-semibold text-slate-800 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-500"
                          href={f.source_url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Source →
                        </a>
                      ) : null}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Policies */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wide text-slate-500">
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
                      className="rounded-2xl border border-slate-200 bg-white p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="text-sm font-bold">{p.title}</div>
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-600">
                          {p.status}
                        </span>
                      </div>

                      <div className="mt-1 text-xs text-slate-500">
                        <span className="font-semibold text-slate-700">
                          Type:
                        </span>{" "}
                        {p.policy_type}
                      </div>

                      <p className="mt-2 text-sm leading-6 text-slate-700">
                        {p.summary}
                      </p>

                      {p.why_it_matters ? (
                        <p className="mt-2 text-sm font-semibold text-slate-900">
                          Why it matters:{" "}
                          <span className="font-normal text-slate-700">
                            {p.why_it_matters}
                          </span>
                        </p>
                      ) : null}

                      {p.source_url ? (
                        <a
                          className="mt-2 inline-block text-sm font-semibold text-slate-800 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-500"
                          href={p.source_url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Source →
                        </a>
                      ) : null}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Guidance */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-bold">
          Clean Energy Potential & Implementation Guidance
        </h2>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="text-xs font-bold uppercase tracking-wide text-slate-500">
              Potential & priorities
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              {country.potential_notes ||
                "No potential notes yet (seed this narrative)."}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="text-xs font-bold uppercase tracking-wide text-slate-500">
              What works right now
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              {country.action_plan_notes ||
                "No action guidance yet (seed this narrative)."}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
