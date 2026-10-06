import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata = {
  title: "গোপনীয়তা নীতি | Amar Dokan",
  description: "আমার দোকানের গোপনীয়তা নীতি — আমরা আপনার তথ্য কীভাবে সুরক্ষিত রাখি।",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-1 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700">আইনি তথ্য</span>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-1">গোপনীয়তা নীতি (Privacy Policy)</h1>
            <p className="text-sm text-slate-500 mt-2">সর্বশেষ আপডেট: সেপ্টেম্বর ২০২৬</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-8 text-sm text-slate-700 leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-base font-bold text-slate-900">১. আমরা কী তথ্য সংগ্রহ করি</h2>
              <p>আমরা শুধুমাত্র সেবা প্রদানের জন্য প্রয়োজনীয় তথ্য সংগ্রহ করি:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-600 pl-2">
                <li>নাম, ফোন নম্বর, ইমেইল ঠিকানা</li>
                <li>ডেলিভারি ঠিকানা</li>
                <li>অর্ডার ও পেমেন্ট ইতিহাস (পেমেন্ট কার্ড নম্বর কখনো সংরক্ষণ করা হয় না)</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-slate-900">২. তথ্য ব্যবহারের উদ্দেশ্য</h2>
              <p>সংগৃহীত তথ্য শুধুমাত্র নিম্নলিখিত কারণে ব্যবহৃত হয়:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-600 pl-2">
                <li>অর্ডার প্রক্রিয়াকরণ ও ডেলিভারি নিশ্চিত করতে</li>
                <li>পেমেন্ট যাচাই করতে</li>
                <li>গ্রাহক সেবা প্রদান করতে</li>
                <li>অর্ডার স্ট্যাটাস আপডেট পাঠাতে</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-slate-900">৩. তথ্যের সুরক্ষা</h2>
              <p>আপনার পাসওয়ার্ড Argon2id অ্যালগরিদম দিয়ে হ্যাশ করে সংরক্ষণ করা হয় — কখনো plaintext-এ নয়। পেমেন্ট তথ্য SSLCommerz-এর মাধ্যমে প্রক্রিয়া হয়, আমরা কোনো কার্ড বা পিন নম্বর সংরক্ষণ করি না।</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-slate-900">৪. তৃতীয় পক্ষের সাথে তথ্য শেয়ার</h2>
              <p>আমরা আপনার ব্যক্তিগত তথ্য কোনো তৃতীয় পক্ষের কাছে বিক্রি বা শেয়ার করি না। শুধুমাত্র ডেলিভারি পার্টনারের সাথে প্রয়োজনীয় ঠিকানা তথ্য শেয়ার করা হয়।</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-slate-900">৫. কুকিজ</h2>
              <p>আমরা সেশন ম্যানেজমেন্টের জন্য কুকিজ ব্যবহার করি। এটি আপনার লগইন অবস্থা বজায় রাখতে সাহায্য করে। আমরা কোনো ট্র্যাকিং বা বিজ্ঞাপনী কুকিজ ব্যবহার করি না।</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-slate-900">৬. আপনার অধিকার</h2>
              <p>আপনি যেকোনো সময় আপনার অ্যাকাউন্টের তথ্য আপডেট করতে পারেন। অ্যাকাউন্ট মুছে ফেলতে চাইলে আমাদের সাথে যোগাযোগ করুন।</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-slate-900">৭. যোগাযোগ</h2>
              <p>গোপনীয়তা সংক্রান্ত যেকোনো প্রশ্নের জন্য: <span className="text-brand-700 font-medium">support@amardokan.com</span></p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
