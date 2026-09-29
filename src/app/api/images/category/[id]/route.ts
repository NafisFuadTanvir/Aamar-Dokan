import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const category = await db.category.findUnique({
      where: { id },
      select: {
        imageData: true,
        imageMime: true,
      },
    });

    if (!category || !category.imageData) {
      return new NextResponse("Category image not found", { status: 404 });
    }

    return new NextResponse(new Uint8Array(category.imageData), {
      status: 200,
      headers: {
        "Content-Type": category.imageMime || "image/jpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error serving category image:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
