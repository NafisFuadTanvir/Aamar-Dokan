import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";

const db = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Categories
  const catOrganic = await db.category.upsert({
    where: { slug: "organic-food" },
    update: {},
    create: {
      name: "অর্গানিক ফুড ও মধু",
      slug: "organic-food",
      description: "প্রাকৃতিক খাঁটি মধু, তেল, ঘি ও ভেষজ খাদ্যদ্রব্য",
      sortOrder: 1,
      isActive: true,
    },
  });

  const catHandicrafts = await db.category.upsert({
    where: { slug: "handicrafts" },
    update: {},
    create: {
      name: "ঐতিহ্যবাহী হস্তশিল্প",
      slug: "handicrafts",
      description: "বাংলার ঐতিহ্যবাহী নকশিকাঁথা, মাটির সামগ্রী ও পাটের পণ্য",
      sortOrder: 2,
      isActive: true,
    },
  });

  const catBeauty = await db.category.upsert({
    where: { slug: "natural-beauty" },
    update: {},
    create: {
      name: "প্রাকৃতিক রূপচর্চা",
      slug: "natural-beauty",
      description: "ভেষজ উপাদানে তৈরি প্রাকৃতিক তেল, প্যাক ও প্রসাধন সামগ্রী",
      sortOrder: 3,
      isActive: true,
    },
  });

  // 2. Demo Products (Simple and Variable)
  // Variable Product 1: Sundarban Honey
  await db.product.upsert({
    where: { slug: "sundarban-pure-honey" },
    update: {},
    create: {
      name: "খাঁটি সুন্দরবনের প্রাকৃতিক মধু (Sundarban Pure Honey)",
      slug: "sundarban-pure-honey",
      sku: "HONEY-001",
      shortDescription: "সুন্দরবনের গভীর জঙ্গল থেকে সংগৃহীত ১০০% প্রাকৃতিক ও অপরিশোধিত কাঁচা মধু।",
      description:
        "সুন্দরবনের প্রাকৃতিক মৌচাক থেকে সরাসরি সংগৃহীত খাঁটি মধু। কোনো প্রকার কৃত্রিম চিনি, ফ্লেভার বা রাসায়নিক মিশ্রণমুক্ত। এতে রয়েছে প্রাকৃতিক অ্যান্টিঅক্সিডেন্ট, এনজাইম এবং রোগ প্রতিরোধ ক্ষমতা বৃদ্ধিকারী উপাদান।",
      pricePoisha: BigInt(45000), // Lowest variant price (450 BDT)
      compareAtPricePoisha: BigInt(52000),
      stockQuantity: 45,
      hasVariants: true,
      status: "PUBLISHED",
      isFeatured: true,
      categoryId: catOrganic.id,
      variants: {
        create: [
          {
            label: "২৫০ গ্রাম",
            attributeName: "Weight",
            attributeValue: "250g",
            pricePoisha: BigInt(45000),
            compareAtPricePoisha: BigInt(52000),
            stockQuantity: 20,
            sortOrder: 0,
            isActive: true,
          },
          {
            label: "৫০০ গ্রাম",
            attributeName: "Weight",
            attributeValue: "500g",
            pricePoisha: BigInt(85000),
            compareAtPricePoisha: BigInt(99000),
            stockQuantity: 15,
            sortOrder: 1,
            isActive: true,
          },
          {
            label: "১ কেজি",
            attributeName: "Weight",
            attributeValue: "1kg",
            pricePoisha: BigInt(160000),
            compareAtPricePoisha: BigInt(185000),
            stockQuantity: 10,
            sortOrder: 2,
            isActive: true,
          },
        ],
      },
    },
  });

  // Simple Product 2: Mustard Oil
  await db.product.upsert({
    where: { slug: "pure-mustard-oil-1l" },
    update: {},
    create: {
      name: "প্রিমিয়াম খাঁটি সরিষার তেল (১ লিটার)",
      slug: "pure-mustard-oil-1l",
      sku: "OIL-001",
      shortDescription: "ঘানির খাঁটি সরিষার ঝাঁঝালো তেল",
      description: "কাঠের ঘানিতে ভাঙানো ১০০% খাঁটি দেশি সরিষার তেল। সুস্বাদু রান্না ও ভর্তার জন্য অনন্য।",
      pricePoisha: BigInt(36000), // 360 BDT
      compareAtPricePoisha: BigInt(40000),
      stockQuantity: 50,
      hasVariants: false,
      status: "PUBLISHED",
      isFeatured: true,
      categoryId: catOrganic.id,
    },
  });

  // Variable Product 3: Nakshi Kantha
  await db.product.upsert({
    where: { slug: "traditional-nakshi-kantha" },
    update: {},
    create: {
      name: "হাতে বোনা ঐতিহ্যবাহী নকশিকাঁথা",
      slug: "traditional-nakshi-kantha",
      sku: "KANTHA-001",
      shortDescription: "সুদক্ষ গ্রামীণ কারিগরদের নিখুঁত সুঁই-সুতোর কারুকাজ",
      description: "বাংলার শতবর্ষের ঐতিহ্যমণ্ডিত হাতে বোনা প্রিমিয়াম সুতি নকশিকাঁথা। আরামদায়ক ও দৃষ্টিনন্দন।",
      pricePoisha: BigInt(180000), // Lowest 1800 BDT
      compareAtPricePoisha: BigInt(220000),
      stockQuantity: 18,
      hasVariants: true,
      status: "PUBLISHED",
      isFeatured: true,
      categoryId: catHandicrafts.id,
      variants: {
        create: [
          {
            label: "সিঙ্গেল বেড (৫ × ৭ ফুট)",
            attributeName: "Size",
            attributeValue: "Single",
            pricePoisha: BigInt(180000),
            stockQuantity: 10,
            sortOrder: 0,
            isActive: true,
          },
          {
            label: "ডাবল / কিং সাইজ (৭ × ৮ ফুট)",
            attributeName: "Size",
            attributeValue: "King",
            pricePoisha: BigInt(260000),
            stockQuantity: 8,
            sortOrder: 1,
            isActive: true,
          },
        ],
      },
    },
  });

  // Admin Account Seed
  const adminPasswordHash = await argon2.hash("Admin@2026!Secure", {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 3,
    parallelism: 1,
  });

  await db.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "Store Administrator",
      email: "admin@example.com",
      phone: "01700000000",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
      status: "ACTIVE",
      mustChangePassword: false,
    },
  });

  console.log("Seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
