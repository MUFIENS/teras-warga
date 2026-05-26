export default function ProfilLoading() {
  return (
    <div className="flex flex-col min-h-screen w-full animate-pulse bg-white dark:bg-black">
      {/* Cover */}
      <div 
        data-testid="profile-cover-skeleton"
        className="relative h-40 md:h-52 bg-gray-200 dark:bg-neutral-900 w-full" 
      />

      {/* Profile Header */}
      <div className="border-b border-gray-100 dark:border-neutral-800">
        <div className="max-w-3xl mx-auto w-full px-4 md:px-6">
          <div className="flex items-end justify-between -mt-12 md:-mt-16 mb-4">
            {/* Avatar */}
            <div data-testid="profile-avatar-skeleton" className="relative">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white dark:border-black bg-gray-300 dark:bg-neutral-800" />
            </div>

            {/* Actions */}
            <div data-testid="profile-actions-skeleton" className="flex items-center gap-2 pb-2">
              <div className="h-9 w-28 rounded-full bg-gray-200 dark:bg-neutral-800" />
            </div>
          </div>

          {/* Name + badges (Info) */}
          <div data-testid="profile-info-skeleton" className="mb-4 space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-48 bg-gray-200 dark:bg-neutral-800 rounded-lg" />
              <div className="h-5 w-16 bg-gray-200 dark:bg-neutral-800 rounded-full" />
            </div>
            <div className="h-4 w-32 bg-gray-200 dark:bg-neutral-800 rounded-md" />
            
            <div className="space-y-2 mt-4">
              <div className="h-4 w-full max-w-md bg-gray-100 dark:bg-neutral-800 rounded-md" />
              <div className="h-4 w-3/4 max-w-sm bg-gray-100 dark:bg-neutral-800 rounded-md" />
            </div>
            
            <div className="flex items-center gap-2 mt-4">
              <div className="h-4 w-4 bg-gray-200 dark:bg-neutral-800 rounded-full" />
              <div className="h-4 w-40 bg-gray-100 dark:bg-neutral-800 rounded-md" />
            </div>
          </div>

          {/* Stats */}
          <div data-testid="profile-stats-skeleton" className="flex gap-6 mb-4">
            <div className="flex items-center gap-2">
              <div className="h-5 w-6 bg-gray-200 dark:bg-neutral-800 rounded-md" />
              <div className="h-5 w-16 bg-gray-100 dark:bg-neutral-800 rounded-md" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-5 w-6 bg-gray-200 dark:bg-neutral-800 rounded-md" />
              <div className="h-5 w-16 bg-gray-100 dark:bg-neutral-800 rounded-md" />
            </div>
          </div>

          {/* Tabs */}
          <div data-testid="profile-tabs-skeleton" className="flex overflow-hidden -mx-2 px-2 mt-2 gap-4">
             <div className="h-12 w-28 bg-gray-200 dark:bg-neutral-800 rounded-t-lg" />
             <div className="h-12 w-28 bg-gray-100 dark:bg-neutral-900 rounded-t-lg" />
             <div className="h-12 w-32 bg-gray-100 dark:bg-neutral-900 rounded-t-lg" />
          </div>
        </div>
      </div>

      {/* Tab Content (Feed) */}
      <div data-testid="profile-feed-skeleton" className="flex-1 px-4 md:px-6 py-4 max-w-3xl mx-auto w-full">
         <div className="space-y-0 border-x border-t border-gray-100 dark:border-neutral-800 rounded-2xl overflow-hidden">
            {/* Mock Post Card */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3 p-4 border-b border-gray-100 dark:border-neutral-800">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-neutral-800" />
                </div>
                <div className="flex-1 min-w-0 space-y-3 mt-1">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-32 bg-gray-200 dark:bg-neutral-800 rounded-md" />
                    <div className="h-3 w-16 bg-gray-100 dark:bg-neutral-800 rounded-md" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-gray-100 dark:bg-neutral-800 rounded-md" />
                    <div className="h-4 w-5/6 bg-gray-100 dark:bg-neutral-800 rounded-md" />
                  </div>
                  <div className="h-40 w-full bg-gray-200 dark:bg-neutral-800 rounded-2xl mt-3" />
                </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
}
