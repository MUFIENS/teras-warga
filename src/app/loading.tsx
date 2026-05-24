export default function HomeLoading() {
  return (
    <div className="flex flex-col min-h-screen border-r border-gray-200 dark:border-neutral-800 animate-pulse">
      {/* Sticky Header */}
      <header className="sticky top-14 md:top-0 z-10 flex items-center px-4 h-14 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-neutral-800">
        <div className="h-6 w-24 bg-gray-200 dark:bg-neutral-800 rounded-lg" />
      </header>

      {/* Compose Area Skeleton */}
      <div className="px-4 py-4 border-b border-gray-200 dark:border-neutral-800 flex gap-3">
        <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-neutral-800 flex-shrink-0" />
        <div className="flex-1 space-y-3 pt-1">
          <div className="h-16 w-full bg-gray-100 dark:bg-neutral-800/50 rounded-xl" />
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-neutral-800/50" />
              <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-neutral-800/50" />
            </div>
            <div className="h-9 w-20 bg-gray-200 dark:bg-neutral-800 rounded-full" />
          </div>
        </div>
      </div>

      {/* Feed Skeleton */}
      <div className="flex flex-col divide-y divide-gray-200 dark:divide-neutral-800">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="p-4 flex gap-3">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-neutral-800 flex-shrink-0" />
            
            {/* Post Content */}
            <div className="flex-1 space-y-3">
              {/* User Info Header */}
              <div className="flex items-center gap-2">
                <div className="h-4 w-28 bg-gray-200 dark:bg-neutral-800 rounded" />
                <div className="h-3 w-16 bg-gray-100 dark:bg-neutral-800/50 rounded" />
                <div className="h-3 w-12 bg-gray-100 dark:bg-neutral-800/50 rounded ml-auto" />
              </div>
              
              {/* Post Text */}
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-150 dark:bg-neutral-800/50 rounded" />
                <div className="h-4 w-5/6 bg-gray-150 dark:bg-neutral-800/50 rounded" />
                {i % 2 === 0 && <div className="h-4 w-2/3 bg-gray-150 dark:bg-neutral-800/50 rounded" />}
              </div>

              {/* Optional Post Image */}
              {i % 3 === 0 && (
                <div className="h-48 w-full bg-gray-100 dark:bg-neutral-800/30 rounded-2xl border border-gray-200 dark:border-neutral-850" />
              )}
              
              {/* Interaction Buttons */}
              <div className="flex justify-between max-w-md pt-2">
                <div className="h-4 w-12 bg-gray-100 dark:bg-neutral-850 rounded" />
                <div className="h-4 w-12 bg-gray-100 dark:bg-neutral-850 rounded" />
                <div className="h-4 w-12 bg-gray-100 dark:bg-neutral-850 rounded" />
                <div className="h-4 w-8 bg-gray-100 dark:bg-neutral-850 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
