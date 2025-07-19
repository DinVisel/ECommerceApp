import React, { useContext } from "react";
import { View, Text, FlatList, StyleSheet, Button, Alert } from "react-native";
import { CartContext } from "../../contexts/cart.context.js";

const CartScreen = () => {
	const { cartItems, removeFromCart, clearCart } = useContext(CartContext);

	const total = cartItems.reduce(
		(acc, item) => acc + item.price * item.quantity,
		0
	);

	const confirmOrder = () => {
		Alert.alert("Succesfull", "Order Placed!");
		clearCart();
	};

	if (cartItems.lenght === 0) {
		return (
			<View style={styles.center}>
				<Text>Cart is empty.</Text>
			</View>
		);
	}

	return (
		<View style={{ flex: 1, padding: 20 }}>
			<FlatList
				data={cartItems}
				keyExtractor={(item) => item._id}
				renderItem={({ item }) => (
					<View style={styles.card}>
						<View style={{ flex: 1 }}>
							<Text style={styles.name}>{item.name}</Text>
							<Text>
								{item.quantity} x {item.price}₺
							</Text>
							<Text style={{ fontWeight: "bold" }}>
								{item.quantity * item.price}₺
							</Text>
						</View>
						<Button title='Delete' onPress={() => removeFromCart(item._id)} />
					</View>
				)}
			/>
			<View style={styles.footer}>
				<Text style={styles.total}>Total: {total}₺</Text>
				<Button title='Confirm' onPress={confirmOrder} />
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	center: { flex: 1, justifyContent: "center", alignItems: "center" },
	card: {
		flexDirection: "row",
		justifyContent: "space-between",
		backgroundColor: "#f4f4f4",
		padding: 15,
		marginBottom: 10,
		borderRadius: 10,
	},
	name: { fontSize: 16, fontWeight: "bold" },
	footer: {
		borderTopWidth: 1,
		borderColor: "#ccc",
		paddingVertical: 15,
		alignItems: "center",
	},
	total: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
});

export default CartScreen;
