import React, { useState } from "react";
import {
	View,
	Text,
	TextInput,
	Button,
	Alert,
	StyleSheet,
	TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import API from "../services/api";
import { Ionicons } from "@expo/vector-icons";

const RegisterScreen = () => {
	const router = useRouter();

	const [form, setForm] = useState({
		name: "",
		email: "",
		password: "",
	});

	const handleChange = (key, value) => {
		setForm({ ...form, [key]: value });
	};

	const handleRegister = async () => {
		try {
			const res = await API.post("/users/register", form);
			Alert.alert("Başarılı", "Kayıt başarılı. Giriş yapabilirsiniz.");
			router.push("/login"); // giriş ekranına yönlendir
		} catch (err) {
			const message = err.response?.data?.message || "Kayıt başarısız.";
			Alert.alert("Hata", message);
		}
	};

	return (
		<View style={styles.container}>
			<TouchableOpacity onPress={() => router.back()}>
				<Ionicons name='arrow-back' size={24} color='black' />
			</TouchableOpacity>
			<Text style={styles.title}>Kayıt Ol</Text>

			<TextInput
				placeholder='İsim'
				value={form.name}
				onChangeText={(text) => handleChange("name", text)}
				style={styles.input}
			/>
			<TextInput
				placeholder='E-posta'
				value={form.email}
				onChangeText={(text) => handleChange("email", text)}
				style={styles.input}
				keyboardType='email-address'
				autoCapitalize='none'
			/>
			<TextInput
				placeholder='Şifre'
				value={form.password}
				onChangeText={(text) => handleChange("password", text)}
				style={styles.input}
				secureTextEntry
			/>

			<Button title='Kayıt Ol' onPress={handleRegister} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1, justifyContent: "center", padding: 20 },
	title: { fontSize: 24, marginBottom: 24, textAlign: "center" },
	input: {
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 6,
		padding: 10,
		marginBottom: 16,
	},
});

export default RegisterScreen;
