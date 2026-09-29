import React from "react";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductDetailClient } from "@/components/product/ProductDetailClient";
import { db } from "@/lib/db";
import type { Metadata } from "next";

export const revalidate = 30;

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  try {
    const product = await db.product.findUnique({
      where: { slug: params.slug },
      select: { name: true, shortDescription: true, seoTitle: true, seoDescription: true },
    });

    if (!product) {
      return { title: "পণ্য পাওয়া যায়নি | Amar Dokan" };
    }

    return {
      title: product.seoTitle || `${product.name} | Amar Dokan`,
      description:
        product.seoDescription ||
        product.shortDescription ||
        `বাংলাদেশে সেরা মূল্যে কিনুন ${product.name}`,
    };
  } catch (e) {
    return { title: "পণ্য বিবরণী | Amar Dokan" };
  }
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  let product: any = null;

  try {
    product = await db.product.findUnique({
      where: { slug: params.slug },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        variants: {
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
        },
        category: true,
        reviews: {
          where: { status: "APPROVED" },
          include: {
            user: { select: { name: true } },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });
  } catch (e) {
    // Database connection error handling
  }

  // Fallback demo product if DB has not been seeded yet
  if (!product && params.slug.startsWith("sundarban-pure-honey")) {
    product = {
      id: "demo-honey",
      name: "খাঁটি সুন্দরবনের প্রাকৃতিক মধু (Sundarban Pure Honey)",
      slug: "sundarban-pure-honey",
      sku: "HONEY-001",
      shortDescription: "সুন্দরবনের গভীর জঙ্গল থেকে সংগৃহীত ১০০% প্রাকৃতিক ও অপরিশোধিত কাঁচা মধু।",
      description:
        "সুন্দরবনের প্রাকৃতিক মৌচাক থেকে সরাসরি সংগৃহীত খাঁটি মধু। কোনো প্রকার কৃত্রিম চিনি, ফ্লেভার বা রাসায়নিক মিশ্রণমুক্ত। এতে রয়েছে প্রাকৃতিক অ্যান্টিঅক্সিডেন্ট, এনজাইম এবং রোগ প্রতিরোধ ক্ষমতা বৃদ্ধিকারী উপাদান।\n\nবৈশিষ্ট্য:\n• ১০০% প্রাকৃতিক ও খাঁটি\n• অ্যান্টিব্যাকটেরিয়াল ও রোগ প্রতিরোধক\n• চা, উষ্ণ পানি বা প্রতিদিন সকালে খাওয়ার জন্য আদর্শ।",
      pricePoisha: BigInt(85000),
      compareAtPricePoisha: BigInt(99000),
      stockQuantity: 45,
      hasVariants: true,
      category: { name: "অর্গানিক ফুড", slug: "organic-food" },
      images: [],
      variants: [
        {
          id: "v-250g",
          label: "২৫০ গ্রাম",
          pricePoisha: BigInt(45000),
          compareAtPricePoisha: BigInt(52000),
          stockQuantity: 20,
          isActive: true,
        },
        {
          id: "v-500g",
          label: "৫০০ গ্রাম",
          pricePoisha: BigInt(85000),
          compareAtPricePoisha: BigInt(99000),
          stockQuantity: 15,
          isActive: true,
        },
        {
          id: "v-1kg",
          label: "১ কেজি",
          pricePoisha: BigInt(160000),
          compareAtPricePoisha: BigInt(185000),
          stockQuantity: 10,
          isActive: true,
        },
      ],
      reviews: [
        {
          id: "r1",
          rating: 5,
          title: "অসাধারণ স্বাদ ও খাঁটি মধু!",
          comment: "আমি নিয়মিত ব্যবহার করছি। সুন্দরবনের খাঁটি মধুর স্বাদ পাওয়া যায়। প্যাকেজিং খুব ভালো ছিল।",
          createdAt: new Date().toISOString(),
          isVerifiedPurchase: true,
          user: { name: "তানভীর আহমেদ" },
        },
      ],
    };
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <ProductDetailClient product={product} />
      </main>
      <Footer />
    </div>
  );
}
