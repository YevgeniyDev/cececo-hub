"use client";

import { useEffect, useMemo, useState } from "react";

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

function SectionLabel({ children }) {
  return (
    <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
      {children}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="h-4 w-1/2 rounded-full bg-slate-100" />
        <div className="h-6 w-16 rounded-full bg-slate-100" />
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-3 w-1/3 rounded-full bg-slate-100" />
        <div className="h-3 w-4/5 rounded-full bg-slate-100" />
        <div className="h-3 w-3/5 rounded-full bg-slate-100" />
      </div>
      <div className="mt-5 flex gap-2">
        <div className="h-6 w-20 rounded-full bg-slate-100" />
        <div className="h-6 w-24 rounded-full bg-slate-100" />
        <div className="h-6 w-16 rounded-full bg-slate-100" />
      </div>
    </div>
  );
}

export default function InvestorsClient({
  title = "Investors",
  subtitle = "",
}) {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [investorType, setInvestorType] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [countries, setCountries] = useState([]);
  const [countryId, setCountryId] = useState("");

  const params = useMemo(() => {
    const p = new URLSearchParams();
    if (q.trim()) p.set("q", q.trim());
    if (investorType) p.set("investor_type", investorType);
    if (countryId) p.set("country_id", countryId);
    return p.toString();
  }, [q, investorType, countryId]);

  async function load() {
    setLoading(true);
    setErr("");
    try {
      const [cList, data] = await Promise.all([
        fetchJSON(`${API_BASE}/api/v1/countries`),
        fetchJSON(`${API_BASE}/api/v1/investors?${params}`),
      ]);
      setCountries(cList);
      setItems(data);
    } catch (e) {
      setErr(e?.message || "Failed to load investors");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

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
            value={investorType}
            onChange={(e) => setInvestorType(e.target.value)}
          >
            <option value="">All types</option>
            <option value="fund">Fund</option>
            <option value="angel">Angel</option>
            <option value="corporate">Corporate</option>
            <option value="public">Public</option>
            <option value="ngo">NGO</option>
          </select>

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

          <input
            className="h-10 w-64 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 shadow-sm outline-none placeholder:text-slate-400 hover:bg-slate-50 focus:border-slate-400"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name / sectors / stages…"
          />
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
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((inv) => (
            <div
              key={inv.id}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold leading-snug">
                    {inv.name}
                  </h3>
                  <div className="mt-1 text-xs text-slate-500">
                    ID: <span className="font-mono">{inv.id}</span>
                  </div>
                </div>
                <Pill>{inv.investor_type}</Pill>
              </div>

              <div className="mt-4 space-y-4">
                {/* Countries */}
                {inv.countries?.length ? (
                  <div>
                    <SectionLabel>Countries</SectionLabel>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {inv.countries.map((c) => (
                        <Chip key={c.id}>
                          {c.name} ({c.iso2})
                        </Chip>
                      ))}
                    </div>
                  </div>
                ) : null}

                {/* Sectors */}
                {inv.focus_sectors ? (
                  <div>
                    <SectionLabel>Sectors</SectionLabel>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {inv.focus_sectors
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean)
                        .map((s) => (
                          <Chip key={`sector-${inv.id}-${s}`}>{s}</Chip>
                        ))}
                    </div>
                  </div>
                ) : null}

                {/* Stages */}
                {inv.stages ? (
                  <div>
                    <SectionLabel>Stages</SectionLabel>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {inv.stages
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean)
                        .map((s) => (
                          <Chip key={`stage-${inv.id}-${s}`}>{s}</Chip>
                        ))}
                    </div>
                  </div>
                ) : null}

                {/* Ticket */}
                {inv.ticket_min != null || inv.ticket_max != null ? (
                  <div>
                    <SectionLabel>Ticket</SectionLabel>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Chip>
                        {inv.ticket_min != null ? `$${inv.ticket_min}` : "—"} to{" "}
                        {inv.ticket_max != null ? `$${inv.ticket_max}` : "—"}
                      </Chip>
                    </div>
                  </div>
                ) : null}

                {/* Links */}
                {inv.website ? (
                  <div className="text-sm text-slate-700">
                    Website:{" "}
                    <a
                      className="font-semibold text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-500"
                      href={inv.website}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {inv.website}
                    </a>
                  </div>
                ) : null}

                {inv.contact_email ? (
                  <div className="text-sm text-slate-700">
                    Email:{" "}
                    <span className="font-mono text-slate-900">
                      {inv.contact_email}
                    </span>
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
