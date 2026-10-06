"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Upload,
  Plus,
  Trash2,
  AlertCircle,
  Save,
  CheckCircle2,
  X,
  ImageIcon,
} from "lucide-react";

interface VariantRow {
  label: string;
  priceBDT: string;
  stockQuantity: string;
}

interface ExistingImage {
  id: string;
  altText: string;
  sortOrder: number;
}

interface EditProductFormProps {
  product: {
    id: string;
    name: string;
    slug: string;
    shortDescription: string | null;
    description: string;
    categoryId: string | null;
    status: string;
    hasVariants: boolean;
    priceBDT: number;
    stockQuantity: number;
    variants: Array<{
      id: string;
      label: string;
      priceBDT: number;
      stockQuantity: number;
    }>;
    images: ExistingImage[];
  };
  categories: Array<{
    id: string;
    name: string;
  }>;
}

export function EditProductForm({ product, categories }: EditProductFormProps) {
  const router = useRouter();

  const [name, setName] = useState(product.name || "");
  const [shortDescription, setShortDescription] = useState(product.shortDescription || "");
  const [description, setDescription] = useState(product.description || "");
  const [categoryId, setCategoryId] = useState(product.categoryId || "");
  const [status, setStatus] = useState(product.status || "PUBLISHED");

  // Simple vs Variable
  const [hasVariants, setHasVariants] = useState(product.hasVariants);
  const [priceBDT, setPriceBDT] = useState(product.priceBDT.toString());
  const [stockQuantity, setStockQuantity] = useState(product.stockQuantity.toString());
  const [variants, setVariants] = useState<VariantRow[]>(
    product.variants.length > 0
      ? product.variants.map((v) => ({
          label: v.label,
          priceBDT: v.priceBDT.toString(),
          stockQuantity: v.stockQuantity.toString(),
        }))
      : [
          { label: "২৫০ গ্রাম", priceBDT: "৪৫০", stockQuantity: "২০" },
          { label: "৫০০ গ্রাম", priceBDT: "৮৫০", stockQuantity: "১৫" },
        ]
  );

  // Existing & New Images
  const [existingImages, setExistingImages] = useState<ExistingImage[]>(product.images);
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const MAX_SIZE = 2 * 1024 * 1024; // 2 MB
      for (const f of filesArray) {
        if (f.size > MAX_SIZE) {
          setError(
            `ছবি "${f.name}" ২ মেগাবাইটের বেশি (${(f.size / 1024 / 1024).toFixed(1)} MB)। ছোট ছবি নির্বাচন করুন।`
          );
          return;
        }
      }
      setNewFiles((prev) => [...prev, ...filesArray]);
      const newUrls = filesArray.map((f) => URL.createObjectURL(f));
      setNewPreviews((prev) => [...prev, ...newUrls]);
      setError(null);
    }
  };

  const removeExistingImage = (imageId: string) => {
    setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
    setDeletedImageIds((prev) => [...prev, imageId]);
  };

  const removeNewImage = (index: number) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
    setNewPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const addVariantRow = () => {
    setVariants((prev) => [
      ...prev,
      { label: "", priceBDT: "", stockQuantity: "10" },
    ]);
  };

  const removeVariantRow = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const updateVariantRow = (
    index: number,
    field: keyof VariantRow,
    value: string
  ) => {
    setVariants((prev) => {
      const copy = [...prev];
      copy[index][field] = value;
      return copy;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!name.trim() || !description.trim()) {
      setError("পণ্যের নাম এবং বিবরণ প্রদান করা আবশ্যক।");
      return;
    }

    if (!hasVariants && (!priceBDT || !stockQuantity)) {
      setError("একক পণ্যের জন্য মূল্য এবং স্টক সংখ্যা প্রদান করুন।");
      return;
    }

    if (hasVariants && variants.length === 0) {
      setError("ভ্যারিয়েন্ট যুক্ত পণ্যের জন্য কমপক্ষে একটি ভ্যারিয়েন্ট যোগ করুন।");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("shortDescription", shortDescription);
      formData.append("description", description);
      if (categoryId) formData.append("categoryId", categoryId);
      formData.append("status", status);
      formData.append("hasVariants", hasVariants ? "true" : "false");

      if (!hasVariants) {
        formData.append("priceBDT", priceBDT);
        formData.append("stockQuantity", stockQuantity);
      } else {
        formData.append("variants", JSON.stringify(variants));
      }

      if (deletedImageIds.length > 0) {
        formData.append("deletedImageIds", JSON.stringify(deletedImageIds));
      }

      newFiles.forEach((file, index) => {
        formData.append(`image_${index}`, file);
      });

      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "পণ্য আপডেট করতে সমস্যা হয়েছে।");
      }

      setSuccessMsg("পণ্য সফলভাবে আপডেট করা হয়েছে!");
      setTimeout(() => {
        router.push("/admin/products");
        router.refresh();
      }, 800);
    } catch (err: any) {
      setError(err.message || "পণ্য সংরক্ষণে সমস্যা হয়েছে।");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4 pb-4 border-b border-slate-800">
        <Link
          href="/admin/products"
          className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white font-bengali">
            পণ্য সম্পাদনা (Edit Product)
          </h1>
          <p className="text-xs text-slate-400">
            আইডি: <span className="font-mono text-slate-300">{product.id}</span>
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white border-b border-slate-800 pb-3">
            ১. সাধারণ তথ্য
          </h2>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              পণ্যের নাম *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex h-11 w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-sm text-white placeholder:text-slate-500 focus:border-brand-500 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                ক্যাটাগরি
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="flex h-11 w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-sm text-white focus:border-brand-500 focus:outline-none"
              >
                <option value="">সাধারণ (কোনো ক্যাটাগরি নেই)</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                স্ট্যাটাস
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="flex h-11 w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-sm text-white focus:border-brand-500 focus:outline-none"
              >
                <option value="PUBLISHED">PUBLISHED (প্রকাশিত)</option>
                <option value="DRAFT">DRAFT (খসড়া)</option>
                <option value="ARCHIVED">ARCHIVED (আর্কাইভ)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              সংক্ষিপ্ত বিবরণ (Short Description)
            </label>
            <input
              type="text"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              className="flex h-11 w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-sm text-white placeholder:text-slate-500 focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              বিস্তারিত বিবরণ (Full Description) *
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="flex w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-sm text-white placeholder:text-slate-500 focus:border-brand-500 focus:outline-none"
              required
            />
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-white">
              ২. মূল্য এবং স্টক ব্যবস্থাপনা
            </h2>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="hasVariants"
                checked={hasVariants}
                onChange={(e) => setHasVariants(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-brand-600 focus:ring-brand-500"
              />
              <label
                htmlFor="hasVariants"
                className="text-xs font-semibold text-slate-300 cursor-pointer"
              >
                একাধিক ভ্যারিয়েন্ট রয়েছে (যেমন: ওজন/সাইজ)
              </label>
            </div>
          </div>

          {!hasVariants ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  মূল্য (BDT) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={priceBDT}
                  onChange={(e) => setPriceBDT(e.target.value)}
                  className="flex h-11 w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-sm text-white placeholder:text-slate-500 focus:border-brand-500 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  স্টক সংখ্যা (Stock) *
                </label>
                <input
                  type="number"
                  min="0"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                  className="flex h-11 w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-sm text-white placeholder:text-slate-500 focus:border-brand-500 focus:outline-none"
                  required
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                প্রতিটি ভ্যারিয়েন্টের জন্য আলাদা মূল্য ও স্টক সংখ্যা নির্ধারণ করুন।
              </p>

              <div className="space-y-2">
                {variants.map((v, i) => (
                  <div
                    key={i}
                    className="flex flex-col sm:flex-row items-center gap-2 p-3 rounded-2xl bg-slate-900 border border-slate-800"
                  >
                    <input
                      type="text"
                      placeholder="লেবেল (যেমন: ৫০০ গ্রাম)"
                      value={v.label}
                      onChange={(e) => updateVariantRow(i, "label", e.target.value)}
                      className="flex h-9 flex-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 text-xs text-white placeholder:text-slate-500 focus:border-brand-500 focus:outline-none"
                      required
                    />
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <input
                        type="number"
                        min="0"
                        step="any"
                        placeholder="মূল্য ৳"
                        value={v.priceBDT}
                        onChange={(e) => updateVariantRow(i, "priceBDT", e.target.value)}
                        className="flex h-9 w-28 rounded-lg border border-slate-700 bg-slate-950 px-3 text-xs text-white placeholder:text-slate-500 focus:border-brand-500 focus:outline-none"
                        required
                      />
                      <input
                        type="number"
                        min="0"
                        placeholder="স্টক"
                        value={v.stockQuantity}
                        onChange={(e) => updateVariantRow(i, "stockQuantity", e.target.value)}
                        className="flex h-9 w-20 rounded-lg border border-slate-700 bg-slate-950 px-3 text-xs text-white placeholder:text-slate-500 focus:border-brand-500 focus:outline-none"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => removeVariantRow(i)}
                        className="p-2 text-slate-500 hover:text-red-400 transition"
                        title="ভ্যারিয়েন্ট মুছুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addVariantRow}
                className="gap-1.5 text-xs font-semibold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>আরেকটি ভ্যারিয়েন্ট যোগ করুন</span>
              </Button>
            </div>
          )}
        </div>

        {/* Images */}
        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white border-b border-slate-800 pb-3">
            ৩. পণ্যের ছবি গ্যালারি
          </h2>

          {/* Current Saved Images */}
          {existingImages.length > 0 && (
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">
                বর্তমান সংরক্ষিত ছবিসমূহ ({existingImages.length}টি)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {existingImages.map((img) => (
                  <div
                    key={img.id}
                    className="relative group rounded-xl overflow-hidden border border-slate-800 bg-slate-900 aspect-square"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/api/images/${img.id}`}
                      alt={img.altText || "Product"}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(img.id)}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-600/80 hover:bg-red-600 text-white transition shadow"
                      title="এই ছবিটি মুছে ফেলুন"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add New Images */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-semibold text-slate-300">
              নতুন ছবি যুক্ত করুন (সর্বোচ্চ ২ MB প্রতি ছবি)
            </label>
            <div className="border-2 border-dashed border-slate-800 hover:border-slate-700 rounded-2xl p-6 text-center transition cursor-pointer relative bg-slate-900/40">
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-300">
                ছবি নির্বাচন করতে ক্লিক করুন বা টেনে আনুন
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                JPEG, PNG বা WebP ফরম্যাট সমর্থিত
              </p>
            </div>
          </div>

          {/* New Previews */}
          {newPreviews.length > 0 && (
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-semibold text-emerald-400">
                নতুন নির্বাচিত ছবিসমূহ ({newPreviews.length}টি)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {newPreviews.map((url, i) => (
                  <div
                    key={i}
                    className="relative group rounded-xl overflow-hidden border border-emerald-500/30 bg-slate-900 aspect-square"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt="New preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(i)}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-600/80 hover:bg-red-600 text-white transition shadow"
                      title="বাদ দিন"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link href="/admin/products">
            <Button type="button" variant="outline">
              বাতিল
            </Button>
          </Link>

          <Button
            type="submit"
            variant="gold"
            disabled={isLoading}
            className="gap-2 font-bold px-6"
          >
            <Save className="w-4 h-4" />
            <span>{isLoading ? "সংরক্ষণ করা হচ্ছে..." : "পরিবর্তন সংরক্ষণ করুন"}</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
