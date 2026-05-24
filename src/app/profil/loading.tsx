export default function ProfilLoading() {
  return (
    <div className="flex flex-col min-h-screen border-r border-gray-200 dark:border-neutral-800 animate-pulse">
      {/* Sticky Header */}
      <header className="sticky top-14 md:top-0 z-10 flex items-center px-4 h-14 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-neutral-800">
        <div className="h-6 w-32 bg-gray-200 dark:bg-neutral-800 rounded-lg" />
      </header>

      {/* Banner & Avatar Container */}
      <div className="relative">
        {/* Banner */}
        <div className="h-44 sm:h-52 w-full bg-gray-200 dark:bg-neutral-800" />
        
        {/* Avatar */}
        <div className="absolute -bottom-16 left-4">
          <div className="h-28 w-28 sm:h-32 sm:w-32 rounded-full bg-gray-300 dark:bg-neutral-700 border-4 border-white dark:border-black shadow-md" />
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="flex justify-end p-4 h-16">
        <div className="h-10 w-28 bg-gray-200 dark:bg-neutral-800 rounded-full" />
      </div>

      {/* Profile Details */}
      <div className="px-4 mt-2 space-y-4">
        <div className="space-y-1.5">
          {/* Full Name */}
          <div className="h-6 w-48 bg-gray-200 dark:bg-neutral-800 rounded-lg" />
          {/* Username */}
          <div className="h-4 w-32 bg-gray-200 dark:bg-neutral-800 rounded" />
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <div className="h-4 w-11/12 bg-gray-100 dark:bg-neutral-800 rounded" />
          <div className="h-4 w-3/4 bg-gray-100 dark:bg-neutral-800 rounded" />
        </div>

        {/* Joined & Location */}
        <div className="flex gap-4 pt-1">
          <div className="h-4 w-36 bg-gray-100 dark:bg-neutral-800 rounded" />
          <div className="h-4 w-24 bg-gray-100 dark:bg-neutral-800 rounded" />
        </div>

        {/* Following/Followers Stats */}
        <div className="flex gap-4 pt-2">
          <div className="h-5 w-20 bg-gray-200 dark:bg-neutral-800 rounded" />
          <div className="h-5 w-24 bg-gray-200 dark:bg-neutral-800 rounded" />
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="mt-6 border-b border-gray-200 dark:border-neutral-800 flex">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex-1 flex justify-center py-3.5">
            <div className="h-5 w-20 bg-gray-200 dark:bg-neutral-800 rounded" />
          </div>
        ))}
      </div>

      {/* Profile Feed Loading Items */}
      <div className="flex flex-col divide-y divide-gray-200 dark:divide-neutral-800">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="p-4 flex gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-neutral-800 flex-shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-4 w-24 bg-gray-250 dark:bg-neutral-800 rounded" />
                <div className="h-3.5 w-16 bg-gray-100 dark:bg-neutral-800 rounded" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-100 dark:bg-neutral-800 rounded" />
                <div className="h-4 w-5/6 bg-gray-100 dark:bg-neutral-800 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
