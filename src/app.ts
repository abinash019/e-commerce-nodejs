import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import { rateLimitMiddleware } from "./middleware/rateLimit.middleware.js";

import authRoutes from "./modules/auth/auth.routes.js";
import categoryRoutes from "./modules/categories/categories.routes.js";
import productsRoutes from "./modules/products/products.routes.js";
import cartRoutes from "./modules/carts/cart.routes.js";
import orderRoutes from "./modules/orders/orders.routes.js";
import paymentRoutes from "./modules/payments/payments.routes.js";

import { errorMiddleware } from "./middleware/error.middleware.js";

const app = express();

// Core middlewares
app.use(cors({ origin: true, credentials: true }));

app.use(helmet());

app.use(cookieParser());

app.use(morgan("dev"));

app.use(rateLimitMiddleware);

app.use(express.json());

// IMPORTANT:
// Stripe webhook routes BEFORE express.json()

app.use("/api/v1/payments", paymentRoutes);

// JSON parser AFTER webhook routes

// Routes
app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/products", productsRoutes);

app.use("/api/v1/cart", cartRoutes);

app.use("/api/v1/orders", orderRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Server is running",
  });
});

// Error middleware
app.use(errorMiddleware);

export default app;
