import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  console.log("Generating 1000 bulk products for performance testing...");

  const category = await db.category.findFirst();
  const categoryId = category ? category.id : undefined;

  const batchSize = 100;
  const total = 1000;

  for (let i = 0; i < total; i += batchSize) {
    const products = [];
    for (let j = 0; j < batchSize; j++) {
      const idx = i + j + 1;
      products.push({
        name: `টেস্ট পারফরম্যান্স পণ্য #${idx}`,
        slug: `perf-test-product-${idx}-${Date.now()}`,
        sku: `PERF-${idx}`,
        shortDescription: `পারফরম্যান্স পরীক্ষার পণ্য নমুনা #${idx}`,
        description: `এটি একটি স্বয়ংক্রিয় টেস্ট পণ্য যা ১০০০ পণ্য পেজিনেশন ও কুয়েরি স্পিড যাচাইয়ের জন্য প্রস্তুত করা হয়েছে।`,
        pricePoisha: BigInt((100 + (idx % 50) * 10) * 100),
        stockQuantity: 50,
        hasVariants: false,
        status: "PUBLISHED" as const,
        categoryId,
      });
    }

    await db.product.createMany({
      data: products,
      skipDuplicates: true,
    });
    console.log(`Created ${i + batchSize} / ${total} products...`);
  }

  console.log("Bulk 1000 products generated successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
