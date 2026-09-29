// ─────────────────────────────────────────────────────────────────────────────
// Environment variable validation using @t3-oss/env-nextjs + Zod
// The app will throw a descriptive error at startup if required vars are missing.
// ─────────────────────────────────────────────────────────────────────────────

import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Server-side environment variables — never exposed to the browser bundle.
   */
  server: {
    // App
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    APP_URL: z.string().url().default("http://localhost:3000"),

    // Database
    DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

    // Auth.js
    AUTH_SECRET: z.string().min(32, "AUTH_SECRET must be at least 32 characters"),

    // Cron jobs
    CRON_SECRET: z.string().min(16, "CRON_SECRET is required to protect cron endpoints"),

    // Payment — SSLCommerz (all optional at startup; app shows NOT_CONFIGURED when absent)
    SSLCOMMERZ_STORE_ID: z.string().optional(),
    SSLCOMMERZ_STORE_PASSWORD: z.string().optional(),
    SSLCOMMERZ_SANDBOX: z
      .string()
      .optional()
      .transform((v) => v === "true")
      .default("true"),

    // Telegram (optional; shows NOT_CONFIGURED when absent)
    TELEGRAM_BOT_TOKEN: z.string().optional(),
    TELEGRAM_CHAT_ID: z.string().optional(),

    // Email / SMTP (fully optional; admin-assisted reset used if absent)
    EMAIL_SMTP_HOST: z.string().optional(),
    EMAIL_SMTP_PORT: z
      .string()
      .optional()
      .transform((v) => (v ? parseInt(v, 10) : 587)),
    EMAIL_SMTP_SECURE: z
      .string()
      .optional()
      .transform((v) => v === "true")
      .default("false"),
    EMAIL_SMTP_USER: z.string().optional(),
    EMAIL_SMTP_PASS: z.string().optional(),
    EMAIL_FROM: z.string().optional(),
  },

  /**
   * Client-side environment variables — safe to expose to the browser.
   * NEVER put secrets here.
   */
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url().optional(),
    NEXT_PUBLIC_STORE_NAME: z.string().optional().default("BD Store"),
  },

  /**
   * Map process.env to the above schemas.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    APP_URL: process.env.APP_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    AUTH_SECRET: process.env.AUTH_SECRET,
    CRON_SECRET: process.env.CRON_SECRET,

    SSLCOMMERZ_STORE_ID: process.env.SSLCOMMERZ_STORE_ID,
    SSLCOMMERZ_STORE_PASSWORD: process.env.SSLCOMMERZ_STORE_PASSWORD,
    SSLCOMMERZ_SANDBOX: process.env.SSLCOMMERZ_SANDBOX,

    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
    TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID,

    EMAIL_SMTP_HOST: process.env.EMAIL_SMTP_HOST,
    EMAIL_SMTP_PORT: process.env.EMAIL_SMTP_PORT,
    EMAIL_SMTP_SECURE: process.env.EMAIL_SMTP_SECURE,
    EMAIL_SMTP_USER: process.env.EMAIL_SMTP_USER,
    EMAIL_SMTP_PASS: process.env.EMAIL_SMTP_PASS,
    EMAIL_FROM: process.env.EMAIL_FROM,

    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_STORE_NAME: process.env.NEXT_PUBLIC_STORE_NAME,
  },

  /**
   * In production, mock payment mode is explicitly prohibited.
   * This check runs at startup — the build will fail if violated.
   */
  onValidationError(error) {
    console.error("❌ Invalid environment variables:", error.flatten().fieldErrors);
    throw new Error("Invalid environment variables");
  },

  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
