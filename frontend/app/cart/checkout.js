import React, { useContext, useState } from "react";
import {
	View,
	Text,
	TextInput,
	Button,
	StyleSheet,
	Alert,
	TouchableOpacity,
} from "react-native";
import { CartContext } from "../../contexts/cart.context.js";
import API from "../../services/api";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../contexts/auth.context.js";

const CheckoutScreen = () => {
	const { cartItems, clearCart } = useContext(CartContext);
	const [shippingAddress, setShippingAddress] = useState({
		address: "",
		city: "",
		postalCode: "",
		country: "",
	});
	const [paymentMethod, setPaymentMethod] = useState("Credit Card");
	const router = useRouter();
	const { user } = useAuth();

	const totalPrice = cartItems.reduce(
		(acc, item) => acc + item.price * item.quantity,
		0
	);

	const placeOrder = async () => {
		if (!shippingAddress.address.trim()) {
			Alert.alert("Missing Address", "Please enter a shipping address");
			return;
		}

		try {
			const res = await API.post(
				"/orders",
				{
					orderItems: cartItems,
					totalPrice,
					shippingAddress: address,
					paymentMethod,
				},
				{
					headers: { Authorization: `Bearer ${user.token}` },
				}
			);

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
				value={shippingAddress.address}
				onChangeText={(text) =>
					setShippingAddress({ ...shippingAddress, address: text })
				}
				placeholder='Enter your address'
			/>

			<TouchableOpacity onPress={() => setPaymentMethod("Kredi Kartı")}>
				<Text
					style={
						paymentMethod === "Kredi Kartı" ? styles.selected : styles.option
					}
				>
					🏦 Kredi Kartı
				</Text>
			</TouchableOpacity>

			<TouchableOpacity onPress={() => setPaymentMethod("Kapıda Ödeme")}>
				<Text
					style={
						paymentMethod === "Kapıda Ödeme" ? styles.selected : styles.option
					}
				>
					💸 Kapıda Ödeme
				</Text>
			</TouchableOpacity>

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
	option: {
		padding: 10,
		backgroundColor: "#f2f2f2",
		borderRadius: 6,
		marginBottom: 10,
	},
	selected: {
		padding: 10,
		backgroundColor: "#d1e7dd",
		borderColor: "green",
		borderWidth: 1,
		borderRadius: 6,
		marginBottom: 10,
	},
});

export default CheckoutScreen;
