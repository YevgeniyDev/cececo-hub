"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { ECO_COUNTRIES } from "../data/ecoCountries";

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

export default function PlanetGlobe({ accent = "#22c55e" }) {
  const globeRef = useRef(null);
  const [active, setActive] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // detect mobile once
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // minimal “points” styling
  const points = useMemo(
    () =>
      ECO_COUNTRIES.map((c) => ({
        ...c,
        size: 0.55,
        color: accent,
      })),
    [accent]
  );

  useEffect(() => {
    if (!globeRef.current) return;

    const controls = globeRef.current.controls();
    controls.enablePan = false; // keep it clean
    controls.minDistance = 160;
    controls.maxDistance = 260;

    // rotate only on desktop
    controls.autoRotate = !isMobile;
    controls.autoRotateSpeed = 0.35;
  }, [isMobile]);

  const focusOn = (p) => {
    setActive(p);

    // Smooth camera move to point
    if (globeRef.current) {
      const altitude = isMobile ? 1.9 : 1.6;
      globeRef.current.pointOfView({ lat: p.lat, lng: p.lng, altitude }, 900);
    }
  };

  return (
    <div className="relative w-full">
      <div className="relative h-[320px] w-full md:h-[460px]">
        <Globe
          ref={globeRef}
          backgroundColor="rgba(0,0,0,0)"
          // Pick one texture. This one is minimal & readable.
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
          // ECO markers
          pointsData={points}
          pointLat="lat"
          pointLng="lng"
          pointRadius={(d) => d.size}
          pointColor={(d) => d.color}
          pointAltitude={() => 0.02}
          // Tooltip (minimal)
          pointLabel={(d) => `
            <div style="font-size:12px;padding:6px 8px;border-radius:10px;background:rgba(15,23,42,0.9);color:white;">
              <b>${d.name}</b><br/>
              ECO focus
            </div>
          `}
          // Interaction
          onPointClick={focusOn}
          onPointHover={(p) => {
            // On mobile, ignore hover.
            if (isMobile) return;
            if (p) setActive(p);
          }}
        />

        {/* Soft mask / glow overlay (minimalistic planet feel) */}
        <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-tr from-slate-900/10 via-transparent to-emerald-500/10" />
      </div>

      {/* Minimal country card (works on mobile) */}
      <div className="mt-3">
        {active ? (
          <div className="rounded-2xl border border-slate-200 bg-white/70 p-3 shadow-sm backdrop-blur">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-slate-900">
                  {active.name}
                </div>
                <div className="text-xs text-slate-600">
                  ECO region • Tap other markers to switch
                </div>
              </div>

              {/* optional: link to your country page if you have it */}
              {/* <Link href={`/countries/${active.code}`}>View</Link> */}
              <button
                onClick={() => setActive(null)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div className="text-xs text-slate-600">
            Tap a highlighted point to explore ECO countries.
          </div>
        )}
      </div>
    </div>
  );
}
