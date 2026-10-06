import React from "react";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { poishaToBDT } from "@/lib/format";
import { EditProductForm } from "./EditProductForm";

export const revalidate = 0;

interface EditProductPageProps {
  params: {
    id: string;
  };
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = params;

  const [product, categories] = await Promise.all([
    db.product.findUnique({
      where: { id },
      include: {
        category: true,
        variants: {
          orderBy: { sortOrder: "asc" },
        },
        images: {
          select: {
            id: true,
            altText: true,
            sortOrder: true,
          },
          orderBy: { sortOrder: "asc" },
        },
      },
    }),
    db.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      select: {
        id: true,
        name: true,
      },
    }),
  ]);

  if (!product) {
    notFound();
  }

  const formattedProduct = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    shortDescription: product.shortDescription,
    description: product.description,
    categoryId: product.categoryId,
    status: product.status,
    hasVariants: product.hasVariants,
    priceBDT: poishaToBDT(product.pricePoisha),
    stockQuantity: product.stockQuantity,
    variants: product.variants.map((v) => ({
      id: v.id,
      label: v.label,
      priceBDT: poishaToBDT(v.pricePoisha),
      stockQuantity: v.stockQuantity,
    })),
    images: product.images.map((img) => ({
      id: img.id,
      altText: img.altText,
      sortOrder: img.sortOrder,
    })),
  };

  return <EditProductForm product={formattedProduct} categories={categories} />;
}
