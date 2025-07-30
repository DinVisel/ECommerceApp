import React, { useContext } from "react";
import {
	View,
	Text,
	FlatList,
	StyleSheet,
	Button,
	Alert,
	TouchableOpacity,
} from "react-native";
import { CartContext } from "../../contexts/cart.context.js";
import API from "../../services/api.js";
import { AuthContext } from "../../contexts/auth.context.js";
import { router } from "expo-router";

const CartScreen = () => {
	const {
		cartItems,
		increaseQuantity,
		decreaseQuantity,
		removeFromCart,
		clearCart,
	} = useContext(CartContext);

	const { user } = useContext(AuthContext);

	const total = cartItems.reduce(
		(acc, item) => acc + item.price * item.quantity,
		0
	);
	const shippingCost = 0;

	const confirmOrder = async () => {
		try {
			const orderPayload = {
				orderItems: cartItems.map((item) => ({
					product: item._id,
					quantity: item.quantity,
				})),
				shippingCost,
			};

			await API.post("/orders", orderPayload, {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			});

			Alert.alert("Successful", "Order Placed!");
			router.push("/cart/checkout");
		} catch (err) {
			console.error("Order could not sent:", err);
			Alert.alert("Error", "Order could not get placed");
		}
	};

	if (cartItems.length === 0) {
		return (
			<View style={styles.center}>
				<Text>Cart is empty.</Text>
			</View>
		);
	}

	const renderItem = ({ item }) => (
		<View style={styles.item}>
			<Text style={styles.name}>{item.name}</Text>
			<Text style={{ marginVertical: 4 }}>
				{item.quantity} x {item.price}₺
			</Text>

			<View style={styles.row}>
				<TouchableOpacity
					style={styles.qtyButton}
					onPress={() => decreaseQuantity(item._id)}
				>
					<Text>-</Text>
				</TouchableOpacity>

				<Text style={{ marginHorizontal: 10 }}>{item.quantity}</Text>

				<TouchableOpacity
					style={styles.qtyButton}
					onPress={() => increaseQuantity(item._id)}
				>
					<Text>+</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.removeButton}
					onPress={() => removeFromCart(item._id)}
				>
					<Text style={{ color: "white" }}>X</Text>
				</TouchableOpacity>
			</View>
		</View>
	);

	return (
		<View style={{ flex: 1, padding: 20 }}>
			<FlatList
				data={cartItems}
				keyExtractor={(item) => item._id}
				renderItem={renderItem}
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
	row: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: 5,
	},
	qtyButton: {
		backgroundColor: "#eee",
		padding: 6,
		borderRadius: 4,
	},
	removeButton: {
		backgroundColor: "#ff4d4d",
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 4,
		marginLeft: 10,
	},
});

export default CartScreen;
