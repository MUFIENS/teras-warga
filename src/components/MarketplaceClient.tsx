"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, Plus, SlidersHorizontal, Package, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { MarketItemCard } from "@/components/MarketItemCard";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useInView } from "react-intersection-observer";
import { fetchMoreMarketItems } from "@/app/pasar/actions";
import { Loader2 } from "lucide-react";

const CATEGORIES = ["Semua", "Elektronik", "Pakaian", "Makanan", "Furnitur", "Kendaraan", "Jasa", "Lainnya"];

interface MarketItem {
  id: string;
  title: string;
  description: string | null;
  price_idr: number;
  image_url: string | null;
  category: string;
  condition: string;
  location: string | null;
  is_active: boolean;
  created_at: string;
  user_id: string;
  profiles: {
    full_name: string;
    username: string;
    avatar_url: string | null;
    crypto_wallet: string | null;
  } | null;
  timeAgo: string;
}

interface MarketplaceClientProps {
  items: MarketItem[];
  currentUserId: string | null;
}

export function MarketplaceClient({ items, currentUserId }: MarketplaceClientProps) {
  const router = useRouter();
  const [itemsList, setItemsList] = useState(items || []);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState((items?.length || 0) >= 10);
  const [loading, setLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [showSoldItems, setShowSoldItems] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "400px",
  });

  // Effect to load more items when scrolled to bottom
  useEffect(() => {
    if (inView && hasMore && !loading) {
      loadMoreItems();
    }
  }, [inView, hasMore, loading]);

  const loadMoreItems = async () => {
    setLoading(true);
    try {
      const nextItems = await fetchMoreMarketItems(page);
      if (nextItems && nextItems.length > 0) {
        setItemsList((prev) => {
          const newItems = nextItems.filter(
            (ni) => !prev.some((p) => p.id === ni.id)
          ).map(ni => ({
            ...ni,
            timeAgo: ni.created_at ? formatDistanceToNow(new Date(ni.created_at), { addSuffix: true, locale: localeId }) : "Baru saja",
            price_idr: ni.price_idr || 0,
            category: ni.category || "Lainnya",
            condition: ni.condition || "Bekas",
            is_active: ni.is_active !== false,
          }));
          return [...prev, ...newItems] as MarketItem[];
        });
        setPage((p) => p + 1);
        if (nextItems.length < 10) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to load more items:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = useMemo(() => {
    return itemsList.filter((item) => {
      // Filter pencarian
      const matchesSearch =
        !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter kategori
      const matchesCategory =
        selectedCategory === "Semua" || item.category === selectedCategory;

      // Filter terjual (selalu tampilkan barang sendiri)
      // Jika is_active adalah null, kita anggap true (masih aktif)
      const isActive = item.is_active !== false;
      const matchesSold =
        showSoldItems || isActive || item.user_id === currentUserId;

      return matchesSearch && matchesCategory && matchesSold;
    });
  }, [itemsList, searchQuery, selectedCategory, showSoldItems, currentUserId]);

  const handleEdit = (id: string) => {
    router.push(`/pasar/jual?edit=${id}`);
  };

  const activeCount = itemsList.filter(i => i.is_active !== false).length;

  return (
    <>
      {/* Sticky Header */}
      <header className="sticky top-14 md:top-0 z-10 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-neutral-800">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">Pasar Warga</h1>
            <span className="text-xs bg-[#1D9BF0]/10 text-[#1D9BF0] px-2 py-0.5 rounded-full font-semibold">
              {activeCount} barang
            </span>
          </div>
          <Link
            href="/pasar/jual"
            className="flex items-center gap-1.5 bg-[#1D9BF0] text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#1A8CD8] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Jual
          </Link>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari barang di pasar..."
              className="w-full pl-10 pr-10 py-2.5 rounded-full border border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800/50 focus:outline-none focus:ring-2 focus:ring-[#1D9BF0] focus:border-transparent focus:bg-white dark:focus:bg-neutral-800 transition-all text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>
        </div>

        {/* Category Filter */}
        <div className="px-4 pb-3 flex items-center gap-2">
          <div className="flex-1 flex gap-2 overflow-x-auto no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === cat
                    ? "bg-[#1D9BF0] text-white shadow-sm"
                    : "bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-neutral-400 hover:bg-gray-200 dark:hover:bg-neutral-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowFilter(!showFilter)}
            className={`p-2 rounded-full transition-colors flex-shrink-0 ${
              showFilter || showSoldItems
                ? "bg-[#1D9BF0]/10 text-[#1D9BF0]"
                : "hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-500"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Extra Filter */}
        {showFilter && (
          <div className="px-4 pb-3 flex items-center gap-3 border-t border-gray-100 dark:border-neutral-800 pt-3">
            <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-neutral-400 cursor-pointer">
              <input
                type="checkbox"
                checked={showSoldItems}
                onChange={(e) => setShowSoldItems(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 dark:border-neutral-600 text-[#1D9BF0] focus:ring-[#1D9BF0]"
              />
              Tampilkan barang terjual
            </label>
          </div>
        )}
      </header>

      {/* Items Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 p-4">
          {filteredItems.map((item) => (
            <MarketItemCard
              key={item.id}
              id={item.id}
              title={item.title}
              description={item.description}
              price_idr={item.price_idr}
              image_url={item.image_url}
              category={item.category || "Lainnya"}
              condition={item.condition || "Bekas"}
              location={item.location}
              is_active={item.is_active}
              seller_name={item.profiles?.full_name || "Anonymous"}
              seller_username={item.profiles?.username || "anonymous"}
              seller_avatar={item.profiles?.avatar_url || null}
              seller_crypto_wallet={item.profiles?.crypto_wallet || null}
              seller_id={item.user_id}
              currentUserId={currentUserId}
              isOwner={currentUserId === item.user_id}
              timeAgo={item.timeAgo}
              onEdit={handleEdit}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center mb-5">
            <Package className="w-10 h-10 text-gray-300 dark:text-neutral-600" />
          </div>
          {searchQuery || selectedCategory !== "Semua" ? (
            <>
              <p className="text-gray-500 text-lg font-medium">Tidak ada barang ditemukan</p>
              <p className="text-gray-400 text-sm mt-1">Coba ubah kata kunci pencarian atau filter kategori.</p>
              <button
                onClick={() => { setSearchQuery(""); setSelectedCategory("Semua"); }}
                className="mt-4 text-[#1D9BF0] text-sm font-semibold hover:underline"
              >
                Reset Filter
              </button>
            </>
          ) : (
            <>
              <p className="text-gray-500 text-lg font-medium">Pasar masih kosong</p>
              <p className="text-gray-400 text-sm mt-1">Jadilah yang pertama menjual barang!</p>
              <Link
                href="/pasar/jual"
                className="mt-4 flex items-center gap-2 bg-[#1D9BF0] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-[#1A8CD8] transition-colors"
              >
                <Plus className="w-4 h-4" />
                Jual Barang
              </Link>
            </>
          )}
        </div>
      )}

      {/* Intersection Observer Target */}
      <div ref={ref} className="h-20 w-full flex items-center justify-center py-6 mt-4">
        {loading && <Loader2 className="w-6 h-6 text-[#1D9BF0] animate-spin" />}
        {!hasMore && itemsList.length > 0 && (
          <p className="text-gray-500 text-sm">Tidak ada barang lagi di pasar.</p>
        )}
      </div>

    </>
  );
}
