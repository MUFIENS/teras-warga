"use client";

import { useState, useRef, useTransition } from "react";
import { X, ImagePlus, Loader2 } from "lucide-react";
import { createMarketItem, updateMarketItem } from "@/app/pasar/actions";
import { useRouter } from "next/navigation";

const CATEGORIES = [
  "Elektronik",
  "Pakaian",
  "Makanan",
  "Furnitur",
  "Kendaraan",
  "Jasa",
  "Lainnya",
];

const CONDITIONS = ["Baru", "Bekas - Seperti Baru", "Bekas - Baik", "Bekas"];

interface MarketItemFormProps {
  isOpen: boolean;
  onClose: () => void;
  editItem?: {
    id: string;
    title: string;
    description: string | null;
    price_idr: number;
    category: string;
    condition: string;
    location: string | null;
    image_url: string | null;
  } | null;
}

export function MarketItemForm({ isOpen, onClose, editItem }: MarketItemFormProps) {
  const [title, setTitle] = useState(editItem?.title || "");
  const [description, setDescription] = useState(editItem?.description || "");
  const [price, setPrice] = useState(editItem?.price_idr?.toString() || "");
  const [category, setCategory] = useState(editItem?.category || "Lainnya");
  const [condition, setCondition] = useState(editItem?.condition || "Bekas");
  const [location, setLocation] = useState(editItem?.location || "");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(editItem?.image_url || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const formatPriceInput = (value: string) => {
    const numericValue = value.replace(/[^\d]/g, "");
    return numericValue;
  };

  const displayPrice = (value: string) => {
    if (!value) return "";
    const num = parseInt(value);
    if (isNaN(num)) return "";
    return new Intl.NumberFormat("id-ID").format(num);
  };

  const handleSubmit = () => {
    if (!title.trim() || !price || parseInt(price) <= 0) return;

    startTransition(async () => {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("price_idr", price);
      formData.append("category", category);
      formData.append("condition", condition);
      formData.append("location", location.trim());
      if (image) formData.append("image", image);

      if (editItem) {
        await updateMarketItem(editItem.id, formData);
      } else {
        await createMarketItem(formData);
      }
      
      router.refresh();
      onClose();
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-neutral-900 rounded-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-neutral-800">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-neutral-800 z-10">
          <h2 className="text-lg font-bold">
            {editItem ? "Edit Barang" : "Jual Barang Baru"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-5 space-y-5">
          {/* Image Unggah */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Foto Barang
            </label>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageChange}
            />
            {imagePreview ? (
              <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-neutral-700 aspect-video">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => {
                    setImage(null);
                    setImagePreview(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full aspect-video rounded-xl border-2 border-dashed border-gray-300 dark:border-neutral-700 hover:border-[#1D9BF0] dark:hover:border-[#1D9BF0] flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-[#1D9BF0] transition-colors"
              >
                <ImagePlus className="w-8 h-8" />
                <span className="text-sm font-medium">Tambahkan Foto</span>
              </button>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
              Judul Barang <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: iPhone 14 Pro Max 256GB"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#1D9BF0] focus:border-transparent transition-all text-[15px]"
              maxLength={100}
            />
          </div>

          {/* Price */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
              Harga <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-[15px]">
                Rp
              </span>
              <input
                type="text"
                value={displayPrice(price)}
                onChange={(e) => setPrice(formatPriceInput(e.target.value))}
                placeholder="0"
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#1D9BF0] focus:border-transparent transition-all text-[15px]"
              />
            </div>
          </div>

          {/* Category & Condition */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
                Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#1D9BF0] focus:border-transparent transition-all text-[15px] appearance-none cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
                Kondisi
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#1D9BF0] focus:border-transparent transition-all text-[15px] appearance-none cursor-pointer"
              >
                {CONDITIONS.map((cond) => (
                  <option key={cond} value={cond}>
                    {cond}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
              Lokasi
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Contoh: Blok A RT 05"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#1D9BF0] focus:border-transparent transition-all text-[15px]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
              Deskripsi
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tuliskan detail barang, kelengkapan, alasan dijual, dll..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#1D9BF0] focus:border-transparent transition-all text-[15px] resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm px-5 py-4 border-t border-gray-200 dark:border-neutral-800">
          <button
            onClick={handleSubmit}
            disabled={isPending || !title.trim() || !price || parseInt(price) <= 0}
            className="w-full bg-[#1D9BF0] text-white font-bold py-3 rounded-xl hover:bg-[#1A8CD8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {editItem ? "Menyimpan..." : "Menerbitkan..."}
              </>
            ) : (
              editItem ? "Simpan Perubahan" : "Terbitkan ke Pasar"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
