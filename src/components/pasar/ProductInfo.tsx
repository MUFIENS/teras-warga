"use client";

import { useQuery } from "@tanstack/react-query";

interface ProductInfoProps {
  title: string;
  description: string | null;
  priceIdr: number;
}

const fetchExchangeRates = async () => {
  const res = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=ethereum,matic-network,binancecoin&vs_currencies=idr"
  );
  if (!res.ok) throw new Error("Rate fetch failed");
  return res.json();
};

export function ProductInfo({ title, description, priceIdr }: ProductInfoProps) {
  const { data: rates } = useQuery({
    queryKey: ["exchangeRates"],
    queryFn: fetchExchangeRates,
    staleTime: 1000 * 60 * 5,
  });

  const formatIdr = (n: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(n);

  // Calculate a representative crypto price (ETH as default display)
  const ethRate = rates?.ethereum?.idr || 0;
  const cryptoEquivalent = ethRate > 0 ? (priceIdr / ethRate).toFixed(6) : null;

  return (
    <div className="space-y-5">
      {/* Title */}
      <h1 className="text-2xl md:text-[28px] font-bold leading-tight tracking-tight">
        {title}
      </h1>

      {/* Price Block */}
      <div className="bg-gray-50 dark:bg-neutral-800/50 rounded-2xl p-5 border border-gray-100 dark:border-neutral-800">
        <p className="text-xs font-semibold text-gray-400 dark:text-neutral-500 uppercase tracking-wider mb-1">
          Harga
        </p>
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            {formatIdr(priceIdr)}
          </span>
          {cryptoEquivalent && (
            <span className="text-sm font-medium text-gray-400 dark:text-neutral-500">
              ≈ {cryptoEquivalent} ETH
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      <div>
        <h2 className="text-sm font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-wider mb-3">
          Deskripsi
        </h2>
        <div className="text-[15px] leading-relaxed text-gray-700 dark:text-neutral-300 whitespace-pre-wrap">
          {description || "Tidak ada deskripsi untuk produk ini."}
        </div>
      </div>
    </div>
  );
}
