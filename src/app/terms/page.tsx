import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata = {
  title: "শর্তাবলী | Amar Dokan",
  description: "আমার দোকানের ব্যবহারের শর্তাবলী ও নিয়মাবলী।",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-1 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700">আইনি তথ্য</span>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-1">শর্তাবলী (Terms & Conditions)</h1>
            <p className="text-sm text-slate-500 mt-2">সর্বশেষ আপডেট: সেপ্টেম্বর ২০২৬</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-8 text-sm text-slate-700 leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-base font-bold text-slate-900">১. সাধারণ শর্তাবলী</h2>
              <p>আমার দোকান ওয়েবসাইট ব্যবহার করে আপনি এই শর্তাবলী মেনে নিচ্ছেন বলে ধরে নেওয়া হবে। আপনি যদি এই শর্তাবলীর সাথে একমত না হন, তাহলে অনুগ্রহ করে আমাদের সেবা ব্যবহার করবেন না।</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-slate-900">২. অর্ডার ও পেমেন্ট</h2>
              <p>আমার দোকান সম্পূর্ণ প্রিপেইড মডেলে পরিচালিত হয়। ক্যাশ অন ডেলিভারি (COD) সম্পূর্ণরূপে অনুপলব্ধ। অর্ডার দেওয়ার পর bKash, Nagad, Rocket বা কার্ডের মাধ্যমে পেমেন্ট সম্পন্ন করতে হবে।</p>
              <p>পেমেন্ট সফল হওয়ার পর সার্ভার থেকে স্বাধীনভাবে যাচাই করা হয় এবং তারপরই অর্ডার কনফার্ম করা হয়।</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-slate-900">৩. পণ্যের মান ও বিবরণ</h2>
              <p>আমরা সর্বদা সঠিক পণ্যের বিবরণ ও ছবি প্রদানের চেষ্টা করি। তবে পণ্যের রঙ বা আকারে সামান্য পার্থক্য হতে পারে। কোনো সমস্যা হলে আমাদের সাথে যোগাযোগ করুন।</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-slate-900">৪. ডেলিভারি</h2>
              <p>পেমেন্ট কনফার্মেশনের পর ঢাকার ভেতরে ২৪-৪৮ ঘণ্টা এবং ঢাকার বাইরে ২-৪ কার্যদিবসের মধ্যে ডেলিভারির লক্ষ্য রাখা হয়। প্রাকৃতিক দুর্যোগ বা অন্যান্য কারণে বিলম্ব হতে পারে।</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-slate-900">৫. অ্যাকাউন্ট নিরাপত্তা</h2>
              <p>আপনার অ্যাকাউন্টের পাসওয়ার্ড গোপন রাখা আপনার দায়িত্ব। অ্যাকাউন্টে কোনো অননুমোদিত কার্যক্রম দেখলে অবিলম্বে আমাদের জানান।</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-slate-900">৬. পরিবর্তন</h2>
              <p>আমার দোকান যেকোনো সময় এই শর্তাবলী পরিবর্তন করার অধিকার রাখে। পরিবর্তনের পর সাইটে ব্যবহার অব্যাহত রাখলে নতুন শর্তাবলী মেনে নেওয়া বলে গণ্য হবে।</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-slate-900">৭. যোগাযোগ</h2>
              <p>যেকোনো প্রশ্নের জন্য: <span className="text-brand-700 font-medium">support@amardokan.com</span></p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
