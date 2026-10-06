"use client";

import React, { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle, UserPlus, ArrowRight, Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setError("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।");
      return;
    }
    if (password !== confirmPassword) {
      setError("উভয় পাসওয়ার্ড হুবহু একই হতে হবে।");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Register the user
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
        throw new Error(data.error || "রেজিস্ট্রেশন করতে সমস্যা হয়েছে।");
      }

      // 2. Auto-login immediately after successful registration
      const loginResult = await signIn("credentials", {
        redirect: false,
        email: email || undefined,
        phone: phone || undefined,
        password,
      });

      if (loginResult?.error) {
        // Registration succeeded but auto-login failed — redirect to login page
        router.push("/login?registered=1");
        return;
      }

      // 3. Login successful → go to home page
      router.push("/");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "রেজিস্ট্রেশন করতে সমস্যা হয়েছে।");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream-50">
      <Header />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md bg-white rounded-3xl border border-cream-200 shadow-card p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-navy-gradient flex items-center justify-center mx-auto mb-3 shadow-glow-navy">
              <UserPlus className="w-7 h-7 text-saffron-400" />
            </div>
            <h1 className="text-2xl font-black text-navy-900">
              নতুন অ্যাকাউন্ট তৈরি করুন
            </h1>
            <p className="text-xs text-navy-500">
              সহজে অর্ডার ট্র্যাক ও দ্রুত কেনাকাটা করতে সাইন আপ করুন
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
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
              label="পাসওয়ার্ড (কমপক্ষে ৮ অক্ষর) *"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Input
              label="পাসওয়ার্ড নিশ্চিত করুন *"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              disabled={isLoading}
              className="btn-saffron w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  রেজিস্টার হচ্ছে...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  রেজিস্টার করুন ও লগইন করুন
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-cream-200 text-center text-xs text-navy-600">
            ইতোমধ্যে অ্যাকাউন্ট আছে?{" "}
            <Link href="/login" className="text-saffron-600 font-bold hover:text-saffron-700 hover:underline">
              লগইন করুন
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
