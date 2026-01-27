import "dotenv/config";
import { z } from "zod";
import { logger } from "../lib/logger.js";

const EnvSchema = z.object({
  PORT: z.string().default("5000"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  CLERK_PUBLISHABLE_KEY: z.string(),
  CLERK_SECRET_KEY: z.string(),
  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  logger.error("Invalid environment variables", parsed.error.flatten());
  process.exit(1);
}

export const env = parsed.data;
