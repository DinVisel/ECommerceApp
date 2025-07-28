import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, Alert, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../contexts/auth.context.js";
import API from "../../services/api.js";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AccountScreen() {
	const router = useRouter();
	const { user, logout } = useAuth();

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");

	useEffect(() => {
		if (user) {
			setName(user.name);
			setEmail(user.email);
		}
	}, [user]);

	const handleSave = async () => {
		const updateUser = async (id, userData, token) => {
			return API.put(`/users/${id}`, userData, {
				headers: { Authorization: `Bearer ${token}` },
			});
		};

		try {
			await updateUser(user.id, { name, email }, user.token);
			Alert.alert("Profile updated!");
		} catch (error) {
			console.error("Update error", error);
			Alert.alert("Error on Update");
		}
	};

	if (!user) {
		return (
			<View style={styles.container}>
				<Text style={styles.title}>Welcome Guest</Text>
				<Button title='Login' onPress={() => router.push("/login")} />
				<Button title='Register' onPress={() => router.push("/register")} />
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Welcome, {user.name}</Text>
			<Button
				title='Profili Düzenle'
				onPress={() => router.push("/account/edit-profile")}
			/>

			<View style={styles.buttonContainer}>
				<Button title='Logout' onPress={logout} color='red' />
			</View>
			{user?.role === "admin" && (
				<>
					<Text style={styles.section}>🔒 Admin Panel</Text>
					<Button
						title='Dashboard'
						onPress={() => router.push("/admin/dashboard")}
					/>
					<Button
						title='Manage Users'
						onPress={() => router.push("/admin/users")}
					/>
					<Button
						title='View Orders'
						onPress={() => router.push("/admin/orders")}
					/>
				</>
			)}

			{user?.role === "seller" && (
				<>
					<Text style={styles.section}>📦 Seller Panel</Text>
					<Button
						title='My Products'
						onPress={() => router.push("/seller/my-products")}
					/>
					<Button
						title='Orders'
						onPress={() => router.push("/seller/my-orders")}
					/>
				</>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, justifyContent: "center", alignItems: "center" },
	title: { fontSize: 20, marginBottom: 20 },
	input: {
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 6,
		padding: 10,
		marginBottom: 16,
		width: "80%",
	},
	buttonContainer: {
		marginTop: 20,
	},
});
