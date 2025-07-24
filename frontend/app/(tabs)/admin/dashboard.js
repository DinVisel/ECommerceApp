import React, { useEffect, useState, useContext } from "react";
import {
	View,
	Text,
	StyleSheet,
	ActivityIndicator,
	ScrollView,
} from "react-native";
import { AuthContext } from "../../../contexts/auth.context.js";
import API from "../../../services/api.js";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

const AdminDashboardScreen = () => {
	const { user } = useContext(AuthContext);
	const [loading, setLoading] = useEffect(true);
	const [stats, setStats] = useState(null);
	const [graphData, setGraphData] = useState([]);

	const loadGraphData = async () => {
		try {
			const res = API.get("/admin/dashboard/stats", {
				headers: { Authorization: `Bearer ${user.token}` },
			});
			setGraphData(res.data);
		} catch (error) {
			console.error("Graph data error", error);
		}
	};

	const loadDashboard = async () => {
		try {
			const res = API.get("/admin/dashboard", {
				headers: { Authorization: `Bearer ${user.token}` },
			});

			setStats(res.data);
		} catch (error) {
			console.error("Dashboard load error", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (user?.isAdmin) {
			loadDashboard();
			loadGraphData();
		}
	}, []);

	if (loading) {
		return <ActivityIndicator size='large' style={{ marginTop: 40 }} />;
	}

	if (!stats) {
		return (
			<View style={styles.center}>
				<Text>Could not load dashboard data.</Text>
			</View>
		);
	}
	return (
		<ScrollView contentContainerStyle={styles.container}>
			<Text style={styles.title}>Admin Dashboard</Text>
			<View style={styles.card}>
				<Text style={styles.label}>Users</Text>
				<Text style={styles.value}>{stats.totalUsers}</Text>
			</View>
			<View style={styles.card}>
				<Text style={styles.label}>Orders</Text>
				<Text style={styles.value}>{stats.totalOrders}</Text>
			</View>
			<View style={styles.card}>
				<Text style={styles.label}>Revenue</Text>
				<Text style={styles.value}>{stats.totalRevenue}₺</Text>
			</View>
			<View style={styles.card}>
				<Text style={styles.label}>Products</Text>
				<Text style={styles.value}>{stats.totalProducts}</Text>
			</View>
			<View>
				<Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 6 }}>
					Weekly Revenue
				</Text>
				<LineChart
					data={{
						labels: graphData.map((item) => item._id.slice(5)), // "MM-DD"
						datasets: [{ data: graphData.map((item) => item.totalRevenue) }],
					}}
					width={Dimensions.get("window").width - 40}
					height={220}
					yAxisSuffix='₺'
					chartConfig={{
						backgroundColor: "#ffffff",
						backgroundGradientFrom: "#f5f5f5",
						backgroundGradientTo: "#f5f5f5",
						decimalPlaces: 0,
						color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
						labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
						propsForDots: {
							r: "4",
							strokeWidth: "2",
							stroke: "#007AFF",
						},
					}}
					bezier
					style={{
						marginVertical: 10,
						borderRadius: 8,
					}}
				/>
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: { padding: 20 },
	title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
	card: {
		backgroundColor: "#fff",
		padding: 20,
		borderRadius: 10,
		marginBottom: 15,
		elevation: 2,
	},
	label: { fontSize: 16, color: "#555" },
	value: { fontSize: 20, fontWeight: "bold", marginTop: 4 },
	center: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default AdminDashboardScreen;
