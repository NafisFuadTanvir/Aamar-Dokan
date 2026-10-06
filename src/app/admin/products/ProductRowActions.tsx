"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit, Trash2, Loader2, AlertTriangle } from "lucide-react";

interface ProductRowActionsProps {
  productId: string;
  productName: string;
}

export function ProductRowActions({ productId, productName }: ProductRowActionsProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/products?id=${productId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "পণ্য মুছে ফেলা সম্ভব হয়নি।");
      }

      setShowConfirm(false);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "পণ্য মুছতে সমস্যা হয়েছে।");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="relative inline-flex items-center justify-end gap-2">
      {/* Edit Button */}
      <Link
        href={`/admin/products/${productId}/edit`}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition text-xs font-semibold"
        title="পণ্য সম্পাদনা করুন"
      >
        <Edit className="w-3.5 h-3.5 text-blue-400" />
        <span>এডিট</span>
      </Link>

      {/* Delete Trigger Button */}
      <button
        type="button"
        onClick={() => setShowConfirm(true)}
        disabled={isDeleting}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition text-xs font-semibold disabled:opacity-50"
        title="পণ্য মুছে ফেলুন"
      >
        {isDeleting ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Trash2 className="w-3.5 h-3.5" />
        )}
        <span>ডিলিট</span>
      </button>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-2xl text-left space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">পণ্যটি মুছে ফেলতে চান?</h3>
                <p className="text-xs text-slate-400 truncate max-w-[220px]">
                  &quot;{productName}&quot;
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              এই পণ্যটি মুছে ফেললে কার্ট এবং রিভিউ থেকে এটি সরিয়ে নেওয়া হবে। এই পরিবর্তন অপরিবর্তনীয়।
            </p>

            {error && (
              <p className="text-xs text-red-400 bg-red-500/10 p-2.5 rounded-lg border border-red-500/20">
                {error}
              </p>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowConfirm(false);
                  setError(null);
                }}
                disabled={isDeleting}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-800 transition"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>মুছে ফেলা হচ্ছে...</span>
                  </>
                ) : (
                  <span>হ্যাঁ, মুছে ফেলুন</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
