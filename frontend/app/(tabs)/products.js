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
			console.error("Failed to load products", error);
		} finally {
			setLoading(false);
		}
	};

	const fetchCategories = async () => {
		try {
			const res = await API.get("/products/categories");
			setCategories(res.data);
		} catch (error) {
			console.error("Products could not fetched", error);
		}
	};

	const resetFilters = () => {
		setKeyword("");
		setCategory("");
		setMinPrice("");
		setMaxPrice("");
		loadProducts();
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
			<View style={{ padding: 10 }}>
				<TextInput
					placeholder='Search products...'
					value={keyword}
					onChangeText={(text) => setKeyword(text)}
					onSubmitEditing={loadProducts}
					style={styles.searchInput}
				/>
			</View>

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

			<View
				style={{
					flexDirection: "row",
					paddingHorizontal: 10,
					marginBottom: 10,
				}}
			>
				<TextInput
					placeholder='Min price'
					value={minPrice}
					onChangeText={setMinPrice}
					keyboardType='numeric'
					style={[styles.priceInput, { marginRight: 8 }]}
				/>
				<TextInput
					placeholder='Max price'
					value={maxPrice}
					onChangeText={setMaxPrice}
					keyboardType='numeric'
					style={styles.priceInput}
				/>
				<TouchableOpacity onPress={loadProducts} style={styles.filterButton}>
					<Text style={{ color: "#fff" }}>Filter</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={resetFilters} style={styles.clearButton}>
					<Text style={{ color: "#fff", textAlign: "center" }}>
						Clear Filters
					</Text>
				</TouchableOpacity>
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
	searchInput: {
		backgroundColor: "#f0f0f0",
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 10,
		marginBottom: 10,
	},
	priceInput: {
		flex: 1,
		backgroundColor: "#f0f0f0",
		paddingHorizontal: 10,
		paddingVertical: 8,
		borderRadius: 10,
	},
	filterButton: {
		backgroundColor: "#2196F3",
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 10,
		marginLeft: 8,
		justifyContent: "center",
	},
	clearButton: {
		backgroundColor: "#888",
		padding: 10,
		borderRadius: 10,
		marginHorizontal: 10,
		marginBottom: 10,
	},
});

export default ProductListScreen;
