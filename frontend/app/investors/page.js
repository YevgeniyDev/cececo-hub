import { Suspense } from "react";
import InvestorsClient from "../components/InvestorsClient";

export default function InvestorsPage() {
  return (
    <Suspense
      fallback={
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-sm text-slate-600">Loading projects…</div>
        </div>
      }
    >
      <InvestorsClient
        title="Investors"
        subtitle="Directory of investors and funding programs in the CECECO clean-energy ecosystem."
      />
    </Suspense>
  );
}
