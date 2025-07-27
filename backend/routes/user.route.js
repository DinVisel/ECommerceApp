import express from "express";
import {
	registerUser,
	loginUser,
	updateUserRole,
} from "../controllers/user.controller.js";
import { protect, isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/:id/role", protect, isAdmin, updateUserRole);
router.put("/:id", protect, updateUser);

router.get("/profile", protect, (req, res) => {
	res.json(req.user);
});

export default router;
