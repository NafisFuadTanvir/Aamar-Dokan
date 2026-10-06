import type { Metadata } from "next";
import { Hind_Siliguri, Anek_Bangla, Poppins } from "next/font/google";
import { ClientProviders } from "@/components/providers/ClientProviders";
import "./globals.css";

// Body & general UI font: Hind Siliguri (clean, ultra-legible Bengali matras)
const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hind-siliguri",
  display: "swap",
});

// Modern, high-impact headings font: Anek Bangla
const anekBangla = Anek_Bangla({
  subsets: ["bengali", "latin"],
  weight: ["600", "700", "800"],
  variable: "--font-anek-bangla",
  display: "swap",
});

// Clean geometric English & numbers font: Poppins
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "আমার দোকান — খাঁটি প্রাকৃতিক হার্বাল পণ্য",
    template: "%s | আমার দোকান",
  },
  description:
    "বাংলাদেশের বিশ্বস্ত হার্বাল ও স্বাস্থ্য পণ্যের অনলাইন শপ। ১০০% আসল ও প্রাকৃতিক পণ্য, নিরাপদ ডিজিটাল পেমেন্ট (bKash, Nagad, Rocket) ও দ্রুত ডেলিভারি সারা বাংলাদেশে।",
  keywords: [
    "হার্বাল পণ্য বাংলাদেশ",
    "প্রাকৃতিক স্বাস্থ্য পণ্য",
    "অনলাইন শপিং BD",
    "bKash payment",
    "herbal health products Bangladesh",
    "Nagad payment",
  ],
  metadataBase: new URL(process.env.APP_URL || "http://localhost:3000"),
  openGraph: {
    title: "আমার দোকান — খাঁটি প্রাকৃতিক হার্বাল পণ্য",
    description: "বাংলাদেশের বিশ্বস্ত হার্বাল ও স্বাস্থ্য পণ্যের অনলাইন শপ।",
    url: "/",
    siteName: "আমার দোকান",
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
    <html
      lang="bn"
      className={`${hindSiliguri.variable} ${anekBangla.variable} ${poppins.variable}`}
    >
      <body className="min-h-screen bg-cream-50 font-sans text-navy-900 antialiased selection:bg-saffron-200 selection:text-navy-900">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
