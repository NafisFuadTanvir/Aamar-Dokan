import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { bdtToPoisha } from "@/lib/format";
import slugify from "slugify";

export async function POST(request: NextRequest) {
  const session = await auth();

  // Role verification
  if (!session || !session.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const formData = await request.formData();

    const name = formData.get("name")?.toString();
    const description = formData.get("description")?.toString();
    const shortDescription = formData.get("shortDescription")?.toString();
    const categoryId = formData.get("categoryId")?.toString() || null;
    const priceBDT = parseFloat(formData.get("priceBDT")?.toString() || "0");
    const stockQuantity = parseInt(formData.get("stockQuantity")?.toString() || "0", 10);
    const hasVariants = formData.get("hasVariants")?.toString() === "true";
    const status = formData.get("status")?.toString() || "PUBLISHED";
    const variantsJson = formData.get("variants")?.toString();

    if (!name?.trim() || !description?.trim()) {
      return NextResponse.json(
        { error: "পণ্যের নাম এবং বিবরণ প্রদান করুন।" },
        { status: 400 }
      );
    }

    const baseSlug = slugify(name, { lower: true, strict: true }) || `product-${Date.now()}`;
    let slug = baseSlug;
    const existing = await db.product.findUnique({ where: { slug } });
    if (existing) {
      slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
    }

    const pricePoisha = bdtToPoisha(priceBDT);

    // Extract images
    const imageFiles: File[] = [];
    formData.forEach((value, key) => {
      if (key.startsWith("image") && value instanceof File && value.size > 0) {
        imageFiles.push(value);
      }
    });

    // Validate images
    const allowedMimes = ["image/jpeg", "image/png", "image/webp"];
    const MAX_SIZE = 2 * 1024 * 1024; // 2 MB

    for (const file of imageFiles) {
      if (!allowedMimes.includes(file.type)) {
        return NextResponse.json(
          { error: `অননুমোদিত ছবির ফরম্যাট: ${file.type}। কেবল JPEG, PNG বা WebP সমর্থিত।` },
          { status: 400 }
        );
      }
      if (file.size > MAX_SIZE) {
        return NextResponse.json(
          { error: `ছবির সাইজ ২ মেগাবাইটের (2 MB) চেয়ে বড় হতে পারবে না (${(file.size / 1024 / 1024).toFixed(1)} MB)।` },
          { status: 400 }
        );
      }
    }

    // Parse variants if provided
    let variantsToCreate: any[] = [];
    let lowestVariantPricePoisha = pricePoisha;
    let totalVariantStock = stockQuantity;

    if (hasVariants && variantsJson) {
      try {
        const parsedVariants = JSON.parse(variantsJson);
        if (Array.isArray(parsedVariants) && parsedVariants.length > 0) {
          totalVariantStock = 0;
          variantsToCreate = parsedVariants.map((v: any, index: number) => {
            const vPrice = bdtToPoisha(parseFloat(v.priceBDT || "0"));
            const vStock = parseInt(v.stockQuantity || "0", 10);
            totalVariantStock += vStock;

            if (index === 0 || vPrice < lowestVariantPricePoisha) {
              lowestVariantPricePoisha = vPrice;
            }

            return {
              label: v.label,
              attributeName: v.attributeName || "Option",
              attributeValue: v.attributeValue || v.label,
              pricePoisha: vPrice,
              stockQuantity: vStock,
              sortOrder: index,
              isActive: true,
            };
          });
        }
      } catch (e) {
        console.error("Variants parse error:", e);
      }
    }

    // Create Product in DB
    const product = await db.$transaction(async (tx) => {
      const created = await tx.product.create({
        data: {
          name: name.trim(),
          slug,
          description: description.trim(),
          shortDescription: shortDescription?.trim() || null,
          pricePoisha: hasVariants ? lowestVariantPricePoisha : pricePoisha,
          stockQuantity: hasVariants ? totalVariantStock : stockQuantity,
          hasVariants,
          status: status as any,
          categoryId: categoryId || undefined,
          variants: hasVariants
            ? {
                create: variantsToCreate,
              }
            : undefined,
        },
      });

      // Insert image bytea records
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        const buffer = Buffer.from(await file.arrayBuffer());

        await tx.productImage.create({
          data: {
            productId: created.id,
            data: buffer,
            mimeType: file.type,
            sizeBytes: file.size,
            altText: created.name,
            sortOrder: i,
          },
        });
      }

      return created;
    });

    return NextResponse.json({
      success: true,
      product: {
        id: product.id,
        name: product.name,
        slug: product.slug,
      },
    });
  } catch (error: any) {
    console.error("Admin product create error:", error);
    return NextResponse.json(
      { error: error.message || "পণ্য যোগ করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}
