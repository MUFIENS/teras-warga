export default function PesanLoading() {
  return (
    <div className="flex flex-col min-h-screen border-r border-gray-200 dark:border-neutral-800 animate-pulse">
      {/* Sticky Header */}
      <header className="sticky top-14 md:top-0 z-10 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-neutral-800">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="h-6 w-16 bg-gray-200 dark:bg-neutral-800 rounded-lg" />
          <div className="h-9 w-9 bg-gray-200 dark:bg-neutral-800 rounded-full" />
        </div>
      </header>

      {/* Conversations List Skeleton */}
      <div className="flex flex-col divide-y divide-gray-150 dark:divide-neutral-850">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="p-4 flex items-center gap-3">
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-neutral-800 flex-shrink-0" />
            
            {/* Content */}
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-center justify-between">
                {/* Full name */}
                <div className="h-4 w-28 bg-gray-200 dark:bg-neutral-800 rounded" />
                {/* Timestamp */}
                <div className="h-3 w-10 bg-gray-100 dark:bg-neutral-850 rounded" />
              </div>
              
              <div className="flex items-center justify-between">
                {/* Last message snippet */}
                <div className="h-3.5 w-7/12 bg-gray-150 dark:bg-neutral-850 rounded" />
                {/* Unread badge if any */}
                {i < 2 && (
                  <div className="h-4.5 w-4.5 rounded-full bg-[#1D9BF0]/50" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
