export default function PasarLoading() {
  return (
    <div className="flex flex-col min-h-screen border-r border-gray-200 dark:border-neutral-800 animate-pulse">
      {/* Sticky Header */}
      <header className="sticky top-14 md:top-0 z-10 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-neutral-800">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2">
            <div className="h-6 w-32 bg-gray-200 dark:bg-neutral-800 rounded-lg" />
            <div className="h-5 w-16 bg-gray-200 dark:bg-neutral-800 rounded-full" />
          </div>
          <div className="h-9 w-20 bg-gray-200 dark:bg-neutral-800 rounded-full" />
        </div>

        {/* Search Bar Skeleton */}
        <div className="px-4 pb-3">
          <div className="h-10 w-full bg-gray-100 dark:bg-neutral-850 rounded-full" />
        </div>

        {/* Category Chips Skeleton */}
        <div className="px-4 pb-3 flex gap-2 overflow-x-auto no-scrollbar">
          {Array.from({ length: 6 }).map((_, i) => (
            <div 
              key={i} 
              className="h-8 w-20 bg-gray-100 dark:bg-neutral-800 rounded-full flex-shrink-0"
              style={{ width: i % 2 === 0 ? "80px" : "100px" }}
            />
          ))}
        </div>
      </header>

      {/* Product Grid Skeleton */}
      <div className="p-4 flex-1">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div 
              key={i} 
              className="bg-white dark:bg-neutral-900 rounded-3xl border border-gray-200 dark:border-neutral-800 overflow-hidden flex flex-col h-full"
            >
              {/* Product Image */}
              <div className="aspect-square w-full bg-gray-200 dark:bg-neutral-800" />
              
              {/* Content */}
              <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  {/* Category chip & time */}
                  <div className="flex items-center justify-between">
                    <div className="h-5 w-16 bg-gray-100 dark:bg-neutral-800 rounded-full" />
                    <div className="h-3.5 w-12 bg-gray-100 dark:bg-neutral-850 rounded" />
                  </div>
                  
                  {/* Title */}
                  <div className="h-5 w-11/12 bg-gray-200 dark:bg-neutral-800 rounded" />
                  <div className="h-5 w-2/3 bg-gray-200 dark:bg-neutral-800 rounded" />
                </div>

                <div className="space-y-2.5 pt-2 border-t border-gray-100 dark:border-neutral-800">
                  {/* Price */}
                  <div className="h-6 w-24 bg-gray-200 dark:bg-neutral-800 rounded" />
                  
                  {/* Seller Info */}
                  <div className="flex items-center gap-2 pt-1">
                    <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-neutral-800 flex-shrink-0" />
                    <div className="h-3.5 w-16 bg-gray-150 dark:bg-neutral-850 rounded" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
