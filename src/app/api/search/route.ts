import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { expandSearchTerms } from "@/lib/search/bengaliSearch";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || searchParams.get("query") || "";
    const limit = Math.min(parseInt(searchParams.get("limit") || "6", 10), 20);

    const trimmed = query.trim();
    if (!trimmed) {
      return NextResponse.json({
        query: "",
        detectedType: "english",
        expandedTerms: [],
        categories: [],
        products: [],
        totalMatches: 0,
      });
    }

    // Expand search into Bengali, Banglish and English terms
    const expanded = expandSearchTerms(trimmed);
    const searchTerms = expanded.terms;

    // Build Prisma OR clauses for all expanded terms
    const orConditions: any[] = [];
    for (const term of searchTerms) {
      if (!term || term.length < 1) continue;
      orConditions.push({ name: { contains: term, mode: "insensitive" } });
      orConditions.push({ shortDescription: { contains: term, mode: "insensitive" } });
      orConditions.push({ description: { contains: term, mode: "insensitive" } });
      orConditions.push({ category: { name: { contains: term, mode: "insensitive" } } });
    }

    // Fetch matching products & categories in parallel
    const [rawProducts, matchedCategories] = await Promise.all([
      db.product.findMany({
        where: {
          status: "PUBLISHED",
          ...(orConditions.length > 0 ? { OR: orConditions } : {}),
        },
        include: {
          images: {
            orderBy: { sortOrder: "asc" },
            take: 1,
            select: { id: true },
          },
          category: {
            select: { id: true, name: true, slug: true },
          },
        },
        take: 30,
      }),
      db.category.findMany({
        where: {
          isActive: true,
          OR: searchTerms.map((term) => ({
            name: { contains: term, mode: "insensitive" },
          })),
        },
        take: 3,
        select: { id: true, name: true, slug: true },
      }),
    ]);

    // Rank products by relevance to original query and expanded terms
    const lowerQuery = trimmed.toLowerCase();
    const rankedProducts = rawProducts.map((p) => {
      let score = 0;
      const lowerName = p.name.toLowerCase();
      const lowerDesc = (p.description || "").toLowerCase();
      const lowerShortDesc = (p.shortDescription || "").toLowerCase();
      const lowerCat = (p.category?.name || "").toLowerCase();

      // Highest score: exact name match
      if (lowerName === lowerQuery) score += 120;
      else if (lowerName.startsWith(lowerQuery)) score += 80;
      else if (lowerName.includes(lowerQuery)) score += 60;

      // Expanded terms matches
      for (const t of searchTerms) {
        const lowerT = t.toLowerCase();
        if (lowerName.includes(lowerT)) score += 35;
        if (lowerCat.includes(lowerT)) score += 20;
        if (lowerShortDesc.includes(lowerT)) score += 15;
        if (lowerDesc.includes(lowerT)) score += 5;
      }

      // Stock availability boost
      if (p.stockQuantity > 0) score += 10;
      if (p.isFeatured) score += 5;

      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        pricePoisha: p.pricePoisha.toString(),
        compareAtPricePoisha: p.compareAtPricePoisha ? p.compareAtPricePoisha.toString() : null,
        stockQuantity: p.stockQuantity,
        hasVariants: p.hasVariants,
        categoryName: p.category?.name || null,
        categorySlug: p.category?.slug || null,
        imageId: p.images[0]?.id || null,
        score,
      };
    });

    // Sort by descending relevance score
    rankedProducts.sort((a, b) => b.score - a.score);

    const limitedProducts = rankedProducts.slice(0, limit);

    return NextResponse.json({
      query: trimmed,
      detectedType: expanded.detectedType,
      primaryHint: expanded.primaryHint,
      expandedTerms: expanded.terms.slice(0, 8),
      categories: matchedCategories,
      products: limitedProducts,
      totalMatches: rankedProducts.length,
    });
  } catch (error: any) {
    console.error("[Search API Error]:", error);
    return NextResponse.json(
      {
        query: "",
        detectedType: "english",
        expandedTerms: [],
        categories: [],
        products: [],
        totalMatches: 0,
        error: "Failed to search products",
      },
      { status: 500 }
    );
  }
}
