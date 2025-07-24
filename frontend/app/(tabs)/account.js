import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../contexts/auth.context.js";

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
			<Text>Role: {user.role}</Text>

			{user.role === "admin" && <Text>You are an Admin</Text>}
			{user.role === "seller" && <Text>You are a Seller</Text>}
			{user.role === "user" && <Text>You are a Customer</Text>}

			<Button title='Logout' onPress={logout} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, justifyContent: "center", alignItems: "center" },
	title: { fontSize: 20, marginBottom: 20 },
});
