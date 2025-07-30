import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		orderItems: [
			{
				name: { type: String, required: true },
				quantity: { type: Number, required: true },
				image: String,
				price: { type: Number, required: true },
				product: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Product",
					required: true,
				},
			},
		],
		shippingAddress: {
			address: String,
			city: String,
			postalCode: String,
			country: String,
		},
		paymentMethod: String,
		totalPrice: Number,
		isPaid: { type: Boolean, default: false },
		paidAt: Date,
		isDelivered: { type: Boolean, default: false },
		deliveredAt: Date,
		status: { type: String, default: "Getting Ready" },
		shippingCost: { type: Number, required: true },
	},
	{ timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
