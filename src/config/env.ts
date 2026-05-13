import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET || "secret",
  DATABASE_URL: process.env.DATABASE_URL || "",
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
};
