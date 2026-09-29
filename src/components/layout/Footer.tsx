import React from "react";
import Link from "next/link";
import { ShieldCheck, Truck, Clock, RefreshCw, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Proposition Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-slate-800">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-900/60 border border-brand-700/50 flex items-center justify-center flex-shrink-0 text-brand-400">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">দ্রুত ডেলিভারি</h4>
              <p className="text-xs text-slate-400 mt-1">
                ঢাকার ভেতর ২৪-৪৮ ঘণ্টা, ঢাকার বাইরে ২-৪ দিনের মধ্যে ডেলিভারি।
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-900/60 border border-brand-700/50 flex items-center justify-center flex-shrink-0 text-brand-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">১০০% আসল পণ্য</h4>
              <p className="text-xs text-slate-400 mt-1">
                সরাসরি অনুমোদিত প্রস্তুতকারক থেকে সংগৃহীত খাঁটি পণ্য।
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-900/60 border border-brand-700/50 flex items-center justify-center flex-shrink-0 text-brand-400">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">নিরাপদ অগ্রিম পেমেন্ট</h4>
              <p className="text-xs text-slate-400 mt-1">
                bKash, Nagad, Rocket এবং কার্ডের মাধ্যমে সম্পূর্ণ সুরক্ষিত ট্রানজ্যাকশন।
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-900/60 border border-brand-700/50 flex items-center justify-center flex-shrink-0 text-brand-400">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">সহজ রিটার্ন পলিসি</h4>
              <p className="text-xs text-slate-400 mt-1">
                ত্রুটিপূর্ণ পণ্যে ৭ দিনের মধ্যে সহজ রিটার্ন ও সমাধান।
              </p>
            </div>
          </div>
        </div>

        {/* Links & Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 py-12 border-b border-slate-800 text-sm">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-700 flex items-center justify-center text-white font-bold font-bengali">
                আ
              </div>
              <span className="text-lg font-bold text-white">আমার দোকান</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              বাংলাদেশের বিশ্বস্ত অনলাইন শপিং প্ল্যাটফর্ম। সেরা মানের পণ্য সুলভ মূল্যে আপনার দোরগোড়ায় পৌঁছে দিতে আমরা প্রতিশ্রুতিবদ্ধ।
            </p>
            <div className="pt-2 text-xs space-y-2 text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-400 flex-shrink-0" />
                <span>ধানমন্ডি, ঢাকা - ১২০৯, বাংলাদেশ</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-400 flex-shrink-0" />
                <span>+880 1700-000000 (সকাল ৯টা - রাত ১০টা)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-400 flex-shrink-0" />
                <span>support@amardokan.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm">প্রয়োজনীয় লিংক</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/products" className="hover:text-white transition">
                  সকল পণ্য
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-white transition">
                  ক্যাটাগরি সমূহ
                </Link>
              </li>
              <li>
                <Link href="/orders/track" className="hover:text-white transition">
                  অর্ডার ট্র্যাক করুন
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-white transition">
                  আমার অ্যাকাউন্ট
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service & Policies */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm">গ্রাহক সেবা ও নীতি</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/terms" className="hover:text-white transition">
                  শর্তাবলী (Terms & Conditions)
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition">
                  গোপনীয়তা নীতি (Privacy Policy)
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-white transition">
                  রিফান্ড ও রিটার্ন নীতি
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-white transition">
                  ডেলিভারি তথ্য
                </Link>
              </li>
            </ul>
          </div>

          {/* Payment Methods */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-sm">অনুমোদিত পেমেন্ট মাধ্যম</h4>
            <p className="text-xs text-slate-400">
              আমরা ক্যাশ অন ডেলিভারি (COD) সমর্থন করি না। সকল অর্ডার সম্পূর্ণ নিরাপদ অগ্রিম পেমেন্টে সম্পন্ন হয়।
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="px-2.5 py-1 rounded bg-[#D12053] text-white font-bold text-xs tracking-wider">
                bKash
              </span>
              <span className="px-2.5 py-1 rounded bg-[#F7941D] text-white font-bold text-xs tracking-wider">
                Nagad
              </span>
              <span className="px-2.5 py-1 rounded bg-[#8C3494] text-white font-bold text-xs tracking-wider">
                Rocket
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold">
                Visa / Master
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Amar Dokan. সর্বস্বত্ব সংরক্ষিত।</p>
          <p className="flex items-center gap-1">
            <span>Powered by Secure Bangladesh Digital Commerce Engine</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
