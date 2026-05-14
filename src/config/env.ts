import "dotenv/config";

export const env = {
  PORT: process.env.PORT || 5000,
  JWT_SECRET: process.env.JWT_SECRET || "secret",

  DATABASE_URL: process.env.DATABASE_URL,

  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,

  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,

  STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
};
