import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	FlatList,
	Image,
	StyleSheet,
	ActivityIndicator,
	TouchableOpacity,
} from "react-native";
import API from "../../services/api.js";
import { useRouter } from "expo-router";

const ProductListScreen = () => {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	const loadProducts = async () => {
		try {
			const res = await API.get("/products");
			setProducts(res.data);
		} catch (error) {
			console.error("Procuts could not loaded", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadProducts();
	}, []);

	if (loading) {
		return <ActivityIndicator size='large' style={{ marginTop: 40 }} />;
	}

	if (products.length === 0) {
		return (
			<View style={styles.container}>
				<Text>Product Not Found</Text>
			</View>
		);
	}

	const renderItem = ({ item }) => (
		<TouchableOpacity
			style={styles.card}
			onPress={() => router.push(`/products/${item._id}`)}
		>
			<Image source={{ uri: item.image }} style={styles.image} />
			<View>
				<Text style={styles.name}>{item.name}</Text>
				<Text>{item.price}₺</Text>
				<Text style={{ color: "#666" }}>{item.countInStock} adet stokta</Text>
			</View>
		</TouchableOpacity>
	);

	return (
		<FlatList
			data={products}
			renderItem={renderItem}
			keyExtractor={(item) => item._id}
			contentContainerStyle={{ padding: 10 }}
		/>
	);
};

const styles = StyleSheet.create({
	center: { flex: 1, justifyContent: "center", alignItems: "center" },
	card: {
		flexDirection: "row",
		backgroundColor: "#fff",
		marginBottom: 12,
		borderRadius: 10,
		elevation: 2,
		padding: 10,
	},
	image: { width: 80, height: 80, borderRadius: 8, marginRight: 10 },
	name: { fontWeight: "bold", fontSize: 16 },
});

export default ProductListScreen;
