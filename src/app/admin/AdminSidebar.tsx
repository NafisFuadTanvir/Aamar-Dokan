"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Send,
  Sliders,
  LogOut,
  Store,
  ShieldCheck,
  ShieldAlert,
  Users,
  Tag,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "ওভারভিউ", icon: LayoutDashboard, color: "text-gold-400" },
  { href: "/admin/products", label: "পণ্য ও ইনভেন্টরি", icon: Package, color: "text-emerald-400" },
  { href: "/admin/orders", label: "অর্ডার ও পেমেন্ট", icon: ShoppingBag, color: "text-blue-400" },
  { href: "/admin/customers", label: "গ্রাহক তালিকা", icon: Users, color: "text-amber-400" },
  { href: "/admin/referrals", label: "রেফারেল কোড", icon: Tag, color: "text-gold-400" },
  { href: "/admin/fraud-watch", label: "ফ্রড ওয়াচ", icon: ShieldAlert, color: "text-red-400" },
  { href: "/admin/notifications", label: "টেলিগ্রাম আউটবক্স", icon: Send, color: "text-cyan-400" },
  { href: "/admin/settings", label: "স্টোর ও সিস্টেম সেটিংস", icon: Sliders, color: "text-purple-400" },
];

interface AdminSidebarProps {
  userName: string | null | undefined;
  onSignOut?: () => Promise<void>;
}

export function AdminSidebar({ userName, onSignOut }: AdminSidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Close sidebar when route changes (mobile nav)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const SidebarContent = () => (
    <>
      {/* Brand */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gold-500 text-slate-950 flex items-center justify-center font-bold font-bengali flex-shrink-0">
            আ
          </div>
          <div>
            <h2 className="font-bold text-sm text-white">অ্যাডমিন ড্যাশবোর্ড</h2>
            <span className="text-[10px] text-slate-400">Amar Dokan Manager</span>
          </div>
        </div>
        {/* Close button — mobile only */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 text-xs font-semibold overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon, color }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
              isActive(href)
                ? "bg-slate-800 text-white"
                : "hover:bg-slate-800/80 hover:text-white text-slate-300"
            }`}
          >
            <Icon className={`w-4 h-4 ${color} flex-shrink-0`} />
            <span>{label}</span>
            {isActive(href) && (
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-gold-400 flex-shrink-0" />
            )}
          </Link>
        ))}

        <div className="pt-4 mt-4 border-t border-slate-800">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
          >
            <Store className="w-4 h-4 flex-shrink-0" />
            <span>স্টোরফ্রন্ট দেখুন ↗</span>
          </Link>
        </div>
      </nav>

      {/* User bar & Logout */}
      <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 truncate pr-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span className="truncate text-slate-300">{userName || "অ্যাডমিন"}</span>
        </div>
        {onSignOut ? (
          <form action={onSignOut}>
            <button
              type="submit"
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition"
              title="লগআউট"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition"
              title="লগআউট"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* ── Mobile Top Bar ─────────────────────────────────────────────────── */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
            aria-label="মেনু খুলুন"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gold-500 text-slate-950 flex items-center justify-center font-bold text-xs font-bengali">
              আ
            </div>
            <span className="font-bold text-sm text-white">অ্যাডমিন</span>
          </div>
        </div>
        {/* Active page label */}
        <span className="text-xs text-slate-400 truncate max-w-[140px]">
          {navItems.find((n) => isActive(n.href))?.label ?? ""}
        </span>
      </header>

      {/* ── Mobile Backdrop ────────────────────────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Mobile Drawer Sidebar ──────────────────────────────────────────── */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-slate-950 border-r border-slate-800 flex flex-col transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </aside>

      {/* ── Desktop Static Sidebar ─────────────────────────────────────────── */}
      <aside className="hidden lg:flex w-64 bg-slate-950 border-r border-slate-800 flex-col flex-shrink-0 h-screen sticky top-0">
        <SidebarContent />
      </aside>
    </>
  );
}