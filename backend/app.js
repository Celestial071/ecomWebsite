import express from "express";
import dotenv from "dotenv"
import authRoutes from "./routes/auth.routes.js";
import {connDB} from "./libs/db.js";
import cookieParser from "cookie-parser";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import couponRoutes from "./routes/coupon.routes.js";
import paymentRoutes from "./routes/payment.routes.js";

dotenv.config();

const port = process.env.PORT || 5000
const connStr = process.env.CONNDB

const server = express();

server.use(express.json());
server.use(cookieParser());

server.use("/api/auth", authRoutes);
server.use("/api/products", productRoutes);
server.use("api/cart", cartRoutes);
server.use("/api/coupons", couponRoutes);
server.use("/api/payment", paymentRoutes);

server.listen(port, () => {
  console.log(`The server is running at port ${port} successfully`);
  connDB(connStr);
});
