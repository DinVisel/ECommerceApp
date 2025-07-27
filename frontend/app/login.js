import React, { useState, useContext } from "react";
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
import { AuthContext } from "../contexts/auth.context.js";
import { Ionicons } from "@expo/vector-icons";

const LoginScreen = () => {
	const router = useRouter();

	const [form, setForm] = useState({ email: "", password: "" });
	const { login } = useContext(AuthContext);

	const handleChange = (key, value) => {
		setForm({ ...form, [key]: value });
	};

	const handleLogin = async () => {
		try {
			const res = await API.post("/users/login", {
				email: form.email,
				password: form.password,
			});

			const { token, user: userData } = res.data;
			await login(token, userData);

			router.replace("/");
		} catch (err) {
			Alert.alert(
				"Giriş Başarısız",
				err.response?.data?.message || "Bir hata oluştu"
			);
		}
	};

	return (
		<View style={styles.container}>
			<TouchableOpacity onPress={() => router.back()}>
				<Ionicons name='arrow-back' size={24} color='black' />
			</TouchableOpacity>
			<Text style={styles.title}>Login</Text>

			<TextInput
				placeholder='Email'
				value={form.email}
				onChangeText={(text) => handleChange("email", text)}
				style={styles.input}
				keyboardType='email-address'
				autoCapitalize='none'
			/>
			<TextInput
				placeholder='Password'
				value={form.password}
				onChangeText={(text) => handleChange("password", text)}
				style={styles.input}
				secureTextEntry
			/>

			<Button title='Login' onPress={handleLogin} />
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

export default LoginScreen;
