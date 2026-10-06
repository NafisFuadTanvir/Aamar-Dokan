"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format";
import {
  Users,
  Search,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  Calendar,
  ExternalLink,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

export interface SerializedCustomer {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  role: string;
  status: string;
  createdAt: string;
  lastLoginAt: string | null;
  ordersCount: number;
  totalSpentPoisha: string;
  addresses: Array<{
    id: string;
    recipientName: string;
    phone: string;
    addressLine: string;
    areaOrThana: string;
    district: string;
  }>;
}

interface CustomerListClientProps {
  initialCustomers: SerializedCustomer[];
}

export function CustomerListClient({ initialCustomers }: CustomerListClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"ALL" | "CUSTOMER" | "ADMIN">("ALL");

  const filteredCustomers = useMemo(() => {
    return initialCustomers.filter((c) => {
      if (roleFilter !== "ALL" && c.role !== roleFilter) {
        return false;
      }
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const matchName = c.name?.toLowerCase().includes(q);
      const matchEmail = c.email?.toLowerCase().includes(q);
      const matchPhone = c.phone?.toLowerCase().includes(q);
      const matchAddress = c.addresses.some(
        (a) =>
          a.district.toLowerCase().includes(q) ||
          a.areaOrThana.toLowerCase().includes(q) ||
          a.addressLine.toLowerCase().includes(q)
      );

      return matchName || matchEmail || matchPhone || matchAddress;
    });
  }, [initialCustomers, searchQuery, roleFilter]);

  const totalCustomers = initialCustomers.length;
  const activeCustomers = initialCustomers.filter((c) => c.status === "ACTIVE").length;
  const customersWithOrders = initialCustomers.filter((c) => c.ordersCount > 0).length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-bengali">
            গ্রাহক ও ব্যবহারকারী তালিকা
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            যাঁরা ওয়েবসাইটে অ্যাকাউন্ট তৈরি করেছেন তাদের পূর্ণাঙ্গ তথ্য ও অর্ডার হিস্ট্রি
          </p>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">মোট নিবন্ধিত ব্যবহারকারী</span>
            <div className="text-2xl font-bold text-white mt-1">{totalCustomers}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">সক্রিয় অ্যাকাউন্ট</span>
            <div className="text-2xl font-bold text-emerald-400 mt-1">{activeCustomers}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">অর্ডার সম্পন্নকারী গ্রাহক</span>
            <div className="text-2xl font-bold text-blue-400 mt-1">{customersWithOrders}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="নাম, মোবাইল নম্বর, ইমেইল বা জেলা দিয়ে গ্রাহক খুঁজুন..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-gold-500"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setRoleFilter("ALL")}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition ${
              roleFilter === "ALL"
                ? "bg-gold-500 text-slate-950 font-bold"
                : "bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            সকল
          </button>
          <button
            type="button"
            onClick={() => setRoleFilter("CUSTOMER")}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition ${
              roleFilter === "CUSTOMER"
                ? "bg-gold-500 text-slate-950 font-bold"
                : "bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            সাধারণ গ্রাহক
          </button>
          <button
            type="button"
            onClick={() => setRoleFilter("ADMIN")}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition ${
              roleFilter === "ADMIN"
                ? "bg-gold-500 text-slate-950 font-bold"
                : "bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            অ্যাডমিন
          </button>
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden">
        {filteredCustomers.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Users className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-300">
              কোনো গ্রাহক তথ্য পাওয়া যায়নি
            </p>
            <p className="text-xs text-slate-500">
              অনুসন্ধানের শর্ত পরিবর্তন করে আবার চেষ্টা করুন।
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-4">গ্রাহকের নাম</th>
                  <th className="p-4">যোগাযোগ</th>
                  <th className="p-4">ঠিকানা</th>
                  <th className="p-4">মোট অর্ডার</th>
                  <th className="p-4">মোট কেনাকাটা</th>
                  <th className="p-4">রেজিস্ট্রেশন</th>
                  <th className="p-4">স্ট্যাটাস</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredCustomers.map((c) => {
                  const defaultAddr = c.addresses[0];
                  return (
                    <tr key={c.id} className="hover:bg-slate-900/40">
                      {/* Name */}
                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-slate-800 text-gold-400 font-bold flex items-center justify-center flex-shrink-0 text-xs">
                            {c.name ? c.name.charAt(0).toUpperCase() : "G"}
                          </div>
                          <div>
                            <div className="font-semibold text-white flex items-center gap-1.5">
                              <span>{c.name || "নামহীন গ্রাহক"}</span>
                              {c.role === "ADMIN" && (
                                <Badge variant="warning" className="text-[10px] py-0 px-1.5">
                                  ADMIN
                                </Badge>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono">
                              ID: {c.id.slice(0, 10)}...
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="p-4 space-y-1">
                        {c.phone ? (
                          <div className="flex items-center gap-1.5 text-slate-300">
                            <Phone className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                            <span className="font-mono">{c.phone}</span>
                          </div>
                        ) : null}
                        {c.email ? (
                          <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                            <Mail className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                            <span className="truncate max-w-[170px]">{c.email}</span>
                          </div>
                        ) : (
                          <span className="text-slate-500 text-[11px]">ইমেইল দেওয়া হয়নি</span>
                        )}
                      </td>

                      {/* Address */}
                      <td className="p-4 text-slate-400 max-w-[200px]">
                        {defaultAddr ? (
                          <div className="flex items-start gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                            <span className="text-[11px] leading-tight">
                              {defaultAddr.district}, {defaultAddr.areaOrThana}
                              {defaultAddr.addressLine ? ` (${defaultAddr.addressLine})` : ""}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-500 text-[11px]">সংরক্ষিত ঠিকানা নেই</span>
                        )}
                      </td>

                      {/* Orders Count */}
                      <td className="p-4 font-semibold">
                        {c.ordersCount > 0 ? (
                          <span className="inline-flex items-center gap-1 text-emerald-400">
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>{c.ordersCount} টি অর্ডার</span>
                          </span>
                        ) : (
                          <span className="text-slate-500">কোনো অর্ডার নেই</span>
                        )}
                      </td>

                      {/* Total Spent */}
                      <td className="p-4 font-bold text-white">
                        {formatPrice(BigInt(c.totalSpentPoisha))}
                      </td>

                      {/* Created At */}
                      <td className="p-4 text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          <span>
                            {new Date(c.createdAt).toLocaleDateString("bn-BD", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <Badge
                          variant={c.status === "ACTIVE" ? "success" : "danger"}
                        >
                          {c.status}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
