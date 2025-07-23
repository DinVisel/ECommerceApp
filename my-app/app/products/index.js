import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	FlatList,
	Image,
	StyleSheet,
	ActivityIndicator,
	TouchableOpacity,
	TextInput,
	Button,
	ScrollView,
} from "react-native";
import API from "../../services/api.js";
import { useRouter } from "expo-router";

const ProductListScreen = () => {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const router = useRouter();
	const [keyword, setKeyword] = useState("");
	const [category, setCategory] = useState("");
	const [minPrice, setMinPrice] = useState("");
	const [maxPrice, setMaxPrice] = useState("");
	const [categories, setCategories] = useState([]);

	const loadProducts = async () => {
		try {
			const res = await API.get("/products", {
				params: {
					keyword,
					category,
					minPrice,
					maxPrice,
				},
			});
			setProducts(res.data);
		} catch (error) {
			console.error("Ürünler yüklenemedi", error);
		} finally {
			setLoading(false);
		}
	};

	const fetchCategories = async () => {
		try {
			const res = await API.get("/products/categories");
			setCategories(res.data);
		} catch (error) {
			console.error("Kategoriler alınamadı", error);
		}
	};

	useEffect(() => {
		loadProducts();
		fetchCategories();
	}, []);

	if (loading) {
		return <ActivityIndicator size='large' style={{ marginTop: 40 }} />;
	}

	if (products.length === 0) {
		return (
			<View style={styles.container}>
				<Text>No products found.</Text>
			</View>
		);
	}

	const renderItem = ({ item }) => (
		<TouchableOpacity
			style={[styles.card, { opacity: item.countInStock === 0 ? 0.5 : 1 }]}
			onPress={() => router.push(`/products/${item._id}`)}
		>
			<Image
				source={{
					uri: item.image || "https://via.placeholder.com/80x80?text=Yok",
				}}
				style={styles.image}
			/>
			<View>
				<Text style={styles.name}>{item.name}</Text>
				<Text>{item.price}₺</Text>
				<Text style={{ color: "#666" }}>{item.countInStock} adet stokta</Text>
			</View>
		</TouchableOpacity>
	);

	return (
		<View style={{ flex: 1 }}>
			{/* Category Filter */}
			<View style={{ paddingHorizontal: 10, marginBottom: 10 }}>
				<ScrollView horizontal showsHorizontalScrollIndicator={false}>
					{categories.map((cat) => (
						<TouchableOpacity
							key={cat}
							onPress={() => {
								setCategory(cat);
								loadProducts();
							}}
							style={[
								styles.categoryButton,
								category === cat && styles.selectedCategory,
							]}
						>
							<Text style={{ color: category === cat ? "#fff" : "#000" }}>
								{cat}
							</Text>
						</TouchableOpacity>
					))}
					<TouchableOpacity
						onPress={() => {
							setCategory("");
							loadProducts();
						}}
						style={[
							styles.categoryButton,
							category === "" && styles.selectedCategory,
						]}
					>
						<Text style={{ color: category === "" ? "#fff" : "#000" }}>
							All
						</Text>
					</TouchableOpacity>
				</ScrollView>
			</View>

			{/* Product List */}
			<FlatList
				data={products}
				renderItem={renderItem}
				keyExtractor={(item) => item._id}
				contentContainerStyle={{ padding: 10 }}
			/>
		</View>
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
	categoryButton: {
		paddingHorizontal: 12,
		paddingVertical: 8,
		backgroundColor: "#eee",
		borderRadius: 20,
		marginRight: 8,
	},
	selectedCategory: {
		backgroundColor: "#2196F3",
	},
});

export default ProductListScreen;
