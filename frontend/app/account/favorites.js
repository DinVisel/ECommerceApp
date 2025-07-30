import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	FlatList,
	ActivityIndicator,
	StyleSheet,
} from "react-native";
import { useAuth } from "../../contexts/auth.context";
import { getFavorites } from "../(tabs)/products";

export default function FavoritesScreen() {
	const { user } = useAuth();
	const [favorites, setFavorites] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadFavorites = async () => {
			try {
				const res = await getFavorites(user._id, user.token);
				setFavorites(res.data);
			} catch (err) {
				console.log("Favoriler yüklenemedi:", err.message);
			} finally {
				setLoading(false);
			}
		};

		loadFavorites();
	}, []);

	if (loading)
		return <ActivityIndicator size='large' style={{ marginTop: 50 }} />;

	if (favorites.length === 0)
		return <Text style={styles.empty}>Hiç favoriniz yok.</Text>;

	return (
		<FlatList
			data={favorites}
			keyExtractor={(item) => item._id}
			renderItem={({ item }) => (
				<View style={styles.card}>
					<Text style={styles.name}>{item.name}</Text>
					<Text style={styles.price}>{item.price} ₺</Text>
				</View>
			)}
		/>
	);
}

const styles = StyleSheet.create({
	card: {
		backgroundColor: "#fff",
		padding: 15,
		margin: 10,
		borderRadius: 8,
		elevation: 3,
	},
	name: { fontSize: 16, fontWeight: "bold" },
	price: { fontSize: 14, color: "gray" },
	empty: {
		textAlign: "center",
		marginTop: 50,
		fontSize: 16,
		color: "gray",
	},
});
