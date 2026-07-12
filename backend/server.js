import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

const app = express();
const port = process.env.PORT || 4000;

// Connection
connectDB();
connectCloudinary();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin: [
			process.env.FRONTEND_URL,
			"http://localhost:5173",
			"http://localhost:5174",
		].filter(Boolean),
		credentials: true,
	}),
);

// API endpoints
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

app.get("/", (req, res) => {
	res.send("API WORKING");
});

app.listen(port, () => console.log("Server started on PORT " + port));
