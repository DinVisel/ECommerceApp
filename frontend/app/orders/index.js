import React, { useEffect, useState, useContext } from "react";
import {
	View,
	Text,
	FlatList,
	StyleSheet,
	ActivityIndicator,
	TouchableOpacity,
} from "react-native";
import API from "../../services/api";
import { useRouter } from "expo-router";
import { AuthContext } from "../../contexts/auth.context";
import { Ionicons } from "@expo/vector-icons";

const MyOrdersScreen = () => {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const router = useRouter();
	const { user } = useContext(AuthContext);

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				const res = await API.get("/orders/myorders", {
					headers: {
						Authorization: `Bearer ${user.token}`,
					},
				});
				setOrders(res.data);
			} catch (err) {
				console.error("Failed to load orders", err);
			} finally {
				setLoading(false);
			}
		};

		if (user?.token) {
			fetchOrders();
		}
	}, []);

	if (loading) {
		return <ActivityIndicator size='large' style={{ marginTop: 30 }} />;
	}

	if (orders.length === 0) {
		return (
			<View style={styles.center}>
				<Text>No orders found</Text>
			</View>
		);
	}

	const renderItem = ({ item }) => (
		<TouchableOpacity
			style={styles.card}
			onPress={() => router.push(`/orders/${item._id}`)} // Opsiyonel: detay sayfası
		>
			<Text style={styles.id}>Order ID: {item._id}</Text>
			<Text>Date: {new Date(item.createdAt).toLocaleDateString()}</Text>
			<Text>Total: {item.totalPrice}₺</Text>
			<Text>Status: {item.isDelivered ? "Delivered" : "Pending"}</Text>
		</TouchableOpacity>
	);

	return (
		<>
			<TouchableOpacity onPress={() => router.back()}>
				<Ionicons name='arrow-back' size={24} color='black' />
			</TouchableOpacity>
			<FlatList
				data={orders}
				renderItem={renderItem}
				keyExtractor={(item) => item._id}
				contentContainerStyle={{ padding: 10 }}
			/>
		</>
	);
};

const styles = StyleSheet.create({
	center: { flex: 1, justifyContent: "center", alignItems: "center" },
	card: {
		backgroundColor: "#fff",
		padding: 15,
		borderRadius: 10,
		elevation: 2,
		marginBottom: 12,
	},
	id: {
		fontWeight: "bold",
		marginBottom: 4,
	},
});

export default MyOrdersScreen;
