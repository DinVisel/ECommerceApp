import React, { useEffect, useState, useContext } from "react";
import {
	View,
	Text,
	FlatList,
	StyleSheet,
	ActivityIndicator,
	Alert,
	TouchableOpacity,
} from "react-native";
import { AuthContext } from "../../../contexts/auth.context";
import API from "../../../services/api";
import { useRouter } from "expo-router";

export default function AdminUsers() {
	const { user } = useContext(AuthContext);
	const router = useRouter();
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);

	const handleDelete = async (userId) => {
		if (userId === user._id) {
			Alert.alert("Error", "You cannot delete your own account!");
			return;
		}

		Alert.alert("Are you sure", [
			{ text: "Cancel", style: "cancel" },
			{
				text: "Delete",
				style: "destructive",
				onPress: async () => {
					try {
						await API.delete(`/users/${userId}`, {
							headers: { Authorization: `Bearer ${user.token}` },
						});
						setUsers((prev) => prefetch.filter((u) => u._id !== userId));
						Alert.alert("Successful", "User deleted successfully");
					} catch (error) {
						console.error(error);
						Alert.alert("Error", "User could not deleted");
					}
				},
			},
		]);
	};

	const fetchUsers = async () => {
		try {
			const res = API.get("/users", {
				headers: { Authorization: `Bearer ${user.token}` },
			});
			setUsers(res.data);
		} catch (error) {
			console.error("Users could not fetched", error);
			Alert.alert("Error", "Only admin users cen access");
			router.push("/");
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		fetchUsers();
	}, []);

	if (loading)
		return <ActivityIndicator size='large' style={{ marginTop: 40 }} />;

	return (
		<FlatList
			data={users}
			keyExtractor={(item) => item._id}
			contentContainerStyle={{ padding: 15 }}
			renderItem={({ item }) => (
				<View style={styles.card}>
					<Text style={styles.name}>{item.name}</Text>
					<Text>Email: {item.email}</Text>
					<Text>Rol: {item.role}</Text>
					<Text>Kayıt: {new Date(item.createdAt).toLocaleDateString()}</Text>

					<TouchableOpacity onPress={() => handleDelete(item._id)}>
						<Text style={styles.deleteButton}>🗑️ Sil</Text>
					</TouchableOpacity>
				</View>
			)}
		/>
	);
}

const styles = StyleSheet.create({
	card: {
		backgroundColor: "#f0f4f8",
		padding: 15,
		marginBottom: 10,
		borderRadius: 10,
	},
	name: {
		fontWeight: "bold",
		fontSize: 16,
		marginBottom: 4,
	},
	deleteButton: {
		color: "red",
		marginTop: 8,
		fontWeight: "bold",
	},
});
