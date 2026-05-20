import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function LaporanDetailLoading() {
  return (
    <div className="flex flex-col min-h-screen border-r border-gray-200 dark:border-neutral-800 animate-pulse">
      <header className="sticky top-0 z-10 flex items-center gap-4 px-4 h-14 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-neutral-800">
        <Link href="/laporan" className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="h-6 w-24 bg-gray-200 dark:bg-neutral-800 rounded-lg" />
      </header>
      <div className="h-64 bg-gray-100 dark:bg-neutral-800" />
      <div className="p-5 space-y-4">
        <div className="flex gap-2">
          <div className="h-6 w-24 bg-gray-100 dark:bg-neutral-800 rounded-full" />
          <div className="h-6 w-20 bg-gray-100 dark:bg-neutral-800 rounded-full" />
        </div>
        <div className="h-7 w-3/4 bg-gray-200 dark:bg-neutral-800 rounded-lg" />
        <div className="space-y-2">
          <div className="h-4 w-full bg-gray-100 dark:bg-neutral-800 rounded" />
          <div className="h-4 w-full bg-gray-100 dark:bg-neutral-800 rounded" />
          <div className="h-4 w-2/3 bg-gray-100 dark:bg-neutral-800 rounded" />
        </div>
        <div className="h-12 w-32 bg-gray-100 dark:bg-neutral-800 rounded-xl" />
      </div>
      <div className="border-t border-gray-200 dark:border-neutral-800 p-5 space-y-4">
        <div className="h-5 w-24 bg-gray-200 dark:bg-neutral-800 rounded" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-3">
            <div className="w-8 h-8 bg-gray-200 dark:bg-neutral-700 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-1">
              <div className="h-4 w-28 bg-gray-200 dark:bg-neutral-800 rounded" />
              <div className="h-3 w-full bg-gray-100 dark:bg-neutral-800 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
