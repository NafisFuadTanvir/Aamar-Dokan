"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Send,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Clock,
  ExternalLink,
} from "lucide-react";

export function NotificationsClient({
  initialJobs,
  telegramStatus,
}: {
  initialJobs: any[];
  telegramStatus: string;
}) {
  const [jobs, setJobs] = useState(initialJobs);
  const [retryingId, setRetryingId] = useState<string | null>(null);
  const [testLoading, setTestLoading] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleRetry = async (id: string) => {
    setRetryingId(id);
    try {
      const res = await fetch("/api/admin/notifications/retry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      window.location.reload();
    } catch (e: any) {
      alert(e.message || "রিট্রাই করতে সমস্যা হয়েছে।");
    } finally {
      setRetryingId(null);
    }
  };

  const handleTest = async () => {
    setTestLoading(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/admin/notifications/test", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setTestResult({ success: true, message: data.message });
    } catch (e: any) {
      setTestResult({ success: false, message: e.message });
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Configuration Status Banner */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white">
                টেলিগ্রাম বট স্ট্যাটাস:
              </h2>
              <Badge
                variant={
                  telegramStatus === "READY"
                    ? "success"
                    : telegramStatus === "NOT_CONFIGURED"
                    ? "warning"
                    : "danger"
                }
              >
                {telegramStatus}
              </Badge>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {telegramStatus === "READY"
                ? "বট সক্রিয় রয়েছে এবং সফল পেমেন্টের পর নোটিফিকেশন পাঠাবে।"
                : "পরিবেশ ভেরিয়েবল (TELEGRAM_BOT_TOKEN বা TELEGRAM_CHAT_ID) কনফিগার করা নেই। নোটিফিকেশন আউটবক্সে জমা থাকবে, মুছে যাবে না।"}
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleTest}
          isLoading={testLoading}
          disabled={telegramStatus !== "READY"}
          className="gap-2 text-slate-300 border-slate-700 hover:bg-slate-800"
        >
          <Send className="w-3.5 h-3.5" />
          <span>টেস্ট বার্তা পাঠান</span>
        </Button>
      </div>

      {testResult && (
        <div
          className={`p-4 rounded-2xl border text-xs flex items-center gap-2.5 ${
            testResult.success
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              : "bg-red-500/10 border-red-500/30 text-red-400"
          }`}
        >
          {testResult.success ? (
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
          )}
          <span>{testResult.message}</span>
        </div>
      )}

      {/* Outbox Table */}
      <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden">
        {jobs.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <p className="text-sm font-semibold text-slate-300">
              আউটবক্সে কোনো নোটিফিকেশন নেই
            </p>
            <p className="text-xs text-slate-500">
              গ্রাহকের কোনো নতুন পেইড অর্ডার সম্পন্ন হলে বার্তা স্বয়ংক্রিয়ভাবে এখানে তৈরি হবে।
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-4">অর্ডার বিবরণ</th>
                  <th className="p-4">চ্যানেল</th>
                  <th className="p-4">স্ট্যাটাস</th>
                  <th className="p-4">প্রচেষ্টা</th>
                  <th className="p-4">সর্বশেষ ফলাফল / ত্রুটি</th>
                  <th className="p-4">সময়</th>
                  <th className="p-4 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {jobs.map((job) => {
                  const p = job.payload as any;
                  return (
                    <tr key={job.id} className="hover:bg-slate-900/40">
                      <td className="p-4">
                        <div className="font-bold text-white font-mono">
                          {p?.orderNumber || "ORD-N/A"}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {p?.customerName} ({p?.customerPhone})
                        </div>
                        <div className="text-[11px] text-emerald-400 font-semibold">
                          ৳{p?.totalBDT || 0} ({p?.paymentMethod})
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-cyan-400">
                          {job.channel}
                        </span>
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={
                            job.status === "SENT"
                              ? "success"
                              : job.status === "NOT_CONFIGURED"
                              ? "warning"
                              : job.status === "FAILED"
                              ? "danger"
                              : "default"
                          }
                        >
                          {job.status}
                        </Badge>
                      </td>
                      <td className="p-4">
                        {job.attemptCount}/{job.maxAttempts}
                      </td>
                      <td className="p-4 max-w-xs">
                        {job.lastError ? (
                          <span className="text-red-400 text-[11px] block line-clamp-2">
                            {job.lastError}
                          </span>
                        ) : job.providerMessageId ? (
                          <span className="text-slate-400 text-[11px]">
                            Message ID: {job.providerMessageId}
                          </span>
                        ) : (
                          <span className="text-slate-500">—</span>
                        )}
                      </td>
                      <td className="p-4 text-slate-400 text-[11px]">
                        {new Date(job.createdAt).toLocaleString("en-BD")}
                      </td>
                      <td className="p-4 text-right">
                        {job.status !== "SENT" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRetry(job.id)}
                            isLoading={retryingId === job.id}
                            className="text-xs text-gold-400 border-slate-700 hover:bg-slate-800"
                          >
                            <RefreshCw className="w-3 h-3 mr-1" />
                            <span>রিট্রাই</span>
                          </Button>
                        )}
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
