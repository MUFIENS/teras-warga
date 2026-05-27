"use client";

import { Package, MapPin, Tag, Layers } from "lucide-react";

interface ProductGalleryProps {
  imageUrl: string | null;
  title: string;
  isActive: boolean;
  category: string | null;
  condition: string | null;
  location: string | null;
}

export function ProductGallery({
  imageUrl,
  title,
  isActive,
  category,
  condition,
  location,
}: ProductGalleryProps) {
  return (
    <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl overflow-hidden">
      {/* Hero Image */}
      <div className="relative aspect-[4/3] bg-gray-100 dark:bg-neutral-800 overflow-hidden group cursor-crosshair">
        {imageUrl ? (
          <img src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 ease-out will-change-transform group-hover:scale-110"
            draggable={false}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3">
            <Package className="w-16 h-16 text-gray-300 dark:text-neutral-600" />
            <span className="text-sm text-gray-400 dark:text-neutral-500 font-medium">
              Tidak ada gambar
            </span>
          </div>
        )}

        {/* Sold Overlay */}
        {!isActive && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center">
            <div className="bg-red-500 text-white px-8 py-2.5 rounded-full font-bold text-base tracking-wide shadow-lg shadow-red-500/30 -rotate-6">
              TERJUAL
            </div>
          </div>
        )}
      </div>

      {/* Metadata Pills */}
      <div className="px-5 py-4 flex flex-wrap items-center gap-2">
        {category && (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 px-3 py-1.5 rounded-lg">
            <Layers className="w-3 h-3" />
            {category}
          </span>
        )}
        {condition && (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-gray-100 text-gray-600 dark:bg-neutral-800 dark:text-neutral-400 px-3 py-1.5 rounded-lg">
            <Tag className="w-3 h-3" />
            {condition}
          </span>
        )}
        {location && (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-gray-100 text-gray-600 dark:bg-neutral-800 dark:text-neutral-400 px-3 py-1.5 rounded-lg">
            <MapPin className="w-3 h-3" />
            {location}
          </span>
        )}
      </div>
    </div>
  );
}
