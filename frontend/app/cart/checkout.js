import React, { useContext, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { CartContext } from "../../contexts/cart.context";
import API from "../../services/api";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const CheckoutScreen = () => {
	const { cartItems, clearCart } = useContext(CartContext);
	const [address, setAddress] = useState("");
	const router = useRouter();

	const totalPrice = cartItems.reduce(
		(acc, item) => acc + item.price * item.quantity,
		0
	);

	const placeOrder = async () => {
		if (!address.trim()) {
			Alert.alert("Missing Address", "Please enter a shipping address");
			return;
		}

		try {
			const res = await API.post("/orders", {
				orderItems: cartItems,
				totalPrice,
				shippingAddress: address,
				paymentMethod: "Cash",
			});

			clearCart();
			Alert.alert("Order Placed", "Your order has been placed succesfully");
			router.replace("/");
		} catch (error) {
			console.error("Order error:", error);
			Alert.alert("Error", "Failed to place order.");
		}
	};

	return (
		<View style={styles.container}>
			<TouchableOpacity onPress={() => router.back()}>
				<Ionicons name='arrow-back' size={24} color='black' />
			</TouchableOpacity>
			<Text style={styles.label}>Shipping Address</Text>
			<TextInput
				style={styles.input}
				value={address}
				onChangeText={setAddress}
				placeholder='Enter your address'
			/>

			<Text style={styles.total}>Total: {totalPrice}₺</Text>

			<Button title='Place Order' onPress={placeOrder} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: { padding: 20 },
	label: { fontWeight: "bold", marginBottom: 5 },
	input: {
		borderWidth: 1,
		borderColor: "#ccc",
		marginBottom: 15,
		padding: 10,
		borderRadius: 6,
	},
	total: { fontSize: 16, fontWeight: "bold", marginBottom: 20 },
});

export default CheckoutScreen;
