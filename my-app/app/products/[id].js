import React, { useEffect, useState, useContext } from "react";
import {
	View,
	Text,
	Image,
	StyleSheet,
	ActivityIndicator,
	ScrollView,
	Button,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import API from "../../services/api.js";
import { CartContext } from "../../contexts/cart.context.js";

const ProductDetail = () => {
	const { id } = useLocalSearchParams();
	const [product, setProduct] = useState(null);
	const [loading, setLoading] = useState(true);
	const { addToCart } = useContext(CartContext);

	const fetchProduct = async () => {
		try {
			const res = API.get(`/products/${id}`);
			setProduct(res.data);
		} catch (error) {
			console.error("Could not fetch product data", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchProduct();
	}, [id]);

	if (loading)
		return <ActivityIndicator size='large' style={{ marginTop: 40 }} />;
	if (!product)
		return <Text style={styles.error}>Product Could Not Found</Text>;

	return (
		<ScrollView contentContainerStyle={styles.container}>
			<Image source={{ uri: product.image }} style={styles.image} />
			<Text style={styles.name}>{product.name}</Text>
			<Text style={styles.price}>{product.price}₺</Text>
			<Text style={styles.description}>{product.description}</Text>
			<Text style={styles.stock}>Stok: {product.countInStock} pcs</Text>
			<Button
				title='Add to Cart'
				onPress={() => {
					addToCart(product);
					alert("Product added to the cart!");
				}}
			/>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: { padding: 20 },
	image: { width: "100%", height: 250, borderRadius: 10, marginBottom: 20 },
	name: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
	price: { fontSize: 20, color: "#007aff", marginBottom: 10 },
	description: { fontSize: 16, color: "#333", marginBottom: 10 },
	stock: { fontSize: 14, color: "#888" },
	error: { padding: 20, textAlign: "center", fontSize: 18 },
});

export default ProductDetail;
