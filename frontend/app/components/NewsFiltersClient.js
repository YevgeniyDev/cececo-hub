"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function NewsFiltersClient({ countries }) {
  const router = useRouter();
  const sp = useSearchParams();

  const urlCountryId = sp.get("country_id") || "";
  const urlQ = sp.get("q") || "";

  const [countryId, setCountryId] = useState(urlCountryId);
  const [q, setQ] = useState(urlQ);

  // keep local state in sync if user lands with URL params
  useEffect(() => {
    setCountryId(urlCountryId);
    setQ(urlQ);
  }, [urlCountryId, urlQ]);

  function apply(nextCountryId, nextQ) {
    const params = new URLSearchParams(sp.toString());

    if (nextCountryId) params.set("country_id", nextCountryId);
    else params.delete("country_id");

    if (nextQ.trim()) params.set("q", nextQ.trim());
    else params.delete("q");

    const next = params.toString();
    router.replace(next ? `/news?${next}` : "/news", { scroll: false });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm"
        value={countryId}
        onChange={(e) => {
          const v = e.target.value;
          setCountryId(v);
          apply(v, q);
        }}
      >
        <option value="">All countries (global)</option>
        {countries.map((c) => (
          <option key={c.id} value={String(c.id)}>
            {c.name} ({c.iso2})
          </option>
        ))}
      </select>

      <input
        className="h-10 w-56 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search news…"
      />

      <button
        className="h-10 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-800"
        onClick={() => apply(countryId, q)}
      >
        Search
      </button>
    </div>
  );
}
