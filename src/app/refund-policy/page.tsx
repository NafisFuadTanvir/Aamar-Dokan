import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata = {
  title: "রিফান্ড ও রিটার্ন নীতি | Amar Dokan",
  description: "আমার দোকানের রিফান্ড এবং রিটার্ন নীতি বিস্তারিত।",
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-1 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700">গ্রাহক সেবা</span>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-1">রিফান্ড ও রিটার্ন নীতি</h1>
            <p className="text-sm text-slate-500 mt-2">সর্বশেষ আপডেট: সেপ্টেম্বর ২০২৬</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-8 text-sm text-slate-700 leading-relaxed">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-medium">
              ✅ আমার দোকান গ্রাহকের সন্তুষ্টি নিশ্চিত করতে প্রতিশ্রুতিবদ্ধ। ত্রুটিপূর্ণ পণ্যের ক্ষেত্রে আমরা সম্পূর্ণ সহায়তা করব।
            </div>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-slate-900">রিটার্নযোগ্য ক্ষেত্রসমূহ</h2>
              <ul className="list-disc list-inside space-y-2 text-slate-600 pl-2">
                <li>ত্রুটিপূর্ণ বা ভাঙা পণ্য পাওয়া গেলে (ডেলিভারির ৭ দিনের মধ্যে)</li>
                <li>অর্ডার করা পণ্যের বদলে ভুল পণ্য ডেলিভারি হলে</li>
                <li>পণ্যের মান বিবরণের সাথে সম্পূর্ণ অমিল হলে</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-slate-900">রিটার্ন করা যাবে না যদি</h2>
              <ul className="list-disc list-inside space-y-2 text-slate-600 pl-2">
                <li>পণ্য একবার ব্যবহার করা হয়ে থাকলে (খাদ্যপণ্য ও প্রসাধনী)</li>
                <li>পণ্যের প্যাকেজিং নষ্ট বা খোলা হয়ে থাকলে (শুধুমাত্র খাদ্যপণ্য)</li>
                <li>ডেলিভারির ৭ দিনের বেশি সময় পার হয়ে থাকলে</li>
                <li>গ্রাহকের ভুলে পণ্য নষ্ট হলে</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-slate-900">রিটার্ন প্রক্রিয়া</h2>
              <ol className="list-decimal list-inside space-y-2 text-slate-600 pl-2">
                <li>পণ্যটির ছবি সহ আমাদের ইমেইলে (support@amardokan.com) যোগাযোগ করুন</li>
                <li>অর্ডার নম্বর এবং সমস্যার বিবরণ জানান</li>
                <li>আমাদের টিম ২৪ ঘণ্টার মধ্যে যোগাযোগ করবে</li>
                <li>যাচাইয়ের পর পণ্য পিক আপ বা পাঠানোর ব্যবস্থা করা হবে</li>
              </ol>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-slate-900">রিফান্ড প্রক্রিয়া</h2>
              <p>রিটার্ন যাচাই হওয়ার পর ৩-৫ কার্যদিবসের মধ্যে আপনার পেমেন্ট পদ্ধতিতে (bKash/Nagad/Rocket/কার্ড) রিফান্ড প্রদান করা হবে।</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-slate-900">যোগাযোগ</h2>
              <p>রিটার্ন ও রিফান্ড সংক্রান্ত যেকোনো প্রশ্নের জন্য:<br />
                📧 <span className="text-brand-700 font-medium">support@amardokan.com</span><br />
                📞 <span className="text-brand-700 font-medium">+880 1700-000000</span> (সকাল ৯টা — রাত ১০টা)
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
