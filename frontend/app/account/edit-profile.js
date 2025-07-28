import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useAuth } from "../../contexts/auth.context";
import { useRouter } from "expo-router";
import API from "../../services/api.js";

export default function EditProfileScreen() {
	const { user, setUser } = useAuth();
	const router = useRouter();

	const [name, setName] = useState();
	const [email, setEmail] = useState();
	const [password, setPassword] = useState();

	const updateUser = (id, userData, token) => {
		return API.put(`/users/${id}`, userData, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
	};

	const handleSave = async () => {
		try {
			const updatedData = { name, email };
			if (password) updatedData.password = password;

			const response = await updateUser(user._id, updatedData, user.token);
			setUser(response.data);
			alert("Profile updated successfully!");
			router.back();
		} catch (err) {
			alert("Update error:" + err.response?.data?.message || err.message);
		}
	};
	return (
		<View style={styles.container}>
			<Text style={styles.label}>Name</Text>
			<TextInput style={styles.input} value={name} onChangeText={setName} />

			<Text style={styles.label}>E-mail</Text>
			<TextInput style={styles.input} value={email} onChangeText={setEmail} />

			<Text style={styles.label}>New Password (optional)</Text>
			<TextInput
				style={styles.input}
				value={password}
				onChangeText={setPassword}
				secureTextEntry
			/>

			<Button title='Save' onPress={handleSave} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: { padding: 20 },
	label: { marginBottom: 5, marginTop: 15 },
	input: {
		borderWidth: 1,
		borderColor: "#ccc",
		padding: 10,
		borderRadius: 5,
	},
});
