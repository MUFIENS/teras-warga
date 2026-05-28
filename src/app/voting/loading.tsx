export default function VotingLoading() {
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 w-full animate-pulse">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-neutral-800 pb-6">
        <div>
          <div className="h-8 w-64 bg-gray-200 dark:bg-neutral-800 rounded-lg mb-2" />
          <div className="h-4 w-48 bg-gray-100 dark:bg-neutral-800 rounded" />
        </div>
        <div className="h-10 w-36 bg-gray-200 dark:bg-neutral-800 rounded-full" />
      </header>

      <div className="grid gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-[#050505] border border-gray-200 dark:border-white/5 rounded-2xl p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="space-y-2 w-full">
                <div className="h-6 w-3/4 bg-gray-200 dark:bg-neutral-800 rounded" />
                <div className="h-4 w-full bg-gray-100 dark:bg-neutral-800 rounded" />
                <div className="h-4 w-5/6 bg-gray-100 dark:bg-neutral-800 rounded" />
              </div>
              <div className="shrink-0 ml-4">
                <div className="h-6 w-16 bg-gray-100 dark:bg-neutral-800 rounded-full" />
              </div>
            </div>

            <div className="space-y-3 mt-6">
              {Array.from({ length: 2 }).map((_, j) => (
                <div key={j} className="h-14 w-full bg-gray-100 dark:bg-neutral-800 rounded-xl" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
