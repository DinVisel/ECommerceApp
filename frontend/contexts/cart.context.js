import React, { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
	const [cartItems, setCartItems] = useState([]);

	const addToCart = (product) => {
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

	const increaseQuantity = (productId) => {
		setCartItems((prevItems) =>
			prevItems.map((item) =>
				item._id === productId ? { ...item, quantity: item.quantity + 1 } : item
			)
		);
	};

	const decreaseQuantity = (productId) => {
		setCartItems((prevItems) =>
			prevItems
				.map((item) =>
					item._id === productId
						? { ...item, quantity: item.quantity - 1 }
						: item
				)
				.filter((item) => item.quantity > 0)
		);
	};

	const removeFromCart = (productId) => {
		setCartItems((prevItems) =>
			prevItems.filter((item) => item._id !== productId)
		);
	};

	const clearCart = () => {
		setCartItems([]);
	};

	return (
		<CartContext.Provider
			value={{
				cartItems,
				addToCart,
				removeFromCart,
				clearCart,
				increaseQuantity,
				decreaseQuantity,
			}}
		>
			{children}
		</CartContext.Provider>
	);
};
