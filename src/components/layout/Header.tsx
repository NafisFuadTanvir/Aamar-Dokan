"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useSession } from "next-auth/react";
import {
  ShoppingBag,
  Search,
  User,
  Menu,
  X,
  PhoneCall,
  ShieldCheck,
  Truck,
  Leaf,
  ChevronRight,
} from "lucide-react";

export function Header() {
  const { totalItems, setIsOpen } = useCart();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);

  // First word of user name for display
  const displayName = session?.user?.name?.split(" ")[0] || null;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/97 shadow-[0_2px_24px_rgba(22,45,74,0.10)] backdrop-blur-xl border-b border-cream-200/80"
          : "bg-white border-b border-cream-200/60"
      }`}
    >
      {/* ── Top Trust Banner ────────────────────────────────────────────────── */}
      <div className="bg-navy-800 text-xs py-2 px-4 hidden sm:block overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Marquee strip */}
          <div className="flex items-center gap-7 text-navy-200 font-medium">
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <Truck className="w-3 h-3 text-saffron-400 flex-shrink-0" />
              সারাদেশে দ্রুত ও নিরাপদ ডেলিভারি
            </span>
            <span className="w-px h-3 bg-navy-600 flex-shrink-0" />
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <ShieldCheck className="w-3 h-3 text-herbal-400 flex-shrink-0" />
              ১০০% খাঁটি ও প্রাকৃতিক পণ্যের নিশ্চয়তা
            </span>
            <span className="w-px h-3 bg-navy-600 flex-shrink-0" />
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <Leaf className="w-3 h-3 text-herbal-400 flex-shrink-0" />
              অর্গানিক সার্টিফাইড হার্বাল পণ্য
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-saffron-300 whitespace-nowrap">
            <PhoneCall className="w-3 h-3 flex-shrink-0" />
            <span className="font-bold">হেল্পলাইন:</span>
            <span>+880 1700-000000</span>
          </div>
        </div>
      </div>

      {/* ── Main Navbar ─────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-navy-700 hover:bg-cream-100 transition"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* ── Logo ──────────────────────────────────────────────────────── */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0 group">
            {/* Icon mark */}
            <div className="relative w-11 h-11 rounded-2xl bg-navy-gradient flex items-center justify-center shadow-glow-navy group-hover:scale-105 transition-transform duration-300">
              <Leaf className="w-5 h-5 text-saffron-400" />
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-saffron-500 border-2 border-white flex items-center justify-center">
                <span className="text-[7px] text-white font-black">✓</span>
              </div>
            </div>
            {/* Wordmark */}
            <div className="flex flex-col leading-none">
              <span className="text-xl font-black tracking-tight text-navy-800 font-bengali">
                আমার দোকান
              </span>
              <span className="text-[9px] uppercase font-bold tracking-[0.15em] text-saffron-600 mt-0.5">
                Herbal &amp; Natural
              </span>
            </div>
          </Link>

          {/* ── Desktop Nav ──────────────────────────────────────────────── */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-semibold text-navy-700">
            {[
              { href: "/", label: "হোম" },
              { href: "/products", label: "সকল পণ্য" },
              { href: "/orders/track", label: "অর্ডার ট্র্যাক" },
              { href: "/about", label: "আমাদের কথা" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3.5 py-2 rounded-xl hover:bg-cream-100 hover:text-saffron-700 transition-all duration-200 whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* ── Search Bar ───────────────────────────────────────────────── */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-xs xl:max-w-sm relative"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="পণ্য বা ব্র্যান্ড খুঁজুন..."
              className="w-full bg-cream-100 border border-cream-300 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-navy-900 placeholder-navy-400 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-saffron-400/30 focus:border-saffron-400 transition-all duration-200"
            />
            <Search className="w-4 h-4 text-navy-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </form>

          {/* ── Right Actions ─────────────────────────────────────────────── */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Account */}
            <Link
              href="/account"
              className="hidden sm:flex p-2 sm:px-3 sm:py-2 rounded-xl text-navy-600 hover:bg-cream-100 hover:text-navy-800 items-center gap-1.5 transition-all font-semibold text-xs"
              aria-label="User Account"
            >
              <User className="w-4.5 h-4.5" />
              <span className="hidden sm:inline">
                {displayName ? displayName : "অ্যাকাউন্ট"}
              </span>
            </Link>

            {/* Cart */}
            <button
              onClick={() => setIsOpen(true)}
              className="relative flex items-center gap-2 px-3.5 py-2.5 rounded-2xl btn-saffron text-xs font-bold transition-all duration-200 shadow-md active:scale-[0.97]"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">ব্যাগ</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 min-w-[20px] h-5 rounded-full bg-navy-800 text-white text-[10px] font-black flex items-center justify-center px-1 shadow-sm border-2 border-white">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="pb-3 md:hidden">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="পণ্য খুঁজুন..."
              className="w-full bg-cream-100 border border-cream-200 rounded-2xl pl-9 pr-4 py-2.5 text-xs text-navy-900 placeholder-navy-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-saffron-400/25 focus:border-saffron-400 transition"
            />
            <Search className="w-3.5 h-3.5 text-navy-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </form>
        </div>
      </div>

      {/* ── Mobile Menu Drawer ───────────────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-cream-200 bg-white shadow-xl px-4 pt-4 pb-6 space-y-1 animate-rise-in">
          <nav className="flex flex-col space-y-0.5">
            {[
              { href: "/", label: "হোম" },
              { href: "/products", label: "সকল পণ্য" },
              { href: "/orders/track", label: "অর্ডার ট্র্যাক" },
              { href: "/about", label: "আমাদের কথা" },
              { href: "/account", label: "আমার অ্যাকাউন্ট" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-navy-700 hover:bg-cream-100 hover:text-saffron-700 transition group"
              >
                <span>{link.label}</span>
                <ChevronRight className="w-4 h-4 text-navy-300 group-hover:text-saffron-500 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ))}
          </nav>

          {/* Trust badges in mobile menu */}
          <div className="pt-4 mt-4 border-t border-cream-200 grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 bg-cream-100 rounded-xl px-3 py-2">
              <ShieldCheck className="w-4 h-4 text-herbal-600 flex-shrink-0" />
              <span className="text-xs text-navy-700 font-medium">১০০% আসল পণ্য</span>
            </div>
            <div className="flex items-center gap-2 bg-cream-100 rounded-xl px-3 py-2">
              <Truck className="w-4 h-4 text-saffron-600 flex-shrink-0" />
              <span className="text-xs text-navy-700 font-medium">দ্রুত ডেলিভারি</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
