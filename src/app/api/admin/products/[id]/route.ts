import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { bdtToPoisha, poishaToBDT } from "@/lib/format";
import slugify from "slugify";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session || !session.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const product = await db.product.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        variants: {
          orderBy: { sortOrder: "asc" },
        },
        images: {
          select: {
            id: true,
            altText: true,
            mimeType: true,
            sizeBytes: true,
            sortOrder: true,
            createdAt: true,
          },
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "পণ্য পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      product: {
        ...product,
        priceBDT: poishaToBDT(product.pricePoisha),
        variants: product.variants.map((v) => ({
          ...v,
          priceBDT: poishaToBDT(v.pricePoisha),
        })),
      },
    });
  } catch (error: any) {
    console.error("Admin product GET error:", error);
    return NextResponse.json(
      { error: error.message || "পণ্য তথ্য আনতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session || !session.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = params;

  try {
    const existingProduct = await db.product.findUnique({
      where: { id },
      include: { variants: true, images: true },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: "আপডেট করার জন্য পণ্যটি খুঁজে পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

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
    const deletedImageIdsJson = formData.get("deletedImageIds")?.toString();

    if (!name?.trim() || !description?.trim()) {
      return NextResponse.json(
        { error: "পণ্যের নাম এবং বিবরণ প্রদান করুন।" },
        { status: 400 }
      );
    }

    // Slug generation if name changed significantly
    let slug = existingProduct.slug;
    if (name.trim() !== existingProduct.name) {
      const baseSlug = slugify(name, { lower: true, strict: true }) || `product-${Date.now()}`;
      slug = baseSlug;
      const slugConflict = await db.product.findFirst({
        where: {
          slug,
          NOT: { id },
        },
      });
      if (slugConflict) {
        slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
      }
    }

    const pricePoisha = bdtToPoisha(priceBDT);

    // Extract new images
    const newImageFiles: File[] = [];
    formData.forEach((value, key) => {
      if (key.startsWith("image") && value instanceof File && value.size > 0) {
        newImageFiles.push(value);
      }
    });

    // Validate images
    const allowedMimes = ["image/jpeg", "image/png", "image/webp"];
    const MAX_SIZE = 2 * 1024 * 1024; // 2 MB

    for (const file of newImageFiles) {
      if (!allowedMimes.includes(file.type)) {
        return NextResponse.json(
          { error: `অননুমোদিত ছবির ফরম্যাট: ${file.type}। কেবল JPEG, PNG বা WebP সমর্থিত।` },
          { status: 400 }
        );
      }
      if (file.size > MAX_SIZE) {
        return NextResponse.json(
          { error: `ছবির সাইজ ২ মেগাবাইটের বেশি হতে পারবে না (${(file.size / 1024 / 1024).toFixed(1)} MB)।` },
          { status: 400 }
        );
      }
    }

    // Parse deleted image IDs
    let deletedImageIds: string[] = [];
    if (deletedImageIdsJson) {
      try {
        deletedImageIds = JSON.parse(deletedImageIdsJson);
      } catch (e) {
        console.error("Failed to parse deletedImageIds:", e);
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
        console.error("Variants parse error in update:", e);
      }
    }

    // Execute update transaction
    const updatedProduct = await db.$transaction(async (tx) => {
      // 1. Delete requested images
      if (deletedImageIds.length > 0) {
        await tx.productImage.deleteMany({
          where: {
            id: { in: deletedImageIds },
            productId: id,
          },
        });
      }

      // 2. Insert any new images
      const existingImageCount = await tx.productImage.count({ where: { productId: id } });
      for (let i = 0; i < newImageFiles.length; i++) {
        const file = newImageFiles[i];
        const buffer = Buffer.from(await file.arrayBuffer());

        await tx.productImage.create({
          data: {
            productId: id,
            data: buffer,
            mimeType: file.type,
            sizeBytes: file.size,
            altText: name.trim(),
            sortOrder: existingImageCount + i,
          },
        });
      }

      // 3. Update variants
      await tx.productVariant.deleteMany({
        where: { productId: id },
      });

      if (hasVariants && variantsToCreate.length > 0) {
        await tx.productVariant.createMany({
          data: variantsToCreate.map((v) => ({
            ...v,
            productId: id,
          })),
        });
      }

      // 4. Update product main record
      const updated = await tx.product.update({
        where: { id },
        data: {
          name: name.trim(),
          slug,
          description: description.trim(),
          shortDescription: shortDescription?.trim() || null,
          pricePoisha: hasVariants ? lowestVariantPricePoisha : pricePoisha,
          stockQuantity: hasVariants ? totalVariantStock : stockQuantity,
          hasVariants,
          status: status as any,
          categoryId: categoryId || null,
        },
      });

      return updated;
    });

    return NextResponse.json({
      success: true,
      product: {
        id: updatedProduct.id,
        name: updatedProduct.name,
        slug: updatedProduct.slug,
      },
    });
  } catch (error: any) {
    console.error("Admin product update error:", error);
    return NextResponse.json(
      { error: error.message || "পণ্য আপডেট করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session || !session.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = params;

  try {
    await db.$transaction(async (tx) => {
      await tx.cartItem.deleteMany({
        where: { productId: id },
      });

      await tx.review.deleteMany({
        where: { productId: id },
      });

      await tx.orderItem.updateMany({
        where: { productId: id },
        data: { productId: null, variantId: null },
      });

      await tx.product.delete({
        where: { id },
      });
    });

    return NextResponse.json({
      success: true,
      message: "পণ্য সফলভাবে মুছে ফেলা হয়েছে।",
    });
  } catch (error: any) {
    console.error("Admin product delete error:", error);
    return NextResponse.json(
      { error: error.message || "পণ্য মুছে ফেলতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}
