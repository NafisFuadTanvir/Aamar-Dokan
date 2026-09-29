"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import {
  ShoppingBag,
  Search,
  User,
  Menu,
  X,
  PhoneCall,
  ShieldCheck,
  Truck,
} from "lucide-react";

export function Header() {
  const { totalItems, setIsOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(
        searchQuery.trim()
      )}`;
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      {/* Top Banner */}
      <div className="bg-brand-900 text-brand-100 text-xs py-1.5 px-4 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-gold-400" />
              <span>সারাদেশে দ্রুত ও নিরাপদ ডেলিভারি</span>
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
              <span>১০০% আসল ও মানসম্মত পণ্য</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-brand-200">
              <PhoneCall className="w-3 h-3 text-gold-400" />
              <span>হেল্পলাইন: +880 1700-000000</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-700 to-brand-900 flex items-center justify-center text-white shadow-md shadow-brand-900/20">
              <span className="text-xl font-bold font-bengali">আ</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-slate-900 font-bengali">
                আমার দোকান
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-brand-700 -mt-1">
                Amar Dokan
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-700">
            <Link
              href="/"
              className="hover:text-brand-700 transition duration-150"
            >
              হোম
            </Link>
            <Link
              href="/products"
              className="hover:text-brand-700 transition duration-150"
            >
              সকল পণ্য
            </Link>
            <Link
              href="/categories"
              className="hover:text-brand-700 transition duration-150"
            >
              ক্যাটাগরি
            </Link>
            <Link
              href="/orders/track"
              className="hover:text-brand-700 transition duration-150"
            >
              অর্ডার ট্র্যাকিং
            </Link>
            <Link
              href="/about"
              className="hover:text-brand-700 transition duration-150"
            >
              আমাদের সম্পর্কে
            </Link>
          </nav>

          {/* Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-xs xl:max-w-sm relative"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="পণ্য বা ব্র্যান্ড খুঁজুন..."
              className="w-full bg-slate-100/90 border border-slate-200 rounded-full pl-10 pr-4 py-2 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-700/20 focus:border-brand-700 transition"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </form>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Account Link */}
            <Link
              href="/account"
              className="p-2 sm:px-3 sm:py-2 rounded-xl text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 transition"
              aria-label="User Account"
            >
              <User className="w-5 h-5 text-slate-600" />
              <span className="hidden sm:inline text-xs font-semibold">
                অ্যাকাউন্ট
              </span>
            </Link>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsOpen(true)}
              className="relative p-2 sm:px-3.5 sm:py-2 rounded-xl bg-brand-50 text-brand-800 hover:bg-brand-100 border border-brand-200/60 flex items-center gap-2 transition"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 text-brand-700" />
              <span className="hidden sm:inline text-xs font-bold">ব্যাগ</span>
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 rounded-full bg-brand-700 text-white text-[11px] font-bold flex items-center justify-center px-1 shadow-sm">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="pb-3 md:hidden">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="পণ্য খুঁজুন..."
              className="w-full bg-slate-100 border border-slate-200 rounded-full pl-9 pr-4 py-2 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-700/20 focus:border-brand-700"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </form>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-2 text-sm font-semibold text-slate-800">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-100"
            >
              হোম
            </Link>
            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-100"
            >
              সকল পণ্য
            </Link>
            <Link
              href="/categories"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-100"
            >
              ক্যাটাগরি
            </Link>
            <Link
              href="/orders/track"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-100"
            >
              অর্ডার ট্র্যাকিং
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-100"
            >
              আমাদের সম্পর্কে
            </Link>
            <Link
              href="/account"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-100 text-brand-700"
            >
              আমার অ্যাকাউন্ট
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
