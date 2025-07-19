import React, { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ childeren }) => {
	const [cartItems, setCartItems] = useState([]);

	const addToChart = (product) => {
		const existing = cartItems.find((item) => item._id === product._id);

		if (existing) {
			setCartItems((prev) =>
				prev.map((item) =>
					item._id === product._id
						? { ...item, quantity: item.quantity + 1 }
						: item
				)
			);
		} else {
			setCartItems((prev) => [...prev, { ...product, quantity: 1 }]);
		}
	};

	const removeFromCart = (productId) => {
		setCartItems((prev) => prev.filter((item) => item._id !== productId));
	};

	const clearCart = () => {
		setCartItems([]);
	};

	return (
		<CartContext.Provider
			value={{ cartItems, addToChart, removeFromCart, clearCart }}
		>
			{childeren}
		</CartContext.Provider>
	);
};
