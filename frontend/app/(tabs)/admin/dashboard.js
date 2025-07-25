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
import { Dimensions, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const AdminDashboardScreen = () => {
	const { user } = useContext(AuthContext);
	const [loading, setLoading] = useState(true);
	const [stats, setStats] = useState({
		topUsers: [],
		topProducts: [],
		monthlyRevenue: [],
		categoryChart: [],
	});
	const [graphData, setGraphData] = useState([]);
	const [topProducts, setTopProducts] = useState([]);
	const [topUsers, setTopUsers] = useState([]);
	const [categoryStats, setCategoryStats] = useState([]);
	const headers = { Authorization: `Bearer ${user.token}` };
	const router = useRouter();

	const safeData = (arr) =>
		(arr || []).map((x) => (Number.isFinite(x) ? x : 0));

	const loadGraphData = async () => {
		try {
			const res = await API.get("/admin/dashboard/stats", {
				headers: { Authorization: `Bearer ${user.token}` },
			});
			setGraphData(res.data);
		} catch (error) {
			console.error("Graph data error", error);
		}
	};

	const loadDashboard = async () => {
		try {
			const res = await API.get("/admin/dashboard", {
				headers: { Authorization: `Bearer ${user.token}` },
			});

			setStats((prev) => ({ ...prev, ...res.data }));
		} catch (error) {
			console.error("Dashboard load error", error);
		} finally {
			setLoading(false);
		}
	};

	const loadExtraStats = async () => {
		try {
			const [productsRes, usersRes, categoriesRes] = await Promise.all([
				API.get("/admin/dashboard/top-products", { headers }),
				API.get("/admin/dashboard/top-users", { headers }),
				API.get("/admin/dashboard/category-sales", { headers }),
			]);
			setTopProducts(productsRes.data);
			setTopUsers(usersRes.data);
			setCategoryStats(categoriesRes.data);
		} catch (error) {
			console.error("Extra stats error", error);
		}
	};

	const PreviewCard = ({ title, onPress, chartData }) => (
		<TouchableOpacity style={styles.previewCard} onPress={onPress}>
			<Text style={styles.previewTitle}>{title}</Text>
			<LineChart
				data={chartData}
				width={Dimensions.get("window").width * 0.8}
				height={160}
				withDots={false}
				withInnerLines={false}
				withOuterLines={false}
				chartConfig={{
					backgroundGradientFrom: "#fff",
					backgroundGradientTo: "#fff",
					color: () => `#2c3e50`,
					labelColor: () => "#999",
					strokeWidth: 2,
				}}
				bezier
			/>
			<Text style={styles.previewHint}>View Details →</Text>
		</TouchableOpacity>
	);

	useEffect(() => {
		if (user?.role === "admin") {
			loadDashboard();
			loadGraphData();
			loadExtraStats();
		}
	}, [user]);

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
			<TouchableOpacity onPress={() => router.back()}>
				<Ionicons name='arrow-back' size={24} color='black' />
			</TouchableOpacity>
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
						datasets: [
							{ data: safeData(graphData.map((item) => item.totalRevenue)) },
						],
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
			<View>
				<Text style={styles.sectionTitle}>Top 5 Selling Products</Text>
				{topProducts.map((p, i) => (
					<Text key={i}>
						{p._id} – {p.totalSold} pcs
					</Text>
				))}
			</View>
			<View>
				<Text style={styles.sectionTitle}>Top 5 Active Users</Text>
				{topUsers.map((u, i) => (
					<Text key={i}>
						{u.name} ({u.email}) – {u.orderCount} orders, {u.totalSpent}₺
					</Text>
				))}
			</View>
			<View>
				<Text style={styles.sectionTitle}>Sales by Category</Text>
				{categoryStats.map((cat, i) => (
					<Text key={i}>
						{cat._id}: {cat.totalSold} units
					</Text>
				))}
			</View>
			<View style={styles.previewGrid}>
				<PreviewCard
					title='Top Products'
					onPress={() => router.push("/admin/topProductsChart")}
					chartData={{
						labels: topProducts.map((p) => p.name || p._id),
						datasets: [
							{
								data: safeData(topProducts.map((p) => p.totalSold || p.sales)),
							},
						],
					}}
				/>
				<PreviewCard
					title='Monthly Revenue'
					onPress={() => router.push("/admin/monthlyRevenue")}
					chartData={{
						labels: stats?.monthlyRevenue?.map((item) => item.month) || [],
						datasets: [
							{
								data:
									safeData(
										stats?.monthlyRevenue?.map((item) => item.revenue)
									) || [],
							},
						],
					}}
				/>
				<PreviewCard
					title='Categories by Product Count'
					onPress={() => router.push("/admin/categoryChart")}
					chartData={{
						labels: categoryStats.map((c) => c._id || c.name),
						datasets: [
							{
								data: safeData(
									categoryStats.map((c) => c.totalSold || c.productCount)
								),
							},
						],
					}}
				/>

				<PreviewCard
					title='Top Users by Order Count'
					onPress={() => router.push("/admin/topUsersChart")}
					chartData={{
						labels: topUsers.map((u) => u.name),
						datasets: [
							{
								data: safeData(
									topUsers.map((u) => u.orderCount || u.totalOrders)
								),
							},
						],
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
	previewGrid: {
		marginTop: 30,
		gap: 20,
		alignItems: "center",
	},
	previewCard: {
		backgroundColor: "#fff",
		padding: 10,
		borderRadius: 10,
		elevation: 2,
		width: "100%",
	},
	previewTitle: {
		fontSize: 16,
		fontWeight: "600",
		marginBottom: 5,
	},
	previewHint: {
		color: "#007bff",
		marginTop: 5,
		textAlign: "right",
	},
});

export default AdminDashboardScreen;
