import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata = { title: "CECECO Hub MVP" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
        {/* Topbar */}
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
          <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
            {/* Brand (LEFT) */}
            <a href="/" className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-sm font-extrabold text-white">
                C
              </span>

              <div className="leading-tight">
                <div className="text-sm font-extrabold text-slate-900">
                  CECECO Hub
                </div>
                <div className="text-xs font-semibold text-slate-500">
                  Clean energy intelligence
                </div>
              </div>

              <span className="ml-2 rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-bold text-slate-600">
                MVP
              </span>
            </a>

            {/* Nav (RIGHT) */}
            <div className="ml-auto">
              <Navbar />
            </div>
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
