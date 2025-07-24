import Order from "../models/order.model.js";

export const createOrder = async (req, res) => {
	const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;

	if (!orderItems || orderItems.lenght === 0)
		return res.status(400).json({ message: "Order cannot be emty" });

	try {
		const order = new Order({
			user: req.user._id,
			orderItems,
			shippingAddress,
			paymentMethod,
			totalPrice,
		});

		const createdOrder = await order.save();
		res.status(201).json(createdOrder);
	} catch (error) {
		res.status(500).json({ message: "Server error" });
	}
};

export const markOrderAsPaid = async (req, res) => {
	try {
		const order = await Order.findById(req.params.id);

		if (order) {
			order.isPaid = true;
			order.paidAt = Date.now();

			const updatedOrder = await order.save();
			res.json(updatedOrder);
		} else {
			res.status(404).json({ message: "Order not found" });
		}
	} catch (error) {
		res.status(500).json({ message: "Server error" });
	}
};

export const markOrderAsDelivered = async (req, res) => {
	try {
		const order = await Order.findById(req.params.id);

		if (order) {
			order.isDelivered = true;
			order.deliveredAt = Date.now();

			const updatedOrder = await order.save();
			res.json(updatedOrder);
		} else {
			res.status(404).json({ message: "Order not found" });
		}
	} catch (error) {
		res.status(500).json({ message: "Server error" });
	}
};

export const getOrderById = async (req, res) => {
	try {
		const order = await Order.findById(req.params.id).populate(
			"user",
			"name email"
		);
		if (order) {
			res.json(order);
		} else {
			res.status(404).json({ message: "Sipariş bulunamadı." });
		}
	} catch (err) {
		res.status(500).json({ message: "Sunucu hatası." });
	}
};

export const getAllOrders = async (req, res) => {
	try {
		const orders = await Order.find().populate("user", "name email");
		res.json(orders);
	} catch (error) {
		res.status(500).json({ message: "Failed to fetch orders", error });
	}
};

export const getMyOrders = async (req, res) => {
	try {
		const orders = await Order.find({ user: req.user._id });
		res.json(orders);
	} catch (error) {
		res.status(500).json({ message: "Siparişler alınamadı", error });
	}
};
