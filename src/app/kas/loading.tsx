export default function KasLoading() {
  return (
    <div className="flex flex-col min-h-screen border-r border-gray-200 dark:border-neutral-800 animate-pulse">
      {/* Header */}
      <header className="sticky top-14 md:top-0 z-10 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-neutral-800">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="h-6 w-24 bg-gray-200 dark:bg-neutral-800 rounded-lg" />
          <div className="h-6 w-24 bg-gray-200 dark:bg-neutral-800 rounded-full" />
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3 p-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-gray-100 dark:bg-neutral-900 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-neutral-800 h-[100px]" />
        ))}
      </div>

      {/* Year Selector */}
      <div className="flex items-center justify-center gap-4 px-4 py-3">
        <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-neutral-800" />
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-gray-200 dark:bg-neutral-800 rounded-md" />
          <div className="w-16 h-6 bg-gray-200 dark:bg-neutral-800 rounded-md" />
        </div>
        <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-neutral-800" />
      </div>

      {/* Monthly Grid */}
      <div className="grid grid-cols-3 gap-3 px-4 pb-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="rounded-2xl border-2 border-gray-100 dark:border-neutral-800 p-4 h-[76px] bg-gray-50 dark:bg-neutral-900/50 flex flex-col justify-between">
             <div className="w-16 h-4 bg-gray-200 dark:bg-neutral-800 rounded-md" />
             <div className="w-20 h-4 bg-gray-200 dark:bg-neutral-800 rounded-md mt-2" />
          </div>
        ))}
      </div>

      {/* Recent Transactions */}
      <div className="px-4 pb-6">
        <div className="w-32 h-4 bg-gray-200 dark:bg-neutral-800 rounded-md mb-3 ml-1" />
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-3.5 rounded-xl bg-gray-50 dark:bg-neutral-900/50 border border-gray-100 dark:border-neutral-800">
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-neutral-800 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="w-24 h-4 bg-gray-200 dark:bg-neutral-800 rounded-md" />
                <div className="w-16 h-3 bg-gray-200 dark:bg-neutral-800 rounded-md" />
              </div>
              <div className="flex flex-col items-end space-y-2 flex-shrink-0">
                <div className="w-20 h-4 bg-gray-200 dark:bg-neutral-800 rounded-md" />
                <div className="w-12 h-3 bg-gray-200 dark:bg-neutral-800 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
