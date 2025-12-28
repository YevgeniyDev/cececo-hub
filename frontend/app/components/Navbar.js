"use client";

import { useState } from "react";
import NavLink from "./NavLink";

const links = [
  { href: "/news", label: "News" },
  { href: "/countries", label: "Countries" },
  { href: "/projects", label: "Projects" },
  { href: "/startups", label: "Startups" },
  { href: "/investors", label: "Investors" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  function close() {
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <a
            href="/"
            className="flex items-center gap-2 rounded-xl px-2 py-1 hover:bg-slate-100"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-sm font-extrabold text-white">
              C
            </div>
            <div className="leading-tight">
              <div className="text-sm font-extrabold text-slate-900">
                CECECO Hub
              </div>
              <div className="text-[11px] font-medium text-slate-500">
                Clean energy intelligence
              </div>
            </div>
          </a>
        </div>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 sm:flex">
          {links.map((l) => (
            <NavLink
              key={l.href}
              href={l.href}
              className="rounded-full px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              activeClassName="bg-slate-900 text-white hover:bg-slate-900"
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* Right actions (desktop) */}
        <div className="hidden items-center gap-2 sm:flex">
          <a
            href="/countries"
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
          >
            Explore →
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 sm:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="border-t border-slate-200 bg-white shadow-lg sm:hidden">
          <div className="space-y-1 p-3">
            {links.map((l) => (
              <NavLink
                key={l.href}
                href={l.href}
                onClick={close}
                className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                activeClassName="bg-slate-900 text-white hover:bg-slate-900"
              >
                {l.label}
              </NavLink>
            ))}

            <div className="pt-2">
              <a
                href="/countries"
                onClick={close}
                className="flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
              >
                Explore Countries →
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
