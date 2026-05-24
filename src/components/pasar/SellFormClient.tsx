"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { X, UploadCloud, Loader2, ArrowLeft, ImagePlus, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { showSuccess, showError, showWarning } from "@/lib/toast";

const CATEGORIES = ["Elektronik", "Pakaian", "Makanan", "Furnitur", "Kendaraan", "Jasa", "Lainnya"];
const CONDITIONS = ["Baru", "Bekas - Seperti Baru", "Bekas - Baik", "Bekas"];

interface SellFormClientProps {
  initialWallet: string;
  userId: string;
  initialData?: any;
}

export function SellFormClient({ initialWallet, userId, initialData }: SellFormClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);

  // Form State
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(initialData?.image_urls || (initialData?.image_url ? [initialData.image_url] : []));
  const [title, setTitle] = useState(initialData?.title || "");
  const [category, setCategory] = useState(initialData?.category || "Lainnya");
  const [condition, setCondition] = useState(initialData?.condition || "Bekas");
  const [location, setLocation] = useState(initialData?.location || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [wallet, setWallet] = useState(initialWallet);
  const [priceEth, setPriceEth] = useState(initialData?.price_crypto ? String(initialData.price_crypto) : "");
  const [priceIdr, setPriceIdr] = useState<number | null>(initialData?.price_idr || null);

  // CoinGecko State
  const [ethRate, setEthRate] = useState<number | null>(null);
  const [isFetchingRate, setIsFetchingRate] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch ETH->IDR rate
  useEffect(() => {
    let isMounted = true;
    const fetchRate = async () => {
      setIsFetchingRate(true);
      try {
        const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=idr");
        const data = await res.json();
        if (isMounted && data.ethereum?.idr) {
          setEthRate(data.ethereum.idr);
        }
      } catch (e) {
        console.error("Failed to fetch ETH rate", e);
      } finally {
        if (isMounted) setIsFetchingRate(false);
      }
    };
    fetchRate();
    const interval = setInterval(fetchRate, 60000); // refresh every minute
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Update IDR price when ETH price changes
  useEffect(() => {
    if (!priceEth || isNaN(parseFloat(priceEth)) || !ethRate) {
      setPriceIdr(null);
      return;
    }
    const idr = parseFloat(priceEth) * ethRate;
    setPriceIdr(idr);
  }, [priceEth, ethRate]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const totalFiles = images.length + newFiles.length;
      
      if (totalFiles > 4) {
        showWarning("Maksimal 4 Foto", "Anda hanya dapat mengunggah maksimal 4 foto.");
        return;
      }

      setImages((prev) => [...prev, ...newFiles]);
      
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const validateWallet = (address: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  const handleSubmit = async () => {
    // If we're editing and have existing image previews but no new images, that's okay.
    if (!title.trim() || !priceEth || !category || (!images.length && !imagePreviews.length) || !wallet.trim()) {
      showWarning("Data Belum Lengkap", "Harap isi semua field wajib dan unggah minimal 1 foto.");
      return;
    }

    if (!validateWallet(wallet)) {
      showError("Wallet Tidak Valid", "Pastikan alamat MetaMask valid (dimulai dengan 0x).");
      return;
    }

    setIsUploading(true);
    const supabase = createClient();
    const uploadedUrls: string[] = [];

    try {
      // 1. Upload new images if any
      const uploadedUrls: string[] = [];
      
      // If editing, keep old images that weren't removed.
      // For simplicity in this edit mode, if they upload new images, we append them.
      // If they removed previews, we need to track that.
      // We will only use imagePreviews that start with 'http' as existing ones.
      const existingUrls = imagePreviews.filter(url => url.startsWith('http'));
      uploadedUrls.push(...existingUrls);

      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        const fileExt = file.name.split(".").pop();
        const fileName = `${userId}-${Date.now()}-${i}.${fileExt}`;
        const filePath = `market_images/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("market_images")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage.from("market_images").getPublicUrl(filePath);
        uploadedUrls.push(publicUrl);
      }

      // 2. Update user profile wallet if changed
      if (wallet !== initialWallet) {
        await supabase.from("profiles").update({ crypto_wallet: wallet }).eq("id", userId);
      }

      const payload = {
        title: title.trim(),
        description: description.trim(),
        price_crypto: parseFloat(priceEth),
        price_idr: priceIdr || 0,
        category,
        condition,
        location: location.trim(),
        image_url: uploadedUrls[0], // fallback for old schema
        image_urls: uploadedUrls,
        is_active: true
      };

      // 3. Insert or Update Market Item
      let dbOperation;
      if (initialData) {
        dbOperation = (supabase as any).from("market_items").update(payload).eq("id", initialData.id);
      } else {
        dbOperation = (supabase as any).from("market_items").insert({ ...payload, user_id: userId });
      }

      const { data, error } = await dbOperation.select().single();

      if (error) throw error;

      showSuccess("Berhasil!", "Barang Anda telah terbit di pasar.");
      router.push(`/pasar/${data.id}`);
      router.refresh();

    } catch (err: any) {
      console.error(err);
      showError("Gagal", err.message || "Gagal menerbitkan barang.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-black min-h-screen lg:min-h-0 lg:my-8 lg:rounded-3xl lg:border border-gray-200 dark:border-neutral-800 lg:shadow-xl overflow-hidden flex flex-col relative">
      {/* Header */}
      <header className="sticky top-14 md:top-0 z-20 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-neutral-800 px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/pasar" className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-bold text-lg">Jual Barang Web3</h1>
        </div>
      </header>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-8 pb-32 space-y-8">
        
        {/* Photos Section */}
        <section>
          <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#1D9BF0]/10 text-[#1D9BF0] flex items-center justify-center text-xs">1</span>
            Foto Barang <span className="text-red-500">*</span>
          </h2>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {imagePreviews.map((url, i) => (
              <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border border-gray-200 dark:border-neutral-700 group">
                <img loading="lazy" src={url} alt={`Preview ${i}`} className="w-full h-full object-cover" />
                <button
                  onClick={() => removeImage(i)}
                  className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black text-white rounded-full transition-all opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            
            {images.length < 4 && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-2xl border-2 border-dashed border-gray-300 dark:border-neutral-700 hover:border-[#1D9BF0] hover:bg-[#1D9BF0]/5 transition-colors flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-[#1D9BF0]"
              >
                <ImagePlus className="w-8 h-8" />
                <span className="text-xs font-semibold">Tambah Foto ({images.length}/4)</span>
              </button>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
        </section>

        {/* Details Section */}
        <section>
          <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#1D9BF0]/10 text-[#1D9BF0] flex items-center justify-center text-xs">2</span>
            Detail Barang
          </h2>
          
          <div className="space-y-5">
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                Nama Barang <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: MacBook Pro M2 2023"
                className="w-full px-4 py-3.5 rounded-2xl border border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-900 focus:bg-white dark:focus:bg-neutral-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1D9BF0] focus:border-transparent transition-all text-[15px]"
                maxLength={100}
              />
              <div className="text-right mt-1 text-xs text-gray-400">{title.length}/100</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                  Kategori
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-2xl border border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-900 focus:bg-white dark:focus:bg-neutral-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1D9BF0] focus:border-transparent transition-all text-[15px] appearance-none cursor-pointer"
                >
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                  Kondisi
                </label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-2xl border border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-900 focus:bg-white dark:focus:bg-neutral-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1D9BF0] focus:border-transparent transition-all text-[15px] appearance-none cursor-pointer"
                >
                  {CONDITIONS.map(cond => <option key={cond} value={cond}>{cond}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                Lokasi COD / Pengiriman
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Contoh: Jakarta Selatan atau Kirim JNE"
                className="w-full px-4 py-3.5 rounded-2xl border border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-900 focus:bg-white dark:focus:bg-neutral-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1D9BF0] focus:border-transparent transition-all text-[15px]"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                Deskripsi Barang
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ceritakan detail kondisi, kelengkapan, minus, atau alasan dijual..."
                rows={5}
                className="w-full px-4 py-3.5 rounded-2xl border border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-900 focus:bg-white dark:focus:bg-neutral-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1D9BF0] focus:border-transparent transition-all text-[15px] resize-none"
              />
            </div>
          </div>
        </section>

        {/* Pricing & Web3 Section */}
        <section>
          <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#1D9BF0]/10 text-[#1D9BF0] flex items-center justify-center text-xs">3</span>
            Harga & Web3 <ShieldCheck className="w-4 h-4 text-[#1D9BF0]" />
          </h2>

          <div className="p-5 rounded-2xl border border-blue-100 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-900/10 space-y-5">
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                Harga Crypto (ETH) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-500">ETH</span>
                <input
                  type="number"
                  step="0.0001"
                  min="0"
                  value={priceEth}
                  onChange={(e) => setPriceEth(e.target.value)}
                  placeholder="0.05"
                  className="w-full pl-14 pr-4 py-3.5 rounded-2xl border border-blue-200 dark:border-blue-800 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono text-lg"
                />
              </div>
              <div className="mt-2.5 flex items-center justify-between text-sm">
                <span className="text-gray-500 font-medium">Estimasi dalam Rupiah:</span>
                {isFetchingRate ? (
                  <span className="flex items-center gap-1.5 text-[#1D9BF0]">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Menghitung...
                  </span>
                ) : (
                  <span className="font-bold text-[#1D9BF0]">
                    ≈ Rp {priceIdr ? priceIdr.toLocaleString("id-ID") : "0"}
                  </span>
                )}
              </div>
            </div>

            <div className="border-t border-blue-100 dark:border-blue-900/30 pt-5">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                Dompet MetaMask Penerima Dana <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={wallet}
                onChange={(e) => setWallet(e.target.value)}
                placeholder="0x..."
                className={`w-full px-4 py-3.5 rounded-2xl border ${wallet && !validateWallet(wallet) ? 'border-red-300 focus:ring-red-500' : 'border-blue-200 dark:border-blue-800 focus:ring-blue-500'} bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all font-mono text-sm`}
              />
              <p className={`mt-2 text-xs font-medium ${wallet && !validateWallet(wallet) ? 'text-red-500' : 'text-gray-500'}`}>
                {wallet && !validateWallet(wallet) ? "Format alamat dompet tidak valid." : "Dana hasil penjualan crypto akan dikirim ke wallet ini."}
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Sticky Bottom Action */}
      <div className="absolute lg:static bottom-0 left-0 right-0 p-4 bg-white/95 dark:bg-black/95 backdrop-blur-md border-t border-gray-200 dark:border-neutral-800 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] dark:shadow-none z-20">
        <button
          onClick={handleSubmit}
          disabled={isUploading || !title.trim() || !priceEth || (!images.length && !imagePreviews.length) || !validateWallet(wallet)}
          className="w-full h-14 rounded-2xl bg-[#1D9BF0] hover:bg-[#1A8CD8] text-white font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Menyimpan...
            </>
          ) : (
            initialData ? "Simpan Perubahan" : "Terbitkan Barang"
          )}
        </button>
      </div>
    </div>
  );
}
