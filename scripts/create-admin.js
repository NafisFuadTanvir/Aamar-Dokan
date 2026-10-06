const { PrismaClient } = require("@prisma/client");
const argon2 = require("argon2");
const readline = require("readline");

const db = new PrismaClient();

function prompt(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans);
    })
  );
}

async function main() {
  console.log("\n=======================================================");
  console.log("       Amar Dokan — Easy Admin Account Creator         ");
  console.log("=======================================================\n");

  const args = process.argv.slice(2);
  let email = "admin@example.com";
  let password = "Admin@12345678";
  let name = "Store Admin";
  let phone = "01700000000";

  const isQuick = args.includes("--quick") || args.includes("-y");

  if (args[0] && !args[0].startsWith("-")) {
    email = args[0];
    if (args[1]) password = args[1];
    if (args[2]) name = args[2];
    if (args[3]) phone = args[3];
  } else if (!isQuick) {
    console.log("Press [Enter] to accept default values, or type your own:\n");
    const inputEmail = (await prompt(`Admin Email [${email}]: `)).trim();
    if (inputEmail) email = inputEmail;

    const inputPassword = (await prompt(`Admin Password [${password}]: `)).trim();
    if (inputPassword) password = inputPassword;

    const inputName = (await prompt(`Admin Name [${name}]: `)).trim();
    if (inputName) name = inputName;

    const inputPhone = (await prompt(`Admin Phone [${phone}]: `)).trim();
    if (inputPhone) phone = inputPhone;
  }

  if (password.length < 8) {
    console.error("\n❌ Error: Password must be at least 8 characters long.");
    process.exit(1);
  }

  console.log(`\n⏳ Hashing password and saving admin (${email})...`);

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
      await db.user.update({
        where: { id: existing.id },
        data: {
          name,
          role: "ADMIN",
          passwordHash,
          status: "ACTIVE",
          mustChangePassword: false,
        },
      });
      console.log(`\n✅ Existing user updated to ADMIN successfully!`);
    } else {
      await db.user.create({
        data: {
          name,
          email,
          phone,
          passwordHash,
          role: "ADMIN",
          status: "ACTIVE",
          mustChangePassword: false,
        },
      });
      console.log(`\n✅ Admin account created successfully!`);
    }

    console.log("\n=======================================================");
    console.log("               ADMIN CREDENTIALS DETAILS               ");
    console.log("=======================================================");
    console.log(` 📧 Email:    ${email}`);
    console.log(` 🔑 Password: ${password}`);
    console.log(` 🌐 Login:    http://localhost:3000/login`);
    console.log(` ⚡ Dashboard: http://localhost:3000/admin`);
    console.log("=======================================================\n");
  } catch (error) {
    console.error("\n❌ Database error:", error.message || error);
    console.log("\nTip: Make sure PostgreSQL is running (e.g. docker compose up -d)");
  } finally {
    await db.$disconnect();
  }
}

main();
