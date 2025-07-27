import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
	const { name, email, password, role } = req.body;

	try {
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ message: "This email already exists" });
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const newUser = new User({
			name,
			email,
			password: hashedPassword,
			role: role || "user",
		});

		await newUser.save();
		res.status(201).json({ message: "User registered successfully" });
	} catch (error) {
		const e = new Error("User registration failed");
		e.statusCode = 500;
		throw new Error(e);
	}
};

export const loginUser = async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ message: "Invalid email or password" });
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(400).json({ message: "Invalid email or password" });
		}

		const token = jwt.sign(
			{ id: user._id, role: user.role },
			process.env.JWT_SECRET,
			{ expiresIn: "1d" }
		);

		res.json({
			token,
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
			},
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Login failed" });
	}
};

export const updateUserRole = async (req, res) => {
	const user = await User.findById(req.params.id);

	if (!user) {
		return res.status(404).json({ message: "Kullanıcı bulunamadı" });
	}

	const newRole = req.body.role;

	// Geçerli rol mü?
	const validRoles = ["user", "seller", "admin"];
	if (!validRoles.includes(newRole)) {
		return res.status(400).json({ message: "Geçersiz rol" });
	}

	user.role = newRole;
	await user.save();

	res.status(200).json({ message: "Rol güncellendi", role: user.role });
};

export const updateUser = async (req, res) => {
	const { name, email } = req.body;
	const userId = req.params.id;

	try {
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		if (name) user.name = name;
		if (email) user.email = email;

		await user.save();

		res.status(200).json({ message: "User updated successfully", user });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "User update failed" });
	}
};
