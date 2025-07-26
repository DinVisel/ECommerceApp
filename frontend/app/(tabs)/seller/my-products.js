import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	FlatList,
	StyleSheet,
	TouchableOpacity,
} from "react-native";
import { useAuth } from "../../../contexts/auth.context";
import { useRouter } from "expo-router";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

export default function MyProductsScreen() {
	const { user } = useAuth();
	const router = useRouter();
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);

	const fetchSellerProducts = async () => {
		try {
			const res = await axios.get(
				`https://your-api.com/products?sellerId=${user.id}`
			);
			setProducts(res.data);
		} catch (err) {
			console.error("Ürünler alınırken hata:", err.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchSellerProducts();
	}, []);

	const renderProduct = ({ item }) => (
		<TouchableOpacity
			style={styles.card}
			onPress={() => router.push(`/seller/product/${item._id}`)}
		>
			<Text style={styles.name}>{item.name}</Text>
			<Text>Fiyat: {item.price} ₺</Text>
			<Text>Stok: {item.stock}</Text>
		</TouchableOpacity>
	);

	return (
		<View style={styles.container}>
			<Text style={styles.heading}>Ürünlerim</Text>
			<TouchableOpacity onPress={() => router.back()}>
				<Ionicons name='arrow-back' size={24} color='black' />
			</TouchableOpacity>

			{loading ? (
				<Text>Yükleniyor...</Text>
			) : products.length === 0 ? (
				<Text>Henüz hiç ürün eklemediniz.</Text>
			) : (
				<FlatList
					data={products}
					keyExtractor={(item) => item._id}
					renderItem={renderProduct}
				/>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
	},
	heading: {
		fontSize: 22,
		fontWeight: "bold",
		marginBottom: 12,
	},
	card: {
		backgroundColor: "#f5f5f5",
		padding: 16,
		borderRadius: 8,
		marginBottom: 12,
	},
	name: {
		fontSize: 18,
		fontWeight: "bold",
	},
});
