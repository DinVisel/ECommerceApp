import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	Dimensions,
	ScrollView,
	ActivityIndicator,
	TouchableOpacity,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import API from "../../services/api.js";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const MonthlyRevenueScreen = () => {
	const [revenue, setRevenue] = useState([]);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		const loadRevenue = async () => {
			try {
				const res = await API.get("/admin/monthly-revenue");
				setRevenue(res.data);
			} catch (err) {
				console.error("Revenue fetch error:", err);
			} finally {
				setLoading(false);
			}
		};

		loadRevenue();
	}, []);

	if (loading) {
		return <ActivityIndicator size='large' style={{ marginTop: 40 }} />;
	}

	return (
		<ScrollView contentContainerStyle={styles.container}>
			<Text style={styles.title}>Monthly Revenue</Text>
			<TouchableOpacity onPress={() => router.back()}>
				<Ionicons name='arrow-back' size={24} color='black' />
			</TouchableOpacity>
			<LineChart
				data={{
					labels: revenue.map((item) => item.month),
					datasets: [{ data: revenue.map((item) => item.revenue) }],
				}}
				width={Dimensions.get("window").width - 30}
				height={260}
				yAxisSuffix='₺'
				chartConfig={{
					backgroundColor: "#fff",
					backgroundGradientFrom: "#fff",
					backgroundGradientTo: "#fff",
					decimalPlaces: 0,
					color: () => "#2c3e50",
					labelColor: () => "#555",
					strokeWidth: 2,
				}}
				bezier
			/>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: { padding: 15 },
	title: { fontSize: 22, fontWeight: "bold", marginBottom: 15 },
});

export default MonthlyRevenueScreen;
