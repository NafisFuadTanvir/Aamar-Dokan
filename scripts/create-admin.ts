import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";
import readline from "readline";

const db = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function main() {
  console.log("\n=======================================================");
  console.log("       Amar Dokan — Admin Account Bootstrap CLI        ");
  console.log("=======================================================\n");

  const name = (await question("Admin Name [Store Admin]: ")).trim() || "Store Admin";
  const email = (await question("Admin Email [admin@example.com]: ")).trim() || "admin@example.com";
  const phone = (await question("Admin Phone [01700000000]: ")).trim() || "01700000000";
  const password = await question("Admin Password (min 8 chars): ");

  if (!password || password.length < 8) {
    console.error("\n❌ Error: Password must be at least 8 characters long.");
    process.exit(1);
  }

  // Reject common default insecure passwords
  const insecurePasswords = ["admin123", "password", "12345678", "admin@123", "secret123"];
  if (insecurePasswords.includes(password.toLowerCase())) {
    console.error("\n❌ Security Error: Known default/insecure password is not allowed.");
    process.exit(1);
  }

  const passwordHash = await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 3,
    parallelism: 1,
  });

  try {
    const existing = await db.user.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    });

    if (existing) {
      console.log(`\nUser with email "${email}" or phone "${phone}" already exists.`);
      const updateRole = await question("Promote this user to ADMIN with the new password? (y/N): ");
      if (updateRole.toLowerCase() === "y") {
        await db.user.update({
          where: { id: existing.id },
          data: {
            name,
            role: "ADMIN",
            passwordHash,
            status: "ACTIVE",
            mustChangePassword: true,
          },
        });
        console.log(`\n✅ User ${email} successfully updated to ADMIN (password change required on first login).`);
      } else {
        console.log("\nOperation cancelled.");
      }
    } else {
      const admin = await db.user.create({
        data: {
          name,
          email,
          phone,
          passwordHash,
          role: "ADMIN",
          status: "ACTIVE",
          mustChangePassword: true,
        },
      });

      console.log(`\n✅ Admin account "${admin.email}" successfully created!`);
      console.log("Note: mustChangePassword flag is enabled for first login.");
    }
  } catch (error) {
    console.error("\n❌ Database error:", error);
  } finally {
    await db.$disconnect();
    rl.close();
  }
}

main();
