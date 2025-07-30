import React, { useState, useEffect, useContext } from "react";
import {
	View,
	Text,
	FlatList,
	ActivityIndicator,
	TouchableOpacity,
	StyleSheet,
} from "react-native";
import API from "../../services/api";
import { AuthContext } from "../../contexts/auth.context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const SellerOrdersScreen = () => {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const { user } = useContext(AuthContext);
	const router = useRouter();

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				const res = await API.get("/orders/seller", {
					headers: { Authorization: `Bearer ${user.token}` },
				});
				setOrders(res.data);
			} catch (err) {
				console.error("Seller orders error:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchOrders();
	}, []);

	const renderItem = ({ item }) => (
		<View style={styles.card}>
			<Text style={styles.bold}>Order ID: {item._id}</Text>
			<Text>Buyer: {item.user?.name}</Text>
			<Text>Date: {new Date(item.createdAt).toLocaleDateString()}</Text>
			<Text>Total: {item.totalPrice}₺</Text>
			<Text>Status: {item.isDelivered ? "Delivered" : "Pending"}</Text>
		</View>
	);

	if (loading)
		return <ActivityIndicator size='large' style={{ marginTop: 30 }} />;

	if (orders.length === 0)
		return (
			<View style={styles.center}>
				<Text>No orders found for your products.</Text>
			</View>
		);

	return (
		<View style={styles.container}>
			<TouchableOpacity onPress={() => router.back()}>
				<Ionicons name='arrow-back' size={24} color='black' />
			</TouchableOpacity>
			<FlatList
				data={orders}
				renderItem={renderItem}
				keyExtractor={(item) => item._id}
				contentContainerStyle={{ paddingBottom: 100 }}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1, padding: 15 },
	center: { flex: 1, justifyContent: "center", alignItems: "center" },
	card: {
		backgroundColor: "#fff",
		padding: 15,
		borderRadius: 10,
		elevation: 2,
		marginBottom: 12,
	},
	bold: { fontWeight: "bold", marginBottom: 4 },
});

export default SellerOrdersScreen;
