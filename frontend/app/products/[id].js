import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	Button,
	Alert,
	ScrollView,
	TextInput,
	TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import API from "../../services/api";
import { Ionicons } from "@expo/vector-icons";

export default function ProductDetailScreen() {
	const { id } = useLocalSearchParams();
	const router = useRouter();

	const [product, setProdcut] = useState([]);
	const [loading, setLoading] = useState(true);
	const [editing, setEditing] = useState(false);

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

	const handleUpdate = async () => {
		try {
			await axios.put(`https://your-api.com/products/${id}`, product);
			Alert.alert("Başarılı", "Ürün güncellendi.");
			setEditing(false);
		} catch (err) {
			console.error("Güncelleme hatası:", err.message);
			Alert.alert("Hata", "Ürün güncellenemedi.");
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
					<Button title='Delete' color='red' onPress={deleteProduct} />
					<Button title='Back' onPress={() => router.back()} />
				</View>
				<Button
					title={editing ? "Düzenleme Modunu Kapat" : "Düzenle"}
					onPress={() => setEditing(!editing)}
				/>
				{editing && (
					<View style={{ marginTop: 20 }}>
						<Text>İsim</Text>
						<TextInput
							style={styles.input}
							value={product.name}
							onChangeText={(text) => setProduct({ ...product, name: text })}
						/>
						<Text>Fiyat</Text>
						<TextInput
							style={styles.input}
							value={String(product.price)}
							keyboardType='numeric'
							onChangeText={(text) =>
								setProduct({ ...product, price: parseFloat(text) })
							}
						/>
						<Text>Stok</Text>
						<TextInput
							style={styles.input}
							value={String(product.stock)}
							keyboardType='numeric'
							onChangeText={(text) =>
								setProduct({ ...product, stock: parseInt(text) })
							}
						/>
						<Text>Açıklama</Text>
						<TextInput
							style={[styles.input, { height: 80 }]}
							multiline
							value={product.description}
							onChangeText={(text) =>
								setProduct({ ...product, description: text })
							}
						/>

						<Button title='Kaydet' onPress={handleUpdate} />
					</View>
				)}
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
	input: {
		borderWidth: 1,
		borderColor: "#ccc",
		padding: 10,
		borderRadius: 5,
		marginBottom: 12,
	},
});
