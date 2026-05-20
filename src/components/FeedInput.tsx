"use client";

import { useState, useRef, useTransition } from "react";
import { ImagePlus, X } from "lucide-react";
import { createPost } from "@/app/actions";
import { useRouter } from "next/navigation";

export function FeedInput({ 
  avatar, 
  username, 
  parentId,
  placeholder = "Apa yang sedang terjadi di lingkunganmu?"
}: { 
  avatar?: string | null, 
  username: string,
  parentId?: string,
  placeholder?: string
}) {
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!content.trim() && !image) return;

    startTransition(async () => {
      const formData = new FormData();
      if (content.trim()) formData.append("content", content);
      if (image) formData.append("image", image);
      if (parentId) formData.append("parent_id", parentId);

      await createPost(formData);
      setContent("");
      removeImage();
      router.refresh();
    });
  };

  return (
    <div className="px-4 py-4 border-b border-gray-200 dark:border-neutral-800 flex gap-4">
      <div className="flex-shrink-0">
        {avatar ? (
          <img src={avatar} alt={username} className="w-10 h-10 rounded-full object-cover" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-neutral-800 flex items-center justify-center font-bold text-gray-500 uppercase">
            {username?.charAt(0) || "U"}
          </div>
        )}
      </div>
      <div className="flex-1">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent resize-none outline-none text-xl placeholder:text-gray-500 py-2 min-h-[100px]"
          disabled={isPending}
        />
        
        {imagePreview && (
          <div className="relative mb-3 rounded-2xl overflow-hidden border border-gray-200 dark:border-neutral-800 max-w-md">
            <button 
              onClick={removeImage}
              className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <img src={imagePreview} alt="Preview" className="w-full h-auto" />
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleImageChange}
              disabled={isPending}
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="text-[#1D9BF0] hover:bg-[#1D9BF0]/10 p-2 rounded-full transition-colors duration-200"
              disabled={isPending}
            >
              <ImagePlus className="w-5 h-5" />
            </button>
          </div>
          <button 
            onClick={handleSubmit}
            disabled={isPending || (!content.trim() && !image)}
            className="bg-[#1D9BF0] text-white font-bold py-2 px-5 rounded-full hover:bg-[#1A8CD8] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'Memposting...' : (parentId ? 'Balas' : 'Posting')}
          </button>
        </div>
      </div>
    </div>
  );
}
