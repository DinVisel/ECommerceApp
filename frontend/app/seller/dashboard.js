import React, { useContext, useEffect, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	ActivityIndicator,
} from "react-native";
import { AuthContext } from "../../contexts/auth.context.js";
import API from "../../services/api.js";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const SellerDashboard = () => {
	const { user } = useContext(AuthContext);
	const [productCount, setProductCount] = useState(0);
	const [orderCount, setOrderCount] = useState(0);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		const fetchSellerStats = async () => {
			try {
				const [productsRes, ordersRes] = await Promise.all([
					API.get(`/products/mine`, {
						headers: { Authorization: `Bearer ${user.token}` },
					}),
					API.get(`/orders/seller`, {
						headers: { Authorization: `Bearer ${user.token}` },
					}),
				]);

				setProductCount(productsRes.data.length);
				setOrderCount(ordersRes.data.length);
			} catch (err) {
				console.error("Seller dashboard error:", err);
			} finally {
				setLoading(false);
			}
		};

		if (user?.token) fetchSellerStats();
	}, []);

	if (loading) {
		return <ActivityIndicator size='large' style={{ marginTop: 40 }} />;
	}

	return (
		<View style={styles.container}>
			<TouchableOpacity
				onPress={() => router.back()}
				style={{ marginBottom: 15 }}
			>
				<Ionicons name='arrow-back' size={24} color='black' />
			</TouchableOpacity>

			<Text style={styles.title}>Merhaba, {user?.name}</Text>

			<View style={styles.statsContainer}>
				<View style={styles.card}>
					<Text style={styles.statTitle}>Ürün Sayısı</Text>
					<Text style={styles.statValue}>{productCount}</Text>
				</View>
				<View style={styles.card}>
					<Text style={styles.statTitle}>Sipariş Sayısı</Text>
					<Text style={styles.statValue}>{orderCount}</Text>
				</View>
			</View>

			<TouchableOpacity
				style={styles.button}
				onPress={() => router.push("/seller/my-products")}
			>
				<Text style={styles.buttonText}>Ürünlerim</Text>
			</TouchableOpacity>

			<TouchableOpacity
				style={styles.button}
				onPress={() => router.push("/seller/my-orders")}
			>
				<Text style={styles.buttonText}>Siparişlerim</Text>
			</TouchableOpacity>

			<TouchableOpacity
				style={styles.button}
				onPress={() => router.push("/add-product")}
			>
				<Text style={styles.buttonText}>Yeni Ürün Ekle</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1, padding: 20 },
	title: {
		fontSize: 22,
		fontWeight: "bold",
		marginBottom: 20,
	},
	statsContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 30,
	},
	card: {
		flex: 1,
		backgroundColor: "#f1f1f1",
		padding: 20,
		borderRadius: 10,
		marginHorizontal: 5,
		alignItems: "center",
	},
	statTitle: {
		fontSize: 14,
		color: "#555",
		marginBottom: 5,
	},
	statValue: {
		fontSize: 20,
		fontWeight: "bold",
	},
	button: {
		backgroundColor: "#007bff",
		padding: 15,
		borderRadius: 10,
		alignItems: "center",
		marginBottom: 15,
	},
	buttonText: {
		color: "#fff",
		fontWeight: "bold",
		fontSize: 16,
	},
});

export default SellerDashboard;
