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
    <div className="relative flex items-center gap-2">
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

      {/* Mobile menu button */}
      <button
        className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 sm:hidden"
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle menu"
        aria-expanded={open}
      >
        {open ? "Close" : "Menu"}
      </button>

      {/* Mobile dropdown */}
      {open && (
        <div className="absolute right-0 top-12 w-60 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg sm:hidden">
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
          </div>
        </div>
      )}
    </div>
  );
}
