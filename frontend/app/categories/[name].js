import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	FlatList,
	StyleSheet,
	TouchableOpacity,
	ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import API from "../../services/api.js";

export default function CategoryProductsScreen() {
	const { name } = useLocalSearchParams();
	const router = useRouter();
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const res = await API.get("/products", { params: { category: name } });
				setProducts(res.data);
			} catch (err) {
				console.error("Failed to load products for category", err);
			} finally {
				setLoading(false);
			}
		};
		fetchProducts();
	}, [name]);

	const renderItem = ({ item }) => (
		<TouchableOpacity
			style={styles.card}
			onPress={() => router.push(`/products/${item._id}`)}
		>
			<Text style={styles.name}>{item.name}</Text>
			<Text>{item.price}₺</Text>
		</TouchableOpacity>
	);

	if (loading) {
		return <ActivityIndicator size='large' style={{ marginTop: 30 }} />;
	}

	if (products.length === 0) {
		return (
			<View style={styles.center}>
				<Text>No products found.</Text>
			</View>
		);
	}

	return (
		<FlatList
			data={products}
			renderItem={renderItem}
			keyExtractor={(item) => item._id}
			contentContainerStyle={{ padding: 10 }}
		/>
	);
}

const styles = StyleSheet.create({
	center: { flex: 1, justifyContent: "center", alignItems: "center" },
	card: {
		backgroundColor: "#fff",
		padding: 15,
		borderRadius: 10,
		elevation: 2,
		marginBottom: 12,
	},
	name: { fontWeight: "bold", fontSize: 16, marginBottom: 4 },
});
