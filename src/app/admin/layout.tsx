import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Send,
  Sliders,
  LogOut,
  Store,
  ShieldCheck,
} from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Strict Server-Side Role Enforcement
  if (!session || !session.user || (session.user as any).role !== "ADMIN") {
    redirect("/login?callbackUrl=/admin");
  }

  return (
    <div className="min-h-screen flex bg-slate-900 text-slate-100">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col flex-shrink-0">
        {/* Brand */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gold-500 text-slate-950 flex items-center justify-center font-bold font-bengali">
              আ
            </div>
            <div>
              <h2 className="font-bold text-sm text-white">অ্যাডমিন ড্যাশবোর্ড</h2>
              <span className="text-[10px] text-slate-400">Amar Dokan Manager</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1.5 text-xs font-semibold">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-slate-800/80 hover:text-white text-slate-300 transition"
          >
            <LayoutDashboard className="w-4 h-4 text-gold-400" />
            <span>ওভারভিউ</span>
          </Link>

          <Link
            href="/admin/products"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-slate-800/80 hover:text-white text-slate-300 transition"
          >
            <Package className="w-4 h-4 text-emerald-400" />
            <span>পণ্য ও ইনভেন্টরি</span>
          </Link>

          <Link
            href="/admin/orders"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-slate-800/80 hover:text-white text-slate-300 transition"
          >
            <ShoppingBag className="w-4 h-4 text-blue-400" />
            <span>অর্ডার ও পেমেন্ট</span>
          </Link>

          <Link
            href="/admin/notifications"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-slate-800/80 hover:text-white text-slate-300 transition"
          >
            <Send className="w-4 h-4 text-cyan-400" />
            <span>টেলিগ্রাম আউটবক্স</span>
          </Link>

          <Link
            href="/admin/settings"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-slate-800/80 hover:text-white text-slate-300 transition"
          >
            <Sliders className="w-4 h-4 text-purple-400" />
            <span>স্টোর ও সিস্টেম সেটিংস</span>
          </Link>

          <div className="pt-4 mt-4 border-t border-slate-800">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
            >
              <Store className="w-4 h-4" />
              <span>স্টোরফ্রন্ট দেখুন ↗</span>
            </Link>
          </div>
        </nav>

        {/* User bar & Logout */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 truncate pr-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span className="truncate text-slate-300">
              {session.user.name || "অ্যাডমিন"}
            </span>
          </div>

          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition"
              title="লগআউট"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </form>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto bg-slate-900 min-h-screen">
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
