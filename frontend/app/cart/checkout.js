import React, { useContext, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	Alert,
	TouchableOpacity,
	ActivityIndicator,
} from "react-native";
import {
	TextInput as PaperInput,
	Button as PaperButton,
} from "react-native-paper";
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
	const [processingPayment, setProcessingPayment] = useState(false);
	const router = useRouter();
	const { user } = useAuth();

	const totalPrice = cartItems.reduce(
		(acc, item) => acc + item.price * item.quantity,
		0
	);
	const shippingCost = 0;

	const processPayment = () =>
		new Promise((resolve) => setTimeout(resolve, 2000));

	const placeOrder = async () => {
		if (!shippingAddress.address.trim()) {
			Alert.alert("Missing Address", "Please enter a shipping address");
			return;
		}

		try {
			setProcessingPayment(true);
			await processPayment();
			const res = await API.post(
				"/orders",
				{
					orderItems: cartItems,
					totalPrice,
					shippingAddress,
					paymentMethod,
					shippingCost,
				},
				{
					headers: { Authorization: `Bearer ${user.token}` },
				}
			);

			Alert.alert("Payment Successful", "Your payment has been processed.");
			clearCart();
			Alert.alert("Order Placed", "Your order has been placed succesfully");
			router.replace("/");
		} catch (error) {
			console.error("Order error:", error);
			Alert.alert("Error", "Failed to place order.");
		} finally {
			setProcessingPayment(false);
		}
	};

	return (
		<View style={styles.container}>
			<TouchableOpacity onPress={() => router.back()}>
				<Ionicons name='arrow-back' size={24} color='black' />
			</TouchableOpacity>
			<Text style={styles.label}>Shipping Address</Text>
			<PaperInput
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

			{processingPayment ? (
				<ActivityIndicator size='large' />
			) : (
				<PaperButton
					mode='contained'
					onPress={placeOrder}
					style={styles.button}
				>
					Place Order
				</PaperButton>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: { padding: 20 },
	label: { fontWeight: "bold", marginBottom: 5 },
	input: { marginBottom: 15 },
	button: { marginTop: 10 },
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
