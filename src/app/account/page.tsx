import React from "react";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
import { db } from "@/lib/db";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { formatPrice } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Package, LogOut, Phone, Mail, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default async function AccountPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/login");
  }

  const userId = (session.user as any).id;
  const userRole = (session.user as any).role;

  let orders: any[] = [];
  try {
    orders = await db.order.findMany({
      where: {
        OR: [
          { userId },
          ...(session.user.email ? [{ customerEmail: session.user.email }] : []),
        ],
      },
      include: {
        items: true,
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (e) {
    // DB fallback
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-slate-200">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700">
              ড্যাশবোর্ড
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 font-bengali">
              আমার অ্যাকাউন্ট
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              স্বাগতম, {session.user.name || "সম্মানিত গ্রাহক"}!
            </p>
          </div>

          <div className="flex items-center gap-3">
            {userRole === "ADMIN" && (
              <Link href="/admin">
                <Button variant="gold" size="sm" className="gap-1.5 font-bold">
                  <ShieldAlert className="w-4 h-4" />
                  <span>অ্যাডমিন প্যানেল</span>
                </Button>
              </Link>
            )}

            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <Button
                variant="outline"
                size="sm"
                type="submit"
                className="gap-1.5 text-red-600 border-red-200 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                <span>লগআউট</span>
              </Button>
            </form>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8">
          {/* Profile Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 h-fit">
            <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center font-bold text-xl">
              <User className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900">
                {session.user.name || "ব্যবহারকারী"}
              </h2>
              <span className="inline-block mt-1">
                <Badge variant={userRole === "ADMIN" ? "warning" : "default"}>
                  {userRole}
                </Badge>
              </span>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs text-slate-600">
              {session.user.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span>{session.user.email}</span>
                </div>
              )}
            </div>
          </div>

          {/* Order History */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-brand-700" />
              <span>পূর্ববর্তী অর্ডারসমূহ ({orders.length})</span>
            </h2>

            {orders.length === 0 ? (
              <div className="p-10 bg-white rounded-3xl border border-slate-200/80 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Package className="w-6 h-6" />
                </div>
                <p className="text-slate-700 font-semibold text-sm">
                  কোনো অর্ডার পাওয়া যায়নি
                </p>
                <p className="text-xs text-slate-400">
                  এখনও কোনো পণ্য অর্ডার করেননি। নতুন পণ্য দেখুন!
                </p>
                <Link href="/products" className="inline-block pt-2">
                  <Button variant="primary" size="sm">
                    পণ্যসমূহ ব্রাউজ করুন
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((o) => (
                  <div
                    key={o.id}
                    className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-sm space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 text-xs">
                      <div>
                        <span className="text-slate-400">অর্ডার নম্বর:</span>{" "}
                        <span className="font-bold text-slate-800">
                          {o.orderNumber}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={o.paymentStatus === "PAID" ? "success" : "warning"}
                        >
                          {o.paymentStatus}
                        </Badge>
                        <Badge variant="info">{o.orderStatus}</Badge>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600">
                      {o.items.map((it: any) => (
                        <div key={it.id} className="flex justify-between">
                          <span>
                            {it.productNameSnapshot} {it.variantSnapshot ? `[${it.variantSnapshot}]` : ""} × {it.quantity}
                          </span>
                          <span className="font-semibold text-slate-900">
                            {formatPrice(it.lineTotalPoisha)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500">
                        {new Date(o.createdAt).toLocaleDateString("en-BD")}
                      </span>
                      <div className="text-sm font-bold text-brand-700">
                        মোট: {formatPrice(o.totalPoisha)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
