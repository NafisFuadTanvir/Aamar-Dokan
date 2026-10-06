"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";

interface ProductDeleteButtonProps {
  productId: string;
  productName: string;
}

export function ProductDeleteButton({
  productId,
  productName,
}: ProductDeleteButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `আপনি কি নিশ্চিত যে "${productName}" পণ্যটি মুছে ফেলতে চান?`
    );

    if (!confirmed) return;

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/admin/products?id=${productId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "পণ্য মুছে ফেলতে সমস্যা হয়েছে।");
      }

      router.refresh();
    } catch (error: any) {
      alert(error.message || "পণ্য মুছে ফেলতে সমস্যা হয়েছে।");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      title="পণ্য ডিলিট করুন"
      className="p-2 rounded-xl text-red-400 hover:text-white hover:bg-red-500/20 border border-transparent hover:border-red-500/30 transition flex items-center justify-center disabled:opacity-50"
    >
      {isDeleting ? (
        <Loader2 className="w-4 h-4 animate-spin text-red-400" />
      ) : (
        <Trash2 className="w-4 h-4" />
      )}
    </button>
  );
}
