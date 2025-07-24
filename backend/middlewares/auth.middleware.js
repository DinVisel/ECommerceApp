import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protect = async (req, res, next) => {
	let token;

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		try {
			token = req.headers.authorization.split(" ")[1];
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			req.user = await User.findById(decoded.id).select("-password");
			next();
		} catch (error) {
			console.error("Unauthorized", error);
			res.status(401).json({ message: "Not authorized, token failed" });
		}
	}
	if (!token) {
		return res.status(401).json({ message: "Not authorized, no token" });
	}
};

export const authorizeRoles = (...allowedRoles) => {
	return (req, res, next) => {
		if (!req.user || !allowedRoles.includes(req.user.role)) {
			return res.status(403).json({ message: "Bu işlem için yetkiniz yok." });
		}
		next();
	};
};

export const isAdmin = (req, res, next) => {
	if (req.user && req.user.role === "admin") {
		next();
	} else {
		res.status(403).json({ message: "Yalnızca admin erişebilir" });
	}
};

export const isAuth = async (req, res, next) => {
	try {
		const authHeader = req.headers.authorization;

		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return res.status(401).json({ message: "Not authorized, no token" });
		}

		const token = authHeader.split(" ")[1];
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		const user = await User.findById(decoded.id).select("-password");

		if (!user) {
			return res
				.status(401)
				.json({ message: "Not authorized, user not found" });
		}

		req.user = user;
		next();
	} catch (error) {
		console.error("Auth Error:", error);
		res.status(401).json({ message: "Not authorized, token failed" });
	}
};
