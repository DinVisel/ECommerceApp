import express from "express";

import {
	createOrder,
	getMyOrders,
	getAllOrders,
	getOrderById,
	markOrderAsPaid,
	markOrderAsDelivered,
} from "../controllers/order.controller.js";
import { protect, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/myorders", protect, getMyOrders);
router.get("/", protect, authorizeRoles("admin"), getAllOrders);
router.patch("/:id/pay", protect, authorizeRoles("admin", markOrderAsPaid));
router.patch(
	"/:id/deliver",
	protect,
	authorizeRoles("admin", markOrderAsDelivered)
);
router.get("/:id", protect, getOrderById);

export default router;
