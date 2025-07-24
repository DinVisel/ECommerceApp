import express from "express";
import {
	getAllUsers,
	deleteUser,
	updateUserRole,
	getDashboard,
	getGraph,
	getTopProducts,
	getTopUsers,
	getCategorySales,
} from "../controllers/admin.controller.js";
import {
	protect,
	authorizeRoles,
	isAdmin,
	isAuth,
} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(protect, authorizeRoles("admin"));

router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.put("/users/:id", updateUserRole);
router.get("/dashboard", isAuth, isAdmin, getDashboard);
router.get("/dashboard/stats", isAuth, isAdmin, getGraph);
router.get("/dashboard/top-products", isAuth, isAdmin, getTopProducts);
router.get("/dashboard/top-users", isAuth, isAdmin, getTopUsers);
router.get("/dashboard/category-sales", isAuth, isAdmin, getCategorySales);

export default router;
