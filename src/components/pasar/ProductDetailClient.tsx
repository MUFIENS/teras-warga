"use client";

import { useState } from "react";
import { ProductItem } from "@/types/marketplace";
import { ChevronLeft, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { showSuccess } from "@/lib/toast";

import { ProductGallery } from "./ProductGallery";
import { ProductInfo } from "./ProductInfo";
import { SellerCard } from "./SellerCard";
import { PaymentSelector } from "./PaymentSelector";
import { ReviewSection } from "./ReviewSection";
import { CryptoPaymentModal } from "../crypto/CryptoPaymentModal";
import { MarketItemCard } from "@/components/MarketItemCard";

interface ProductDetailClientProps {
  product: ProductItem;
  currentUserId: string | null;
  relatedProducts?: any[];
}

export function ProductDetailClient({ product, currentUserId, relatedProducts = [] }: ProductDetailClientProps) {
  const router = useRouter();
  const [isCryptoModalOpen, setIsCryptoModalOpen] = useState(false);

  const isOwner = currentUserId === product.user_id;
  const canBuy = product.is_active && !isOwner && !!currentUserId;

  const handleCryptoSuccess = async (hash: string) => {
    setIsCryptoModalOpen(false);
    if (!currentUserId) return;

    try {
      const supabase = createClient();
      await (supabase as any).from("market_orders").insert({
        item_id: product.id,
        buyer_id: currentUserId,
        seller_id: product.user_id,
        payment_method: "crypto",
        payment_amount: product.price_idr || 0,
        payment_currency: "CRYPTO",
        status: "completed",
        crypto_tx_hash: hash,
      });

      showSuccess("Pembayaran Berhasil!", "Pesanan Anda terverifikasi secara on-chain.");
    } catch (err) {
      console.error("Failed to log crypto order:", err);
    }
  };

  const formatIdr = (n: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <>
      <div className="space-y-6">
        {/* Back Navigation */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Kembali
        </button>

        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Column — 3/5 width */}
          <div className="lg:col-span-3 space-y-6">
            <ProductGallery
              imageUrl={product.image_url}
              title={product.title}
              isActive={product.is_active ?? true}
              category={product.category}
              condition={product.condition}
              location={product.location}
            />

            {/* Product Info (below gallery on desktop, stays in flow) */}
            <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl p-5 md:p-6">
              <ProductInfo
                title={product.title}
                description={product.description}
                priceIdr={product.price_idr || 0}
              />
            </div>

            {/* Reviews */}
            <ReviewSection reviews={product.reviews || []} />
          </div>

          {/* Right Column — 2/5 width, sticky sidebar */}
          <div className="lg:col-span-2 space-y-4">
            <div className="lg:sticky lg:top-6 space-y-4">
              {/* Price Card (desktop sidebar summary) */}
              <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl p-5 hidden lg:block">
                <p className="text-xs font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-widest mb-2">
                  Harga
                </p>
                <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                  {formatIdr(product.price_idr || 0)}
                </p>
              </div>

              <SellerCard seller={product.seller} />

              {canBuy && (
                <PaymentSelector
                  itemId={product.id}
                  sellerId={product.user_id}
                  priceIdr={product.price_idr || 0}
                  sellerHasWallet={!!product.seller.crypto_wallet}
                  currentUserId={currentUserId}
                  onOpenCryptoModal={() => setIsCryptoModalOpen(true)}
                />
              )}
            </div>
          </div>
        </div>

        {/* Rekomendasi Produk Lain */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-neutral-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Mungkin Anda Juga Suka
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {relatedProducts.map((item) => (
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
                  seller_name={item.seller_name}
                  seller_username={item.seller_username}
                  seller_avatar={item.seller_avatar}
                  seller_crypto_wallet={item.seller_crypto_wallet}
                  seller_id={item.user_id}
                  currentUserId={currentUserId}
                  isOwner={currentUserId === item.user_id}
                  timeAgo={item.timeAgo}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sticky Buy Bar */}
      {canBuy && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-lg border-t border-gray-200 dark:border-neutral-800 p-4 lg:hidden">
          <div className="max-w-lg mx-auto flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 dark:text-neutral-400">Harga</p>
              <p className="text-lg font-black text-gray-900 dark:text-white truncate">
                {formatIdr(product.price_idr || 0)}
              </p>
            </div>
            <button
              onClick={() => {
                // Scroll to payment section on mobile
                const el = document.querySelector("[data-payment-selector]");
                if (el) {
                  el.scrollIntoView({ behavior: "smooth", block: "center" });
                }
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl transition-colors flex items-center gap-2 flex-shrink-0"
            >
              <ShoppingBag className="w-4 h-4" />
              Beli
            </button>
          </div>
        </div>
      )}

      {/* Crypto Payment Modal */}
      <CryptoPaymentModal
        isOpen={isCryptoModalOpen}
        onClose={() => setIsCryptoModalOpen(false)}
        item={{
          id: product.id,
          title: product.title,
          price_idr: product.price_idr || 0,
          seller_crypto_wallet: product.seller.crypto_wallet,
        }}
        onSuccess={handleCryptoSuccess}
      />
    </>
  );
}
