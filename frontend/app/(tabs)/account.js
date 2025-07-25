import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../contexts/auth.context.js";
import API from "../../services/api.js";

export default function AccountScreen() {
	const router = useRouter();
	const { user, logout } = useAuth();

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
			<Text>Email: {user.email}</Text>
			<Text>Role: {user.role}</Text>

			<View style={styles.buttonContainer}>
				<Button title='Logout' onPress={logout} color='red' />
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, justifyContent: "center", alignItems: "center" },
	title: { fontSize: 20, marginBottom: 20 },
	buttonContainer: {
		marginTop: 20,
	},
});
