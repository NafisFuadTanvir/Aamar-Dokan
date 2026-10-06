"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle, Lock, ArrowRight } from "lucide-react";

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!identifier.trim() || !password) {
      setError("ইমেইল/ফোন নম্বর এবং পাসওয়ার্ড প্রদান করুন।");
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        identifier: identifier.trim(),
        password,
      });

      if (result?.error) {
        setError("ভুল ইমেইল/ফোন বা পাসওয়ার্ড। অনুগ্রহ করে আবার চেষ্টা করুন।");
      } else {
        if (callbackUrl) {
          window.location.href = callbackUrl;
        } else {
          try {
            const sessionRes = await fetch("/api/auth/session");
            const sessionData = await sessionRes.json();
            if (sessionData?.user?.role === "ADMIN") {
              window.location.href = "/admin";
              return;
            }
          } catch (_) {}
          window.location.href = "/account";
        }
      }
    } catch (err: any) {
      setError(err.message || "লগইন করতে সমস্যা হয়েছে।");
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
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 font-bengali">
              অ্যাকাউন্টে প্রবেশ করুন
            </h1>
            <p className="text-xs text-slate-500">
              আপনার সংরক্ষিত অর্ডার ও প্রোফাইল দেখতে লগইন করুন
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="ইমেইল অথবা মোবাইল নম্বর *"
              placeholder="01700000000 অথবা example@mail.com"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />

            <Input
              label="পাসওয়ার্ড *"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-xs text-brand-700 hover:underline font-semibold"
              >
                পাসওয়ার্ড ভুলে গেছেন?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full gap-2 font-bold"
            >
              <span>লগইন করুন</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-600">
            অ্যাকাউন্ট নেই?{" "}
            <Link
              href="/register"
              className="text-brand-700 font-bold hover:underline"
            >
              নতুন অ্যাকাউন্ট তৈরি করুন
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-slate-500">
          লোড হচ্ছে...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
