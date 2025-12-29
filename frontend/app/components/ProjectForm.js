"use client";

import { useState } from "react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ||
  process.env.API_INTERNAL_BASE ||
  "https://cececo-hub.onrender.com";

export default function ProjectForm({ kind = "project", countries = [], onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    kind,
    country_id: "",
    title: "",
    summary: "",
    sector: "",
    stage: "",
    website: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      const payload = {
        kind: formData.kind,
        country_id: parseInt(formData.country_id),
        title: formData.title.trim(),
        summary: formData.summary.trim(),
        sector: formData.sector.trim() || null,
        stage: formData.stage.trim() || null,
        website: formData.website.trim() || null,
      };

      const res = await fetch(`${API_BASE}/api/v1/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to create ${kind}: ${res.status}`);
      }

      const created = await res.json();
      setSuccess(true);
      setFormData({
        kind,
        country_id: "",
        title: "",
        summary: "",
        sector: "",
        stage: "",
        website: "",
      });

      if (onSuccess) {
        onSuccess(created);
      }

      // Auto-close after 2 seconds
      setTimeout(() => {
        setSuccess(false);
        if (onCancel) onCancel();
      }, 2000);
    } catch (e) {
      setError(e?.message || `Failed to create ${kind}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-900">
        <div className="font-bold">Success!</div>
        <div className="mt-2 text-sm">Your {kind} has been added successfully.</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-slate-900">
          Country <span className="text-rose-600">*</span>
        </label>
        <select
          name="country_id"
          value={formData.country_id}
          onChange={handleChange}
          required
          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none hover:bg-slate-50 focus:border-slate-400"
        >
          <option value="">Select a country</option>
          {countries.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.iso2})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-900">
          Title <span className="text-rose-600">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          minLength={3}
          maxLength={200}
          placeholder="Enter project/startup name"
          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none placeholder:text-slate-400 hover:bg-slate-50 focus:border-slate-400"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-900">
          Summary <span className="text-rose-600">*</span>
        </label>
        <textarea
          name="summary"
          value={formData.summary}
          onChange={handleChange}
          required
          minLength={10}
          rows={4}
          placeholder="Describe the project/startup (minimum 10 characters)"
          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none placeholder:text-slate-400 hover:bg-slate-50 focus:border-slate-400"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-semibold text-slate-900">Sector</label>
          <input
            type="text"
            name="sector"
            value={formData.sector}
            onChange={handleChange}
            maxLength={60}
            placeholder="e.g., Solar, Wind, Grid"
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none placeholder:text-slate-400 hover:bg-slate-50 focus:border-slate-400"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900">Stage</label>
          <input
            type="text"
            name="stage"
            value={formData.stage}
            onChange={handleChange}
            maxLength={40}
            placeholder="e.g., seed, scaling, operational"
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none placeholder:text-slate-400 hover:bg-slate-50 focus:border-slate-400"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-900">Website</label>
        <input
          type="url"
          name="website"
          value={formData.website}
          onChange={handleChange}
          placeholder="https://example.com"
          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none placeholder:text-slate-400 hover:bg-slate-50 focus:border-slate-400"
        />
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-50"
        >
          {submitting ? "Submitting..." : `Add ${kind}`}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

