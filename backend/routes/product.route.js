import express from "express";
import {
	getProducts,
	getProductById,
	createProduct,
	updateProduct,
	deleteProduct,
	getCategories,
	getMyProducts,
} from "../controllers/product.controller.js";
import { protect, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/categories", getCategories);
router.get("/:id", getProductById);
router.post("/", protect, authorizeRoles("admin", "seller"), createProduct);
router.put("/:id", protect, authorizeRoles("admin", "seller"), updateProduct);
router.delete(
	"/:id",
	protect,
	authorizeRoles("admin", "seller"),
	deleteProduct
);
router.get("/mine", protect, authorizeRoles("admin", "seller"), getMyProducts);

export default router;
