import React, { useState, useContext } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import API from "../services/api";
import { AuthContext } from "../contexts/auth.context.js";

const LoginScreen = () => {
	const router = useRouter();

	const [form, setForm] = useState({ email: "", password: "" });
	const { login } = useContext(AuthContext);

	const handleChange = (key, value) => {
		setForm({ ...form, [key]: value });
	};

	const handleLogin = async () => {
		try {
			const res = await axios.post("http://localhost:3000/api/auth/login", {
				email,
				password,
			});

			const token = res.data.token;
			await login(token); // burası context'i güncelliyor

			router.replace("/"); // Ana sayfaya yönlendir
		} catch (err) {
			Alert.alert(
				"Giriş Başarısız",
				err.response?.data?.message || "Bir hata oluştu"
			);
		}
	};

	return (
		<View style={styles.container}>
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
