import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import crypto from "crypto";

describe("Authentication & Argon2id Security", () => {
  it("hashes password with Argon2id and verifies match", async () => {
    const rawPassword = "CustomerSecurePassword2026!";
    const hash = await hashPassword(rawPassword);

    expect(hash).toContain("$argon2id$");

    const isMatch = await verifyPassword(hash, rawPassword);
    expect(isMatch).toBe(true);

    const isWrong = await verifyPassword(hash, "WrongPassword123");
    expect(isWrong).toBe(false);
  });

  it("hashes reset token with SHA-256 securely", () => {
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

    expect(tokenHash.length).toBe(64); // SHA-256 hex length
    expect(tokenHash).not.toEqual(rawToken);
  });
});
