"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  X,
  Loader2,
  Sparkles,
  ArrowRight,
  Leaf,
  Layers,
  History,
} from "lucide-react";
import { formatBengaliPrice } from "@/lib/format";

interface SearchProduct {
  id: string;
  name: string;
  slug: string;
  pricePoisha: string;
  compareAtPricePoisha?: string | null;
  stockQuantity: number;
  hasVariants?: boolean;
  categoryName?: string | null;
  categorySlug?: string | null;
  imageId?: string | null;
}

interface SearchCategory {
  id: string;
  name: string;
  slug: string;
}

interface SearchResponse {
  query: string;
  detectedType: "bangla" | "banglish" | "english" | "mixed";
  primaryHint?: {
    bangla?: string;
    english?: string;
    banglish?: string;
  };
  expandedTerms: string[];
  categories: SearchCategory[];
  products: SearchProduct[];
  totalMatches: number;
}

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  isMobile?: boolean;
  onSelectAction?: () => void;
}

const POPULAR_SUGGESTIONS = [
  { label: "মধু (Honey)", query: "মধু" },
  { label: "সরিষার তেল (Mustard Oil)", query: "সরিষা" },
  { label: "কালোজিরা (Black Seed)", query: "কালোজিরা" },
  { label: "নকশিকাঁথা (Kantha)", query: "নকশিকাঁথা" },
  { label: "খাঁটি ঘি (Ghee)", query: "ঘি" },
  { label: "অর্গানিক", query: "organic" },
];

