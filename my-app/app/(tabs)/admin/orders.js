import React, { useEffect, useState, useContext } from "react";
import {
	View,
	Text,
	FlatList,
	StyleSheet,
	ActivityIndicator,
	Alert,
} from "react-native";
import { AuthContext } from "../../../contexts/auth.context.js";
import API from "../../../services/api";
import { useRouter } from "expo-router";

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
	useEffect(() => {
		fetchOrders();
	}, []);
	if (loading)
		return <ActivityIndicator size='large' style={{ marginTop: 40 }} />;
	return (
		<FlatList
			data={orders}
			keyExtractor={(item) => item._id}
			contentContainerStyle={{ padding: 15 }}
			renderItem={({ item }) => (
				<View style={styles.card}>
					<Text style={styles.title}>Sipariş ID: {item._id}</Text>
					<Text>Kullanıcı: {item.user?.name || "Bilinmiyor"}</Text>
					<Text>Ürün Sayısı: {item.orderItems.length}</Text>
					<Text>Toplam: {item.totalPrice || "N/A"}₺</Text>
					<Text>
						Durum: {item.isPaid ? "Ödendi" : "Bekliyor"} /{" "}
						{item.isDelivered ? "Teslim Edildi" : "Bekliyor"}
					</Text>
					<Text>Tarih: {new Date(item.createdAt).toLocaleDateString()}</Text>
				</View>
			)}
		/>
	);
};

const styles = StyleSheet.create({
	card: {
		backgroundColor: "#e8f0fe",
		padding: 15,
		marginBottom: 10,
		borderRadius: 10,
	},
	title: { fontWeight: "bold", marginBottom: 5 },
});

export default AdminOrders;
