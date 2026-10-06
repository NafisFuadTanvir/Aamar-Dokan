import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Truck, MapPin, Clock, Package } from "lucide-react";

export const metadata = {
  title: "ডেলিভারি তথ্য | Amar Dokan",
  description: "আমার দোকানের ডেলিভারি পলিসি, চার্জ এবং সময়সীমা।",
};

const deliveryZones = [
  {
    zone: "ঢাকা মেট্রোপলিটন",
    fee: "৳৭০",
    time: "২৪–৪৮ ঘণ্টা",
    areas: "ঢাকা সিটি কর্পোরেশনের সকল এলাকা",
  },
  {
    zone: "ঢাকার বাইরে (সারা বাংলাদেশ)",
    fee: "৳১৩০",
    time: "২–৪ কার্যদিবস",
    areas: "বাংলাদেশের সকল ৬৪ জেলা",
  },
];

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-1 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700">গ্রাহক সেবা</span>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-1">ডেলিভারি তথ্য</h1>
            <p className="text-sm text-slate-500 mt-2">সর্বশেষ আপডেট: সেপ্টেম্বর ২০২৬</p>
          </div>

          {/* Delivery zones */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {deliveryZones.map((z) => (
              <div key={z.zone} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center">
                    <Truck className="w-5 h-5" />
                  </div>
                  <h2 className="font-bold text-slate-900 text-sm">{z.zone}</h2>
                </div>
                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800">ডেলিভারি চার্জ:</span>
                    <span className="text-brand-700 font-bold text-sm">{z.fee}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{z.time}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                    <span>{z.areas}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-8 text-sm text-slate-700 leading-relaxed">
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-brand-700" />
                <h2 className="text-base font-bold text-slate-900">অর্ডার প্রসেসিং</h2>
              </div>
              <p>পেমেন্ট সফলভাবে যাচাই হওয়ার পর আমরা অর্ডার প্রক্রিয়া শুরু করি। সাধারণত পেমেন্ট কনফার্মেশনের ১২-২৪ ঘণ্টার মধ্যে প্যাকেজিং সম্পন্ন হয়।</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-slate-900">ডেলিভারি ট্র্যাকিং</h2>
              <p>অর্ডার ডেলিভারিতে দেওয়ার পর আপনি <strong>অর্ডার ট্র্যাক করুন</strong> পেজে অর্ডার নম্বর দিয়ে স্ট্যাটাস দেখতে পারবেন।</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-slate-900">বিশেষ পরিস্থিতি</h2>
              <ul className="list-disc list-inside space-y-2 text-slate-600 pl-2">
                <li>সরকারি ছুটি বা প্রাকৃতিক দুর্যোগের কারণে ডেলিভারি বিলম্ব হতে পারে</li>
                <li>প্রত্যন্ত অঞ্চলে অতিরিক্ত ১-২ দিন সময় লাগতে পারে</li>
                <li>বড় অর্ডারের ক্ষেত্রে আলাদাভাবে যোগাযোগ করা হবে</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-slate-900">ডেলিভারি না পেলে</h2>
              <p>ডেলিভারি সময়সীমার মধ্যে পণ্য না পেলে অনুগ্রহ করে আমাদের সাথে যোগাযোগ করুন:<br />
                📧 <span className="text-brand-700 font-medium">support@amardokan.com</span><br />
                📞 <span className="text-brand-700 font-medium">+880 1700-000000</span>
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
