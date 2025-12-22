import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata = { title: "CECECO Hub MVP" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
        {/* Topbar */}
        <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/70 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-extrabold tracking-tight sm:text-base">
                CECECO Hub
              </span>
              <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-500">
                MVP
              </span>
            </div>

            <Navbar />
          </div>
        </header>

        {/* Page */}
        <main className="mx-auto w-full max-w-6xl px-4 py-8">{children}</main>

        {/* Footer */}
        <footer className="mt-10 border-t border-slate-200/70 bg-white">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-5 text-sm text-slate-500">
            <span>
              CECECO Hub MVP • Built for CECECO Clean Energy Hackathon
            </span>
            <a
              className="font-medium text-slate-700 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-500"
              href="http://localhost:8000/docs"
              target="_blank"
              rel="noreferrer"
            >
              API Docs
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
