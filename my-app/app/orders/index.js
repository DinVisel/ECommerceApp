import React, { useEffect, useState, useContext } from "react";
import {
	View,
	Text,
	FlatList,
	StyleSheet,
	ActivityIndicator,
} from "react-native";
import API from "../../services/api.js";
import { AuthContext } from "../../contexts/auth.context.js";

const OrdersScreen = () => {
	const { user } = useContext(AuthContext);
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);

	const fetchOrders = async () => {
		try {
			const res = await API.get("/orders/myorders", {
				headers: { Authorization: `Bearer ${user.token}` },
			});
			setOrders(res.data);
		} catch (error) {
			console.error("Could not fetched the orders", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchOrders();
	}, []);

	if (loading)
		return <ActivityIndicator size='large' style={{ marginTop: 40 }} />;

	if (orders.length === 0) {
		return (
			<View style={styles.container}>
				<Text>You do not have any orders.</Text>
			</View>
		);
	}
	return (
		<FlatList
			data={orders}
			keyExtractor={(item) => item._id}
			contentContainerStyle={{ padding: 15 }}
			renderItem={({ item }) => (
				<View style={styles.card}>
					<Text style={styles.title}>Sipariş ID: {item._id}</Text>
					<Text>Ürün Sayısı: {item.orderItems.length}</Text>
					<Text>Toplam: {item.totalPrice || "N/A"}₺</Text>
					<Text>Tarih: {new Date(item.createdAt).toLocaleDateString()}</Text>
				</View>
			)}
		/>
	);
};

const styles = StyleSheet.create({
	center: { flex: 1, justifyContent: "center", alignItems: "center" },
	card: {
		backgroundColor: "#f4f4f4",
		padding: 15,
		marginBottom: 10,
		borderRadius: 10,
	},
	title: { fontWeight: "bold", marginBottom: 5 },
});

export default OrdersScreen;
