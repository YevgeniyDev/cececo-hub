"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function NewsFiltersClient({ countries }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL -> state
  const urlCountryId = searchParams.get("country_id") || "";
  const urlQ = searchParams.get("q") || "";

  const [countryId, setCountryId] = useState(urlCountryId);
  const [q, setQ] = useState(urlQ);

  // keep local state in sync when user lands via URL / navigation
  useEffect(() => {
    setCountryId(urlCountryId);
    setQ(urlQ);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlCountryId, urlQ]);

  // State -> URL (unified behavior)
  useEffect(() => {
    const sp = new URLSearchParams(searchParams.toString());

    if (countryId) sp.set("country_id", countryId);
    else sp.delete("country_id");

    if (q.trim()) sp.set("q", q.trim());
    else sp.delete("q");

    const next = sp.toString();
    const current = searchParams.toString();

    if (next !== current) {
      router.replace(next ? `/news?${next}` : "/news", { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryId, q]);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm"
        value={countryId}
        onChange={(e) => setCountryId(e.target.value)}
      >
        <option value="">All countries (global)</option>
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
          placeholder="Search news…"
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
  );
}
