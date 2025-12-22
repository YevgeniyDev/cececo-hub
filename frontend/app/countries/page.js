import Link from "next/link";

const API_BASE =
  process.env.API_INTERNAL_BASE ||
  process.env.NEXT_PUBLIC_API_BASE ||
  "http://localhost:8000";

async function getCountries() {
  const res = await fetch(`${API_BASE}/api/v1/countries`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch countries");
  return res.json();
}

export default async function CountriesPage() {
  const countries = await getCountries();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Countries</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            CECECO member countries currently supported in the MVP.
          </p>
        </div>

        <div className="text-sm text-slate-500">
          Tip: open a country to see briefing + updates
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {countries.map((c) => (
          <div
            key={c.id}
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-lg font-bold leading-tight">{c.name}</div>
                <div className="mt-1 text-sm text-slate-600">
                  <span className="font-semibold text-slate-800">ISO2:</span>{" "}
                  <span className="font-mono">{c.iso2}</span>
                  {c.region ? (
                    <>
                      {" "}
                      <span className="text-slate-300">•</span>{" "}
                      <span className="font-semibold text-slate-800">
                        Region:
                      </span>{" "}
                      {c.region}
                    </>
                  ) : null}
                </div>
              </div>

              <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-600">
                Country
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
                href={`/countries/${c.id}`}
              >
                Briefing →
              </Link>

              <Link
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
                href={`/projects?country_id=${c.id}`}
              >
                Projects →
              </Link>

              <Link
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
                href={`/startups?country_id=${c.id}`}
              >
                Startups →
              </Link>

              <Link
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
                href={`/news?country_id=${c.id}`}
              >
                Updates →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
