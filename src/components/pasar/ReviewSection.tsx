"use client";

import { Star, MessageSquare } from "lucide-react";
import { MarketReview } from "@/types/marketplace";

interface ReviewSectionProps {
  reviews: MarketReview[];
}

function RatingBar({ stars, count, total }: { stars: number; count: number; total: number }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-xs font-semibold text-gray-500 dark:text-neutral-400 w-3 text-right">
        {stars}
      </span>
      <Star className="w-3 h-3 text-amber-400 fill-amber-400 flex-shrink-0" />
      <div className="flex-1 h-2 bg-gray-100 dark:bg-neutral-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-amber-400 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-gray-400 dark:text-neutral-500 w-5 text-right tabular-nums">
        {count}
      </span>
    </div>
  );
}

export function ReviewSection({ reviews }: ReviewSectionProps) {
  const total = reviews.length;
  const avg =
    total > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / total
      : 0;

  // Count per star level
  const dist = [5, 4, 3, 2, 1].map((s) => ({
    stars: s,
    count: reviews.filter((r) => r.rating === s).length,
  }));

  return (
    <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 dark:border-neutral-800">
        <p className="text-[11px] font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-widest">
          Ulasan Pembeli ({total})
        </p>
      </div>

      <div className="p-5">
        {total > 0 ? (
          <div className="space-y-6">
            {/* Summary */}
            <div className="flex items-start gap-6">
              {/* Big Score */}
              <div className="flex flex-col items-center flex-shrink-0">
                <span className="text-4xl font-black text-gray-900 dark:text-white leading-none">
                  {avg.toFixed(1)}
                </span>
                <div className="flex items-center gap-0.5 mt-1.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.round(avg)
                          ? "text-amber-400 fill-amber-400"
                          : "text-gray-200 dark:text-neutral-700 fill-gray-200 dark:fill-neutral-700"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-400 dark:text-neutral-500 mt-1">
                  {total} ulasan
                </span>
              </div>

              {/* Distribution Bars */}
              <div className="flex-1 space-y-1.5">
                {dist.map((d) => (
                  <RatingBar key={d.stars} stars={d.stars} count={d.count} total={total} />
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 dark:border-neutral-800" />

            {/* Individual Reviews */}
            <div className="space-y-4">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="flex gap-3"
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {rev.reviewer?.avatar_url ? (
                      <img
                        src={rev.reviewer.avatar_url}
                        alt={rev.reviewer.full_name}
                        className="w-9 h-9 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center text-xs font-bold text-gray-500">
                        {rev.reviewer?.full_name?.charAt(0) || "U"}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <span className="text-sm font-semibold">
                          {rev.reviewer?.full_name}
                        </span>
                        <span className="inline-flex items-center gap-0.5 ml-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                          Terverifikasi
                        </span>
                        <div className="flex items-center gap-0.5 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < rev.rating
                                  ? "text-amber-400 fill-amber-400"
                                  : "text-gray-200 dark:text-neutral-700 fill-gray-200 dark:fill-neutral-700"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-[11px] text-gray-400 dark:text-neutral-500 flex-shrink-0">
                        {new Date(rev.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    {rev.comment && (
                      <p className="text-sm text-gray-600 dark:text-neutral-400 mt-2 leading-relaxed">
                        {rev.comment}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center mb-3">
              <MessageSquare className="w-5 h-5 text-gray-300 dark:text-neutral-600" />
            </div>
            <p className="font-semibold text-gray-500 dark:text-neutral-400 text-sm">
              Belum ada ulasan
            </p>
            <p className="text-xs text-gray-400 dark:text-neutral-500 mt-1">
              Jadilah pembeli pertama untuk memberikan ulasan.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
