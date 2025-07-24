import express from "express";
import {
	getAllUsers,
	deleteUser,
	updateUserRole,
	getDashboard,
	getGraph,
} from "../controllers/admin.controller.js";
import {
	protect,
	authorizeRoles,
	isAdmin,
} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(protect, authorizeRoles("admin"));

router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.put("/users/:id", updateUserRole);
router.get("/dashboard", isAuth, isAdmin, getDashboard);
router.get("/dashboard/stats", isAuth, isAdmin, getGraph);

export default router;
