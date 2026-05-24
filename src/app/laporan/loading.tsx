export default function LaporanLoading() {
  return (
    <div className="flex flex-col min-h-screen border-r border-gray-200 dark:border-neutral-800 animate-pulse">
      {/* Header skeleton */}
      <header className="sticky top-14 md:top-0 z-10 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-neutral-800">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2">
            <div className="h-6 w-32 bg-gray-200 dark:bg-neutral-800 rounded-lg" />
            <div className="h-5 w-8 bg-gray-200 dark:bg-neutral-800 rounded-full" />
          </div>
          <div className="h-9 w-20 bg-gray-200 dark:bg-neutral-800 rounded-full" />
        </div>
        {/* Search skeleton */}
        <div className="px-4 pb-3">
          <div className="h-10 bg-gray-100 dark:bg-neutral-800/50 rounded-full" />
        </div>
        {/* Category chips skeleton */}
        <div className="px-4 pb-3 flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-8 w-24 bg-gray-100 dark:bg-neutral-800 rounded-full flex-shrink-0" />
          ))}
        </div>
      </header>

      {/* Stats skeleton */}
      <div className="grid grid-cols-3 gap-3 p-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-24 bg-gray-100 dark:bg-neutral-800/50 rounded-2xl" />
        ))}
      </div>

      {/* Report cards skeleton */}
      <div className="px-4 pb-6 space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 overflow-hidden">
            <div className="h-40 bg-gray-100 dark:bg-neutral-800" />
            <div className="p-4 space-y-3">
              <div className="flex gap-2">
                <div className="h-5 w-20 bg-gray-100 dark:bg-neutral-800 rounded-full" />
                <div className="h-5 w-16 bg-gray-100 dark:bg-neutral-800 rounded-full" />
              </div>
              <div className="h-5 w-3/4 bg-gray-200 dark:bg-neutral-800 rounded-lg" />
              <div className="h-4 w-full bg-gray-100 dark:bg-neutral-800 rounded-lg" />
              <div className="h-4 w-2/3 bg-gray-100 dark:bg-neutral-800 rounded-lg" />
              <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gray-200 dark:bg-neutral-700 rounded-full" />
                  <div className="h-3 w-20 bg-gray-100 dark:bg-neutral-800 rounded" />
                </div>
                <div className="h-3 w-16 bg-gray-100 dark:bg-neutral-800 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