export function SearchBar({
  placeholder = "পণ্য বা ব্র্যান্ড খুঁজুন (বাংলা, Banglish, English)...",
  className = "",
  isMobile = false,
  onSelectAction,
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch search results with debounce
  const fetchResults = useCallback(async (searchQuery: string) => {
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      setResults(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(trimmed)}&limit=6`
      );
      if (res.ok) {
        const data: SearchResponse = await res.json();
        setResults(data);
      }
    } catch (err) {
      console.error("Search fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setSelectedIndex(-1);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!val.trim()) {
      setResults(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceTimerRef.current = setTimeout(() => {
      fetchResults(val);
    }, 220);
  };

  const handleClear = () => {
    setQuery("");
    setResults(null);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const submitSearch = (targetQuery?: string) => {
    const q = (targetQuery ?? query).trim();
    if (!q) return;
    setIsOpen(false);
    if (onSelectAction) onSelectAction();
    router.push(`/products?search=${encodeURIComponent(q)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setIsOpen(true);
      }
      return;
    }

    const products = results?.products || [];

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < products.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > -1 ? prev - 1 : -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && products[selectedIndex]) {
        // Navigate to selected product
        const selected = products[selectedIndex];
        setIsOpen(false);
        if (onSelectAction) onSelectAction();
        router.push(`/products/${selected.slug}`);
      } else {
        submitSearch();
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleSuggestionClick = (suggestionText: string) => {
    setQuery(suggestionText);
    submitSearch(suggestionText);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* ── Search Input Box ────────────────────────────────────────── */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitSearch();
        }}
        className="relative flex items-center w-full"
      >
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label="Search products"
          autoComplete="off"
          className={`w-full bg-cream-100/90 border border-cream-300 rounded-2xl pl-10 text-xs text-navy-900 placeholder-navy-400 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-saffron-400/35 focus:border-saffron-400 transition-all duration-200 ${
            isMobile ? "py-2.5 pr-9 text-xs" : "py-2.5 pr-10 text-xs"
          }`}
        />

        {/* Left Search Icon */}
        <Search
          className={`text-navy-400 absolute left-3.5 pointer-events-none transition-colors ${
            isMobile ? "w-3.5 h-3.5" : "w-4 h-4"
          }`}
        />

        {/* Right Status / Actions */}
        <div className="absolute right-3 flex items-center gap-1.5">
          {loading && (
            <Loader2 className="w-3.5 h-3.5 text-saffron-600 animate-spin" />
          )}

          {query && !loading && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-full text-navy-400 hover:text-navy-700 hover:bg-cream-200/80 transition"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </form>

      {/* ── Dropdown Suggestions & Results ───────────────────────────── */}
      {isOpen && (
        <div
          className={`absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-cream-200 z-50 overflow-hidden animate-rise-in ${
            isMobile ? "max-h-[75vh]" : "max-h-[500px]"
          } flex flex-col`}
        >
          {/* Case 1: Initial focus with empty input — Popular Searches */}
          {!query.trim() && (
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-navy-400 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-saffron-500" />
                জনপ্রিয় ও ট্রেন্ডিং অনুসন্ধান
              </div>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_SUGGESTIONS.map((item) => (
                  <button
                    key={item.query}
                    type="button"
                    onClick={() => handleSuggestionClick(item.query)}
                    className="px-2.5 py-1.5 rounded-xl bg-cream-50 hover:bg-saffron-50 border border-cream-200 text-xs font-semibold text-navy-700 hover:text-saffron-800 hover:border-saffron-300 transition duration-150"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <div className="pt-2 border-t border-cream-100 text-[11px] text-navy-400 flex items-center gap-1.5">
                <span>💡 আপনি বাংলা (মধু), Banglish (modhu), বা English (honey) যেকোনো ভাষায় খুঁজতে পারেন।</span>
              </div>
            </div>
          )}

          {/* Case 2: Query entered and results available */}
          {query.trim() && results && (
            <div className="overflow-y-auto divide-y divide-cream-100">
              {/* Translation & Expansion Hint */}
              {results.primaryHint && (
                <div className="px-4 py-2.5 bg-gradient-to-r from-cream-50 via-saffron-50/40 to-cream-50 flex items-center justify-between text-xs text-navy-700">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-saffron-600 flex-shrink-0" />
                    <span>
                      <span className="font-bold text-navy-800">
                        {results.primaryHint.bangla}
                      </span>{" "}
                      •{" "}
                      <span className="text-navy-600">
                        {results.primaryHint.english}
                      </span>
                    </span>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-saffron-700 bg-saffron-100/80 px-2 py-0.5 rounded-full">
                    বহুভাষিক মিল
                  </span>
                </div>
              )}

              {/* Related Keyword Chips */}
              {results.expandedTerms && results.expandedTerms.length > 1 && (
                <div className="px-4 py-2 bg-white flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  <span className="text-[10px] font-bold text-navy-400 uppercase tracking-wider flex-shrink-0">
                    সম্পর্কিত:
                  </span>
                  {results.expandedTerms.slice(0, 4).map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => handleSuggestionClick(term)}
                      className="px-2 py-0.5 rounded-lg text-[11px] font-medium bg-cream-100 hover:bg-cream-200 text-navy-700 flex-shrink-0 transition"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              )}

              {/* Categories Matches */}
              {results.categories && results.categories.length > 0 && (
                <div className="px-4 py-2 bg-cream-50/50 flex items-center gap-2 flex-wrap">
                  <Layers className="w-3 h-3 text-navy-400 flex-shrink-0" />
                  <span className="text-[11px] font-bold text-navy-500">
                    ক্যাটাগরি:
                  </span>
                  {results.categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/categories/${cat.slug}`}
                      onClick={() => {
                        setIsOpen(false);
                        if (onSelectAction) onSelectAction();
                      }}
                      className="text-xs font-bold text-saffron-700 hover:underline"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}

              {/* Products List */}
              {results.products.length > 0 ? (
                <div className="py-1">
                  <div className="px-4 py-1.5 text-[10px] font-bold text-navy-400 uppercase tracking-wider">
                    পণ্যসমূহ ({results.totalMatches}টি পাওয়া গেছে)
                  </div>
                  {results.products.map((product, idx) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      onClick={() => {
                        setIsOpen(false);
                        if (onSelectAction) onSelectAction();
                      }}
                      className={`flex items-center gap-3 px-4 py-2.5 transition duration-150 ${
                        selectedIndex === idx
                          ? "bg-saffron-50 text-navy-900"
                          : "hover:bg-cream-50/80 text-navy-800"
                      }`}
                    >
                      {/* Product Thumbnail */}
                      <div className="w-10 h-10 rounded-xl bg-cream-100 border border-cream-200 flex-shrink-0 overflow-hidden flex items-center justify-center">
                        {product.imageId ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={`/api/images/${product.imageId}`}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Leaf className="w-4 h-4 text-cream-400" />
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-navy-900 truncate">
                          {product.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-black text-saffron-700">
                            {formatBengaliPrice(product.pricePoisha)}
                          </span>
                          {product.categoryName && (
                            <span className="text-[10px] text-navy-400 truncate">
                              • {product.categoryName}
                            </span>
                          )}
                          {product.stockQuantity <= 0 && (
                            <span className="text-[9px] font-bold text-red-500 bg-red-50 px-1.5 py-0.2 rounded">
                              স্টক শেষ
                            </span>
                          )}
                        </div>
                      </div>

                      <ArrowRight className="w-3.5 h-3.5 text-navy-300 flex-shrink-0" />
                    </Link>
                  ))}
                </div>
              ) : (
                /* No products found */
                <div className="p-6 text-center space-y-2">
                  <p className="text-xs font-bold text-navy-800">
                    কোনো পণ্য পাওয়া যায়নি
                  </p>
                  <p className="text-[11px] text-navy-500 max-w-xs mx-auto">
                    &quot;{query}&quot; এর পরিবর্তে বাংলা, Banglish বা ইংরেজিতে লিখে
                    দেখুন (যেমন: মধু, modhu, honey, সরিষা, nakshi kantha)।
                  </p>
                </div>
              )}

              {/* View All Matches Footer */}
              {results.products.length > 0 && (
                <div className="p-2.5 bg-cream-50 border-t border-cream-100 flex items-center justify-between">
                  <span className="text-[11px] text-navy-500">
                    মোট {results.totalMatches}টি ফলাফল
                  </span>
                  <button
                    type="button"
                    onClick={() => submitSearch()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl btn-saffron text-xs font-bold shadow-sm"
                  >
                    সকল ফলাফল দেখুন
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
