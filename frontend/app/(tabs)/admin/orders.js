import React, { useEffect, useState, useContext } from "react";
import {
	View,
	Text,
	FlatList,
	StyleSheet,
	ActivityIndicator,
	TouchableOpacity,
	Alert,
} from "react-native";
import { AuthContext } from "../../../contexts/auth.context.js";
import API from "../../../services/api.js";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const AdminOrders = () => {
	const { user } = useContext(AuthContext);
	const router = useRouter();
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);

	const fetchOrders = async () => {
		try {
			const res = await API.get("/orders", {
				headers: { Authorization: `Bearer ${user.token}` },
			});
			setOrders(res.data);
		} catch (error) {
			console.error("Admin orders could not recieved", error);
			Alert.alert("Error", "Only admin users can see this page");
			router.push("/");
		} finally {
			setLoading(false);
		}
	};

	const markAsDelivered = async (id) => {
		try {
			await API.put(
				`/orders/${id}/deliver`,
				{},
				{
					headers: { Authorization: `Bearer ${user.token}` },
				}
			);
			Alert.alert("Success", "Marked as delivered.");
			fetchOrders();
		} catch (err) {
			Alert.alert("Error", "Failed to update delivery status.");
		}
	};

	useEffect(() => {
		if (user?.role === "admin") {
			fetchOrders();
		}
	}, []);

	if (loading)
		return <ActivityIndicator size='large' style={{ marginTop: 40 }} />;

	const renderItem = ({ item }) => (
		<View style={styles.card}>
			<Text style={styles.id}>Order ID: {item._id}</Text>
			<Text>User: {item.user?.name}</Text>
			<Text>Total: {item.totalPrice}₺</Text>
			<Text>Status: {item.isDelivered ? "Delivered" : "Pending"}</Text>
			{!item.isDelivered && (
				<TouchableOpacity
					style={styles.button}
					onPress={() => markAsDelivered(item._id)}
				>
					<Text style={{ color: "white" }}>Mark as Delivered</Text>
				</TouchableOpacity>
			)}
		</View>
	);

	return (
		<FlatList
			data={orders}
			renderItem={renderItem}
			keyExtractor={(item) => item._id}
			contentContainerStyle={{ padding: 10 }}
		/>
	);
};

const styles = StyleSheet.create({
	card: {
		backgroundColor: "#fff",
		padding: 15,
		borderRadius: 10,
		elevation: 2,
		marginBottom: 12,
	},
	id: { fontWeight: "bold", marginBottom: 4 },
	button: {
		marginTop: 10,
		backgroundColor: "#28a745",
		padding: 10,
		borderRadius: 6,
		alignItems: "center",
	},
	title: { fontWeight: "bold", marginBottom: 5 },
});

export default AdminOrders;
