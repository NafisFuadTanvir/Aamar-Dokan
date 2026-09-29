"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle, UserPlus, CheckCircle2, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("আপনার পূর্ণ নাম প্রদান করুন।");
      return;
    }

    if (!email.trim() && !phone.trim()) {
      setError("ইমেইল অথবা মোবাইল নম্বর প্রদান আবশ্যক।");
      return;
    }

    if (password.length < 8) {
      setError("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।");
      return;
    }

    if (password !== confirmPassword) {
      setError("উভয় পাসওয়ার্ড হুবহু একই হতে হবে।");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email: email || undefined,
          phone: phone || undefined,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "রেজিস্ট্রেশন করতে সমস্যা হয়েছে।");
      }

      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || "রেজিস্ট্রেশন করতে সমস্যা হয়েছে।");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/80 shadow-md p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-1.5">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center mx-auto mb-2">
              <UserPlus className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 font-bengali">
              নতুন অ্যাকাউন্ট তৈরি করুন
            </h1>
            <p className="text-xs text-slate-500">
              সহজে অর্ডার ট্র্যাক ও দ্রুত কেনাকাটা করতে সাইন আপ করুন
            </p>
          </div>

          {isSuccess ? (
            <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-base font-bold text-slate-900">
                অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!
              </h2>
              <p className="text-xs text-slate-600">
                এখনই আপনার তথ্য দিয়ে লগইন করতে নিচের বাটনে চাপ দিন।
              </p>
              <Link href="/login" className="inline-block pt-2">
                <Button variant="primary">লগইন পেইজে যান</Button>
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="পূর্ণ নাম *"
                  placeholder="যেমন: তানভীর আহমেদ"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />

                <Input
                  label="মোবাইল নম্বর"
                  placeholder="01700000000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />

                <Input
                  label="ইমেইল ঠিকানা"
                  placeholder="example@mail.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <Input
                  label="পাসওয়ার্ড (কমপক্ষে ৮ অক্ষর) *"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <Input
                  label="পাসওয়ার্ড নিশ্চিত করুন *"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isLoading}
                  className="w-full gap-2 font-bold"
                >
                  <span>রেজিস্টার করুন</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </form>

              <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-600">
                ইতোমধ্যে অ্যাকাউন্ট আছে?{" "}
                <Link
                  href="/login"
                  className="text-brand-700 font-bold hover:underline"
                >
                  লগইন করুন
                </Link>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
