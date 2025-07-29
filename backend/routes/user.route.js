import express from "express";
import {
	registerUser,
	loginUser,
	updateUserRole,
	updateUser,
	getFavorites,
	deleteFavorites,
	addFavorites,
} from "../controllers/user.controller.js";
import { protect, isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/:id/role", protect, isAdmin, updateUserRole);
router.put("/:id", protect, updateUser);
router.post("/:id/favorites", protect, addFavorites);
router.delete("/:id/favorites/:productId", protect, deleteFavorites);
router.get("/:id/favorites", protect, getFavorites);

router.get("/profile", protect, (req, res) => {
	res.json(req.user);
});

export default router;
