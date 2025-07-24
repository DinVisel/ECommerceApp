import User from "../models/user.model.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";

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
		const totalProducts = await Product.countDocuments();

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

export const getGraph = async (req, res) => {
	try {
		const today = new Date();
		const sevenDaysAgo = new Date();
		sevenDaysAgo.setDate(today.getDate() - 6);

		const stats = await Order.aggregate([
			{
				$match: {
					createdAt: { $gte: sevenDaysAgo },
				},
			},
			{
				$group: {
					_id: {
						$dateToString: { format: "%Y_%m-%d", date: "$createdAt" },
					},
					totalRevenue: { $sum: "$totalPrice" },
					count: { $sum: 1 },
				},
			},
			{ $sort: { _id: 1 } },
		]);
		res.json(stats);
	} catch (error) {
		res.status(500).json({ message: "Graph data error", error: error.message });
	}
};

export const getTopProducts = async (req, res) => {
	try {
		const products = await Order.aggregate([
			{ $unwind: "$orderItems" },
			{
				$group: {
					_id: "$orderItems.name",
					totalSold: { $sum: "$orderItems.quantity" },
				},
			},
			{ $sort: { totalSold: -1 } },
			{ $limit: 5 },
		]);

		res.json(products);
	} catch (error) {
		res
			.status(500)
			.json({ message: "Top products error", error: error.message });
	}
};

export const getTopUsers = async (req, res) => {
	try {
		const users = await Order.aggregate([
			{
				$group: {
					_id: "$user",
					totalSpent: { $sum: "$totalPrice" },
					orderCount: { $sum: 1 },
				},
			},
			{ $sort: { totalSpent: -1 } },
			{ $limit: 5 },
			{
				$lookup: {
					from: "users",
					localField: "_id",
					foreignField: "_id",
					as: "userInfo",
				},
			},
			{ $unwind: "$userInfo" },
			{
				$project: {
					name: "$userInfo.name",
					email: "$userInfo.email",
					totalSpent: 1,
					orderCount: 1,
				},
			},
		]);

		res.json(users);
	} catch (error) {
		res.status(500).json({ message: "Top users error", error: error.message });
	}
};

export const getCategorySales = async (req, res) => {
	try {
		const stats = await Order.aggregate([
			{ $unwind: "$orderItems" },
			{
				$lookup: {
					from: "products",
					localField: "orderItems.product",
					foreignField: "_id",
					as: "productInfo",
				},
			},
			{ $unwind: "$productInfo" },
			{
				$group: {
					_id: "$productInfo.category",
					totalSold: { $sum: "$orderItems.quantity" },
				},
			},
			{ $sort: { totalSold: -1 } },
		]);

		res.json(stats);
	} catch (error) {
		res
			.status(500)
			.json({ message: "Category sales error", error: error.message });
	}
};

export const getTopProductsChart = async (req, res) => {
	try {
		const topProducts = await Order.aggregate([
			{ $unwind: "$orderItems" },
			{
				$group: {
					_id: "$orderItems.product",
					totalSold: { $sum: "$orderItems.quantity" },
				},
			},
			{
				$lookup: {
					from: "products",
					localField: "_id",
					foreignField: "_id",
					as: "productInfo",
				},
			},
			{ $unwind: "$productInfo" },
			{
				$project: {
					name: "$productInfo.name",
					totalSold: 1,
				},
			},
			{ $sort: { totalSold: -1 } },
			{ $limit: 5 },
		]);

		res.json(topProducts);
	} catch (error) {
		res
			.status(500)
			.json({ message: "Top products chart error", error: error.message });
	}
};

export const getTopUsersChart = async (req, res) => {
	try {
		const topUsers = await Order.aggregate([
			{
				$group: {
					_id: "$user",
					orderCount: { $sum: 1 },
					totalSpent: { $sum: "$totalPrice" },
				},
			},
			{
				$lookup: {
					from: "users",
					localField: "_id",
					foreignField: "_id",
					as: "userInfo",
				},
			},
			{ $unwind: "$userInfo" },
			{
				$project: {
					name: "$userInfo.name",
					orderCount: 1,
					totalSpent: 1,
				},
			},
			{ $sort: { orderCount: -1 } },
			{ $limit: 5 },
		]);

		res.json(topUsers);
	} catch (error) {
		res
			.status(500)
			.json({ message: "Top users chart error", error: error.message });
	}
};
