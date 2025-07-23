import React, { useContext } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { AuthContext } from "../contexts/auth.context";
import { useRouter } from "expo-router";

const HomeScreen = () => {
	const { user, logout } = useContext(AuthContext);
	const router = useRouter();

	const renderRoleUI = () => {
		if (!user) {
			return <Text>Loading...</Text>;
		}

		const role = user.role || "user";

		switch (role) {
			case "admin":
				return <Text>Welcome Admin!</Text>;
			case "seller":
				return <Text>Welcome Seller!</Text>;
			default:
				return <Text>Welcome!</Text>;
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Home</Text>
			{renderRoleUI()}
			<Button title='Log Out' onPress={logout} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1, justifyContent: "center", alignItems: "center" },
	title: { fontSize: 24, marginBottom: 20 },
});

export default HomeScreen;
