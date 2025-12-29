"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import InvestorForm from "./InvestorForm";

const API_BASE = (
  process.env.API_INTERNAL_BASE ||
  process.env.NEXT_PUBLIC_API_BASE ||
  "https://cececo-hub.onrender.com"
).replace(/\/+$/, "");

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
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL -> state
  const urlQ = searchParams.get("q") || "";
  const urlType = searchParams.get("investor_type") || "";
  const urlCountryId = searchParams.get("country_id") || "";

  const [items, setItems] = useState([]);
  const [allItems, setAllItems] = useState([]); // Store all items for filtering
  const [q, setQ] = useState(urlQ);
  const [investorType, setInvestorType] = useState(urlType);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [countries, setCountries] = useState([]);
  const [countryId, setCountryId] = useState(urlCountryId);
  const [showForm, setShowForm] = useState(false);
  const [selectedSectors, setSelectedSectors] = useState([]);
  const [selectedStages, setSelectedStages] = useState([]);

  // keep local state in sync when user navigates via links
  useEffect(() => {
    setQ(urlQ);
    setInvestorType(urlType);
    setCountryId(urlCountryId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlQ, urlType, urlCountryId]);

  // State -> URL
  useEffect(() => {
    const sp = new URLSearchParams(searchParams.toString());

    if (q.trim()) sp.set("q", q.trim());
    else sp.delete("q");

    if (investorType) sp.set("investor_type", investorType);
    else sp.delete("investor_type");

    if (countryId) sp.set("country_id", String(countryId));
    else sp.delete("country_id");

    const next = sp.toString();
    const current = searchParams.toString();
    if (next !== current) router.replace(`?${next}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, investorType, countryId]);

  const params = useMemo(() => {
    const p = new URLSearchParams();
    if (q.trim()) p.set("q", q.trim());
    if (investorType) p.set("investor_type", investorType);
    if (countryId) p.set("country_id", String(countryId));
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
      setAllItems(data);
      // Apply client-side filters
      applyFilters(data);
    } catch (e) {
      setErr(e?.message || "Failed to load investors");
    } finally {
      setLoading(false);
    }
  }

  // Extract unique sectors and stages from all items
  const availableSectors = useMemo(() => {
    const sectors = new Set();
    allItems.forEach((inv) => {
      if (inv.focus_sectors) {
        inv.focus_sectors
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
          .forEach((s) => sectors.add(s));
      }
    });
    return Array.from(sectors).sort();
  }, [allItems]);

  const availableStages = useMemo(() => {
    const stages = new Set();
    allItems.forEach((inv) => {
      if (inv.stages) {
        inv.stages
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
          .forEach((s) => stages.add(s));
      }
    });
    return Array.from(stages).sort();
  }, [allItems]);

  // Apply client-side filters for sectors and stages
  function applyFilters(data) {
    let filtered = [...data];

    // Filter by sectors
    if (selectedSectors.length > 0) {
      filtered = filtered.filter((inv) => {
        if (!inv.focus_sectors) return false;
        const invSectors = inv.focus_sectors
          .split(",")
          .map((s) => s.trim().toLowerCase());
        return selectedSectors.some((sel) =>
          invSectors.includes(sel.toLowerCase())
        );
      });
    }

    // Filter by stages
    if (selectedStages.length > 0) {
      filtered = filtered.filter((inv) => {
        if (!inv.stages) return false;
        const invStages = inv.stages
          .split(",")
          .map((s) => s.trim().toLowerCase());
        return selectedStages.some((sel) =>
          invStages.includes(sel.toLowerCase())
        );
      });
    }

    setItems(filtered);
  }

  // Update filters when selections change
  useEffect(() => {
    if (allItems.length > 0) {
      applyFilters(allItems);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSectors, selectedStages, allItems]);

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
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <span>
              API: <span className="font-mono">{API_BASE}</span>
            </span>
            {!loading && allItems.length > 0 && (
              <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 font-semibold text-slate-700">
                {allItems.length}{" "}
                {allItems.length === 1 ? "investor" : "investors"}
                {items.length !== allItems.length &&
                  ` (${items.length} filtered)`}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowForm(!showForm)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
          >
            {showForm ? "Cancel" : "+ Add Investor"}
          </button>
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

          <div className="relative">
            <input
              className="h-10 w-64 rounded-xl border border-slate-200 bg-white pl-3 pr-9 text-sm text-slate-800 shadow-sm outline-none placeholder:text-slate-400 hover:bg-slate-50 focus:border-slate-400"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name / sectors / stages…"
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

      {/* Sector and Stage Filters */}
      {(availableSectors.length > 0 || availableStages.length > 0) && (
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Sectors Filter */}
            {availableSectors.length > 0 && (
              <div>
                <div className="mb-2 text-xs font-extrabold uppercase tracking-wide text-slate-500">
                  Filter by Sectors
                </div>
                <div className="flex flex-wrap gap-2">
                  {availableSectors.map((sector) => {
                    const isSelected = selectedSectors.includes(sector);
                    return (
                      <button
                        key={sector}
                        type="button"
                        onClick={() => {
                          setSelectedSectors((prev) =>
                            isSelected
                              ? prev.filter((s) => s !== sector)
                              : [...prev, sector]
                          );
                        }}
                        className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                          isSelected
                            ? "border-slate-900 bg-slate-900 text-white"
                            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {sector}
                      </button>
                    );
                  })}
                  {selectedSectors.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setSelectedSectors([])}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Clear all
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Stages Filter */}
            {availableStages.length > 0 && (
              <div>
                <div className="mb-2 text-xs font-extrabold uppercase tracking-wide text-slate-500">
                  Filter by Stages
                </div>
                <div className="flex flex-wrap gap-2">
                  {availableStages.map((stage) => {
                    const isSelected = selectedStages.includes(stage);
                    return (
                      <button
                        key={stage}
                        type="button"
                        onClick={() => {
                          setSelectedStages((prev) =>
                            isSelected
                              ? prev.filter((s) => s !== stage)
                              : [...prev, stage]
                          );
                        }}
                        className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                          isSelected
                            ? "border-slate-900 bg-slate-900 text-white"
                            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {stage}
                      </button>
                    );
                  })}
                  {selectedStages.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setSelectedStages([])}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Clear all
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
          {(selectedSectors.length > 0 || selectedStages.length > 0) && (
            <div className="mt-3 text-xs text-slate-500">
              Showing {items.length} of {allItems.length} investors
            </div>
          )}
        </div>
      )}

      {/* Add Form */}
      {showForm ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-extrabold text-slate-900">
            Add New Investor
          </h2>
          <InvestorForm
            countries={countries}
            onSuccess={(created) => {
              setShowForm(false);
              load(); // Reload the list
            }}
            onCancel={() => setShowForm(false)}
          />
        </div>
      ) : null}

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
      ) : items.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center">
          <div className="text-sm font-semibold text-slate-700">
            No investors found
          </div>
          <div className="mt-2 text-xs text-slate-500">
            {selectedSectors.length > 0 ||
            selectedStages.length > 0 ||
            countryId ||
            investorType ||
            q.trim()
              ? "Try adjusting your filters"
              : "Seed data should load automatically. If empty, check that the backend has seeded investors."}
          </div>
          {(selectedSectors.length > 0 || selectedStages.length > 0) && (
            <button
              onClick={() => {
                setSelectedSectors([]);
                setSelectedStages([]);
              }}
              className="mt-4 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
            >
              Clear filters
            </button>
          )}
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
