import User from "../models/user.model.js";

export const getAllUsers = async (req, res) => {
	try {
		const users = await User.find().select("-password");
		res.json(users);
	} catch (err) {
		res.status(500).json({ message: "Sunucu hatası." });
	}
};

export const deleteUser = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);

		if (user) {
			if (user._id.toString() === req.user._id.toString()) {
				return res.status(400).json({ message: "Kendini silemezsin." });
			}
			await user.remove();
			res.json({ message: "Kullanıcı silindi." });
		} else {
			res.status(404).json({ message: "Kullanıcı bulunamadı." });
		}
	} catch (err) {
		res.status(500).json({ message: "Sunucu hatası." });
	}
};

export const updateUserRole = async (req, res) => {
	try {
		const { role } = req.body;
		const user = await User.findById(req.params.id);

		if (user) {
			user.role = role || user.role;
			const updatedUser = await user.save();
			res.json(updatedUser);
		} else {
			res.status(404).json({ message: "Kullanıcı bulunamadı." });
		}
	} catch (err) {
		res.status(500).json({ message: "Sunucu hatası." });
	}
};

export const getDashboard = async (req, res) => {
	try {
		const totalUsers = await User.countDocuments();
		const totalOrders = await Order.countDocuments();
		const totalRevenueAgg = await Order.aggregate([
			{ $group: { _id: null, total: { $sum: "$totalPrice" } } },
		]);
		const totalRevenue = totalRevenueAgg[0]?.total || 0;
		const totalProducts = await ProductDetail.countDocuments();

		res.json({
			totalUsers,
			totalOrders,
			totalRevenue,
			totalProducts,
		});
	} catch (error) {
		res.status(500).json({ message: "Dashboard data error", error: error });
	}
};
