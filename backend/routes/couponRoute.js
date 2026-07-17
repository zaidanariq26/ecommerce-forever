import express from "express";
import { createCoupon, listCoupons, deleteCoupon, validateCoupon } from "../controllers/couponController.js";
import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/auth.js";

const couponRouter = express.Router();

couponRouter.post("/create", adminAuth, createCoupon);
couponRouter.get("/list", adminAuth, listCoupons);
couponRouter.post("/remove", adminAuth, deleteCoupon);
couponRouter.post("/validate", authUser, validateCoupon);

export default couponRouter;
