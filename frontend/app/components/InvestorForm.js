"use client";

import { useState } from "react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ||
  process.env.API_INTERNAL_BASE ||
  "https://cececo-hub.onrender.com" ||
  "https://cececo-hub.vercel.app";

export default function InvestorForm({ countries = [], onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    investor_type: "",
    focus_sectors: "",
    stages: "",
    ticket_min: "",
    ticket_max: "",
    website: "",
    contact_email: "",
    country_ids: [],
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = e.target.checked;
      const countryId = parseInt(value);
      setFormData((prev) => ({
        ...prev,
        country_ids: checked
          ? [...prev.country_ids, countryId]
          : prev.country_ids.filter((id) => id !== countryId),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      const payload = {
        name: formData.name.trim(),
        investor_type: formData.investor_type,
        focus_sectors: formData.focus_sectors.trim() || null,
        stages: formData.stages.trim() || null,
        ticket_min: formData.ticket_min ? parseInt(formData.ticket_min) : null,
        ticket_max: formData.ticket_max ? parseInt(formData.ticket_max) : null,
        website: formData.website.trim() || null,
        contact_email: formData.contact_email.trim() || null,
        country_ids: formData.country_ids,
      };

      const res = await fetch(`${API_BASE}/api/v1/investors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to create investor: ${res.status}`);
      }

      const created = await res.json();
      setSuccess(true);
      setFormData({
        name: "",
        investor_type: "",
        focus_sectors: "",
        stages: "",
        ticket_min: "",
        ticket_max: "",
        website: "",
        contact_email: "",
        country_ids: [],
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
      setError(e?.message || "Failed to create investor");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-900">
        <div className="font-bold">Success!</div>
        <div className="mt-2 text-sm">Investor has been added successfully.</div>
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
          Name <span className="text-rose-600">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          maxLength={200}
          placeholder="Investor name"
          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none placeholder:text-slate-400 hover:bg-slate-50 focus:border-slate-400"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-900">
          Investor Type <span className="text-rose-600">*</span>
        </label>
        <select
          name="investor_type"
          value={formData.investor_type}
          onChange={handleChange}
          required
          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none hover:bg-slate-50 focus:border-slate-400"
        >
          <option value="">Select type</option>
          <option value="fund">Fund</option>
          <option value="angel">Angel</option>
          <option value="corporate">Corporate</option>
          <option value="public">Public</option>
          <option value="ngo">NGO</option>
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-semibold text-slate-900">Focus Sectors</label>
          <input
            type="text"
            name="focus_sectors"
            value={formData.focus_sectors}
            onChange={handleChange}
            placeholder="Solar,Wind,Grid (comma-separated)"
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none placeholder:text-slate-400 hover:bg-slate-50 focus:border-slate-400"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900">Stages</label>
          <input
            type="text"
            name="stages"
            value={formData.stages}
            onChange={handleChange}
            placeholder="seed,seriesA (comma-separated)"
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none placeholder:text-slate-400 hover:bg-slate-50 focus:border-slate-400"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-semibold text-slate-900">Ticket Min ($)</label>
          <input
            type="number"
            name="ticket_min"
            value={formData.ticket_min}
            onChange={handleChange}
            min="0"
            placeholder="25000"
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none placeholder:text-slate-400 hover:bg-slate-50 focus:border-slate-400"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900">Ticket Max ($)</label>
          <input
            type="number"
            name="ticket_max"
            value={formData.ticket_max}
            onChange={handleChange}
            min="0"
            placeholder="2000000"
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none placeholder:text-slate-400 hover:bg-slate-50 focus:border-slate-400"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
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

        <div>
          <label className="block text-sm font-semibold text-slate-900">Contact Email</label>
          <input
            type="email"
            name="contact_email"
            value={formData.contact_email}
            onChange={handleChange}
            placeholder="contact@example.com"
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none placeholder:text-slate-400 hover:bg-slate-50 focus:border-slate-400"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-900">Countries</label>
        <div className="mt-2 max-h-48 space-y-2 overflow-y-auto rounded-xl border border-slate-200 bg-white p-3">
          {countries.map((c) => (
            <label
              key={c.id}
              className="flex items-center gap-2 text-sm text-slate-700 hover:text-slate-900"
            >
              <input
                type="checkbox"
                value={c.id}
                checked={formData.country_ids.includes(c.id)}
                onChange={handleChange}
                className="h-4 w-4 accent-slate-900"
              />
              {c.name} ({c.iso2})
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Add Investor"}
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

