"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { KeyRound, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [devToken, setDevToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!identifier.trim()) {
      setError("ইমেইল অথবা মোবাইল নম্বর প্রদান করুন।");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "অনুরোধ সম্পন্ন করা যায়নি।");
      }

      setMessage(data.message);
      if (data.devToken) {
        setDevToken(data.devToken);
      }
    } catch (err: any) {
      setError(err.message || "অনুরোধে সমস্যা হয়েছে।");
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
              <KeyRound className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 font-bengali">
              পাসওয়ার্ড পুনরুদ্ধার
            </h1>
            <p className="text-xs text-slate-500">
              আপনার অ্যাকাউন্টের ইমেইল অথবা মোবাইল নম্বর প্রবেশ করান
            </p>
          </div>

          {message ? (
            <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-3 text-xs text-emerald-900">
              <div className="flex items-center gap-2 font-bold text-sm text-emerald-800">
                <CheckCircle2 className="w-4 h-4" />
                <span>অনুরোধ গৃহীত হয়েছে</span>
              </div>
              <p className="leading-relaxed">{message}</p>

              {devToken && (
                <div className="mt-4 p-3 bg-white rounded-xl border border-emerald-300 space-y-2">
                  <p className="font-bold text-slate-800">
                    [লোকাল ডেভেলপমেন্ট টোকেন লিংক]:
                  </p>
                  <Link
                    href={`/reset-password?token=${devToken}`}
                    className="text-brand-700 font-mono text-[11px] break-all underline block"
                  >
                    /reset-password?token={devToken}
                  </Link>
                </div>
              )}

              <div className="pt-2">
                <Link
                  href="/login"
                  className="text-brand-700 font-semibold flex items-center gap-1 hover:underline"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>লগইন পেইজে ফিরুন</span>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Input
                label="ইমেইল অথবা মোবাইল নম্বর *"
                placeholder="01700000000 অথবা example@mail.com"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                className="w-full"
              >
                রিসেট অনুরোধ পাঠান
              </Button>

              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="text-xs text-slate-500 hover:text-slate-800 transition"
                >
                  মনে পড়েছে? লগইন করুন
                </Link>
              </div>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
