import React, { useContext, useState, useEffect } from "react";
import {
	View,
	Text,
	TextInput,
	Button,
	Alert,
	StyleSheet,
	TouchableOpacity,
} from "react-native";
import { AuthContext } from "../../contexts/auth.context.js";
import API from "../../services/api.js";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const AddProductScreen = () => {
	const { user } = useContext(AuthContext);
	const router = useRouter();

	const [form, setForm] = useState({
		name: "",
		description: "",
		price: "",
		image: "",
		countInStock: "",
	});

	const handleChange = (key, value) => {
		setForm({ ...form, [key]: value });
	};

	const handleSubmit = async () => {
		try {
			await API.post("/products", {
				...form,
				price: Number(form.price),
				countInStock: Number(form.countInStock),
			});

			Alert.alert("Başarılı", "Ürün eklendi.");
			setForm({
				name: "",
				description: "",
				price: "",
				image: "",
				countInStock: "",
			});
			router.push("/");
		} catch (err) {
			const message = err.response?.data?.message || "Product could not added.";
			Alert.alert("Error", message);
		}
	};

	if (user?.role !== "seller") {
		return <Text>Acces Denied!</Text>;
	}

	useEffect(() => {
		if (!user || (user.role !== "seller" && user.role !== "admin")) {
			Alert.alert("Unauthorized", "This page is only for sellers.");
			router.replace("/");
		}
	}, [user]);

	return (
		<View style={styles.container}>
			<TouchableOpacity onPress={() => router.back()}>
				<Ionicons name='arrow-back' size={24} color='black' />
			</TouchableOpacity>
			<Text style={styles.title}>Add New Product</Text>

			<TextInput
				placeholder='Ürün Adı'
				style={styles.input}
				value={form.name}
				onChangeText={(text) => handleChange("name", text)}
			/>
			<TextInput
				placeholder='Açıklama'
				style={styles.input}
				value={form.description}
				onChangeText={(text) => handleChange("description", text)}
			/>
			<TextInput
				placeholder='Fiyat'
				style={styles.input}
				keyboardType='numeric'
				value={form.price}
				onChangeText={(text) => handleChange("price", text)}
			/>
			<TextInput
				placeholder='Stok'
				style={styles.input}
				keyboardType='numeric'
				value={form.countInStock}
				onChangeText={(text) => handleChange("countInStock", text)}
			/>
			<TextInput
				placeholder='Görsel URL'
				style={styles.input}
				value={form.image}
				onChangeText={(text) => handleChange("image", text)}
			/>

			<Button title='Ürünü Ekle' onPress={handleSubmit} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1, padding: 20, justifyContent: "center" },
	title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
	input: {
		borderWidth: 1,
		borderColor: "#ccc",
		padding: 10,
		marginBottom: 12,
		borderRadius: 6,
	},
});

export default AddProductScreen;
