import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	Button,
	Alert,
	ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import API from "../../../../services/api";
import { Ionicons } from "@expo/vector-icons";

export default function ProductDetailScreen() {
	const { id } = useLocalSearchParams();
	const router = useRouter();

	const [product, setProdcut] = useState([]);
	const [loading, setLoading] = useState(true);

	const fetchProduct = async () => {
		try {
			const res = API.get(`/products/${id}`);
			setProdcut(res.data);
		} catch (error) {
			console.error("Could not fetched product data", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchProduct();
	}, [id]);

	const deleteProduct = async () => {
		try {
			Alert.alert("Delete Product", "Are you sure?", [
				{ text: "Cancel", style: "cancel" },
				{
					text: "Delete",
					style: "destructive",
					onPress: async () => {
						try {
							await API.delete(`/products/${id}`);
							router.back();
						} catch (error) {
							console.error("Delete error", error);
							Alert.alert("Could not deleted", "There was an error on delete");
						}
					},
				},
			]);
		} catch (error) {
			console.error("Error occured", error);
			Alert.alert("Could not deleted", "There was an error on delete");
		}
	};

	if (loading) return <Text>loading...</Text>;
	if (!product) return <Text>No products.</Text>;

	return (
		<>
			<TouchableOpacity onPress={() => router.back()}>
				<Ionicons name='arrow-back' size={24} color='black' />
			</TouchableOpacity>
			<ScrollView contentContainerStyle={styles.container}>
				<Text style={styles.title}>{product.name}</Text>
				<Text style={styles.label}>Fiyat: {product.price} ₺</Text>
				<Text style={styles.label}>Stok: {product.stock}</Text>
				<Text style={styles.label}>Açıklama:</Text>
				<Text style={styles.description}>{product.description}</Text>

				<View style={styles.buttonRow}>
					<Button title='Sil' color='red' onPress={deleteProduct} />
					<Button title='Geri Dön' onPress={() => router.back()} />
				</View>
			</ScrollView>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: 16,
		backgroundColor: "#fff",
		flexGrow: 1,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 12,
	},
	label: {
		fontSize: 16,
		marginBottom: 6,
	},
	description: {
		fontSize: 14,
		marginBottom: 20,
	},
	buttonRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		gap: 10,
	},
});
