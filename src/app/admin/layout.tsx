import React from "react";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
import { AdminSidebar } from "./AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Strict Server-Side Role Enforcement
  if (!session || !session.user || (session.user as any).role !== "ADMIN") {
    redirect("/login?callbackUrl=/admin");
  }

  async function handleSignOut() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-900 text-slate-100">
      <AdminSidebar
        userName={session.user.name}
        onSignOut={handleSignOut}
      />

      {/* Main Admin Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-900 min-h-screen pt-14 lg:pt-0">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}

