import type { Metadata } from "next";
import { Inter, Hind_Siliguri } from "next/font/google";
import { ClientProviders } from "@/components/providers/ClientProviders";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const hindSiliguri = Hind_Siliguri({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["bengali", "latin"],
  variable: "--font-hind-siliguri",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Amar Dokan — Premium Online Shopping in Bangladesh",
    template: "%s | Amar Dokan",
  },
  description:
    "Shop authentic products online with secure prepaid payment via bKash, Nagad, and Rocket. Fast delivery across Dhaka and all 64 districts of Bangladesh.",
  keywords: [
    "Bangladesh e-commerce",
    "online shopping BD",
    "bKash payment",
    "Nagad payment",
    "prepaid shopping",
    "Dhaka online shop",
  ],
  metadataBase: new URL(process.env.APP_URL || "http://localhost:3000"),
  openGraph: {
    title: "Amar Dokan — Premium Online Shopping in Bangladesh",
    description:
      "Shop authentic products online with secure prepaid payment via bKash, Nagad, and Rocket.",
    url: "/",
    siteName: "Amar Dokan",
    locale: "bn_BD",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" className={`${inter.variable} ${hindSiliguri.variable}`}>
      <body className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased selection:bg-brand-100 selection:text-brand-900">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
