"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Upload,
  Plus,
  Trash2,
  AlertCircle,
  PackageCheck,
} from "lucide-react";

interface VariantRow {
  label: string;
  priceBDT: string;
  stockQuantity: string;
}

export default function NewProductPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");

  // Simple vs Variable
  const [hasVariants, setHasVariants] = useState(false);
  const [priceBDT, setPriceBDT] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [variants, setVariants] = useState<VariantRow[]>([
    { label: "২৫০ গ্রাম", priceBDT: "৪৫০", stockQuantity: "২০" },
    { label: "৫০০ গ্রাম", priceBDT: "৮৫০", stockQuantity: "১৫" },
  ]);

  // Images
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      // Validate <= 2MB
      for (const f of filesArray) {
        if (f.size > 2 * 1024 * 1024) {
          setError(`ছবি "${f.name}" ২ মেগাবাইটের বেশি সাইজ (${(f.size / 1024 / 1024).toFixed(1)} MB)। ছোট ছবি নির্বাচন করুন।`);
          return;
        }
      }
      setSelectedFiles(filesArray);
      setPreviews(filesArray.map((f) => URL.createObjectURL(f)));
      setError(null);
    }
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

    if (!name.trim() || !description.trim()) {
      setError("পণ্যের নাম এবং বিবরণ দেওয়া আবশ্যক।");
      return;
    }

    if (!hasVariants && (!priceBDT || !stockQuantity)) {
      setError("একক পণ্যের জন্য মূল্য এবং স্টক সংখ্যা প্রদান করুন।");
      return;
    }

    if (hasVariants && variants.length === 0) {
      setError("ভ্যারিয়েন্টযুক্ত পণ্যের জন্য কমপক্ষে একটি ভ্যারিয়েন্ট যোগ করুন।");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("shortDescription", shortDescription);
      formData.append("description", description);
      formData.append("hasVariants", hasVariants ? "true" : "false");

      if (!hasVariants) {
        formData.append("priceBDT", priceBDT);
        formData.append("stockQuantity", stockQuantity);
      } else {
        formData.append("variants", JSON.stringify(variants));
      }

      // Append image files
      selectedFiles.forEach((file, index) => {
        formData.append(`image_${index}`, file);
      });

      const res = await fetch("/api/admin/products", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "পণ্য সংরক্ষণে সমস্যা হয়েছে।");
      }

      router.push("/admin/products");
    } catch (err: any) {
      setError(err.message || "পণ্য যুক্ত করতে সমস্যা হয়েছে।");
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
            নতুন পণ্য যোগ করুন
          </h1>
          <p className="text-xs text-slate-400">
            পোস্টগ্রেসকিউএল ডাটাবেজে ইমেজ বাইটস ও ভ্যারিয়েন্টসহ পণ্য সংরক্ষণ করুন
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
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
              placeholder="যেমন: সুন্দরবনের খাঁটি মধু"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex h-11 w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-sm text-white placeholder:text-slate-500 focus:border-brand-500 focus:outline-none"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              সংক্ষিপ্ত বিবরণ (Short Description)
            </label>
            <input
              type="text"
              placeholder="যেমন: ১০০% প্রাকৃতিক ও অপরিশোধিত কাঁচা মধু"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              className="flex h-11 w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-sm text-white placeholder:text-slate-500 focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              সম্পূর্ণ বিবরণ (Full Description) *
            </label>
            <textarea
              rows={4}
              placeholder="পণ্যের গুণাবলী, বৈশিষ্ট্য ও ব্যবহারবিধি লিখুন..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="flex w-full rounded-xl border border-slate-700 bg-slate-900 p-3.5 text-sm text-white placeholder:text-slate-500 focus:border-brand-500 focus:outline-none"
              required
            />
          </div>
        </div>

        {/* Pricing & Variants */}
        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-white">২. মূল্য ও ভ্যারিয়েন্ট</h2>
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 font-semibold">
              <input
                type="checkbox"
                checked={hasVariants}
                onChange={(e) => setHasVariants(e.target.checked)}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
              />
              <span>এই পণ্যে একাধিক ভ্যারিয়েন্ট রয়েছে (যেমন ওজন/সাইজ)</span>
            </label>
          </div>

          {!hasVariants ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  মূল্য (BDT ৳) *
                </label>
                <input
                  type="number"
                  placeholder="যেমন: ৮৫০"
                  value={priceBDT}
                  onChange={(e) => setPriceBDT(e.target.value)}
                  className="flex h-11 w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-sm text-white placeholder:text-slate-500 focus:border-brand-500 focus:outline-none"
                  required={!hasVariants}
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  স্টক পরিমাণ (Stock Quantity) *
                </label>
                <input
                  type="number"
                  placeholder="যেমন: ৫০"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                  className="flex h-11 w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-sm text-white placeholder:text-slate-500 focus:border-brand-500 focus:outline-none"
                  required={!hasVariants}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">
                  ভ্যারিয়েন্ট তালিকা (ওজন, সাইজ, প্যাক ইত্যাদি অনুযায়ী আলাদা দাম ও স্টক নির্ধারণ করুন):
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addVariantRow}
                  className="gap-1 text-slate-300 border-slate-700 hover:bg-slate-800"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>ভ্যারিয়েন্ট যোগ করুন</span>
                </Button>
              </div>

              <div className="space-y-3">
                {variants.map((v, idx) => (
                  <div
                    key={idx}
                    className="flex flex-wrap sm:flex-nowrap items-center gap-3 p-3 bg-slate-900 rounded-2xl border border-slate-800"
                  >
                    <div className="flex-1 min-w-[120px]">
                      <input
                        type="text"
                        placeholder="ভ্যারিয়েন্ট নাম (যেমন: ৫০০ গ্রাম)"
                        value={v.label}
                        onChange={(e) =>
                          updateVariantRow(idx, "label", e.target.value)
                        }
                        className="h-10 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 text-xs text-white"
                        required
                      />
                    </div>
                    <div className="w-28">
                      <input
                        type="number"
                        placeholder="মূল্য ৳"
                        value={v.priceBDT}
                        onChange={(e) =>
                          updateVariantRow(idx, "priceBDT", e.target.value)
                        }
                        className="h-10 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 text-xs text-white"
                        required
                      />
                    </div>
                    <div className="w-24">
                      <input
                        type="number"
                        placeholder="স্টক"
                        value={v.stockQuantity}
                        onChange={(e) =>
                          updateVariantRow(idx, "stockQuantity", e.target.value)
                        }
                        className="h-10 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 text-xs text-white"
                        required
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeVariantRow(idx)}
                      disabled={variants.length <= 1}
                      className="p-2 text-slate-500 hover:text-red-400 disabled:opacity-30"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Image Upload (PostgreSQL bytea) */}
        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center justify-between">
            <span>৩. পণ্যের ছবি আপলোড</span>
            <span className="text-[11px] text-slate-400 font-normal">
              PostgreSQL bytea (প্রতিটি ছবি ≤ ২ MB)
            </span>
          </h2>

          <div className="border-2 border-dashed border-slate-700 rounded-2xl p-6 text-center hover:border-slate-500 transition">
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              id="product-images"
              className="hidden"
            />
            <label
              htmlFor="product-images"
              className="cursor-pointer flex flex-col items-center gap-2"
            >
              <div className="w-12 h-12 rounded-full bg-slate-900 text-slate-300 flex items-center justify-center">
                <Upload className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold text-slate-200">
                ছবি আপলোড করতে ক্লিক করুন (JPEG, PNG, WebP)
              </span>
              <span className="text-[10px] text-slate-500">
                কোনো বাহ্যিক ক্লাউড স্টোরেজের প্রয়োজন নেই; ডাটাবেজে সংরক্ষিত হবে
              </span>
            </label>
          </div>

          {/* Previews */}
          {previews.length > 0 && (
            <div className="flex gap-3 overflow-x-auto pt-2">
              {previews.map((src, i) => (
                <div
                  key={i}
                  className="w-20 h-20 rounded-xl overflow-hidden bg-slate-900 border border-slate-700 relative flex-shrink-0"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="Preview" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-3 pt-4">
          <Link href="/admin/products">
            <Button variant="ghost" className="text-slate-400 hover:text-white">
              বাতিল
            </Button>
          </Link>
          <Button
            type="submit"
            variant="gold"
            size="lg"
            isLoading={isLoading}
            className="gap-2 font-bold shadow-lg shadow-gold-500/20"
          >
            <PackageCheck className="w-5 h-5" />
            <span>পণ্যটি সংরক্ষণ ও প্রকাশ করুন</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
