"use client";

import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function SortSelectInner({ defaultValue }: { defaultValue: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", e.target.value);
    router.push(`?${params.toString()}`);
  };

  return (
    <select
      aria-label="সাজান"
      defaultValue={defaultValue}
      onChange={handleChange}
      className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-700/20"
    >
      <option value="newest">নতুন পণ্য আগে</option>
      <option value="price-asc">দাম: কম থেকে বেশি</option>
      <option value="price-desc">দাম: বেশি থেকে কম</option>
      <option value="name">নাম অনুযায়ী</option>
    </select>
  );
}

export function SortSelect({ defaultValue }: { defaultValue: string }) {
  return (
    <Suspense
      fallback={
        <select
          aria-label="সাজান"
          defaultValue={defaultValue}
          disabled
          className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-400"
        >
          <option value="newest">নতুন পণ্য আগে</option>
        </select>
      }
    >
      <SortSelectInner defaultValue={defaultValue} />
    </Suspense>
  );
}
