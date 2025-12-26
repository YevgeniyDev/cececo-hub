export default function NewsLoading() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm animate-pulse"
        >
          {/* Image skeleton */}
          <div className="h-48 w-full bg-slate-200"></div>
          
          {/* Content skeleton */}
          <div className="flex flex-1 flex-col p-5">
            <div className="mb-2 h-5 w-20 rounded-full bg-slate-200"></div>
            <div className="mb-2 space-y-2">
              <div className="h-5 bg-slate-200 rounded w-full"></div>
              <div className="h-5 bg-slate-200 rounded w-4/5"></div>
            </div>
            <div className="mb-4 space-y-2">
              <div className="h-3 bg-slate-200 rounded w-full"></div>
              <div className="h-3 bg-slate-200 rounded w-5/6"></div>
              <div className="h-3 bg-slate-200 rounded w-4/6"></div>
            </div>
            <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3">
              <div className="h-3 bg-slate-200 rounded w-24"></div>
              <div className="h-3 bg-slate-200 rounded w-16"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

