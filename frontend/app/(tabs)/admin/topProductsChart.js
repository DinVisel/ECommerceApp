import React, { useEffect, useState } from "react";
import { View, Text, Dimensions } from "react-native";
import { BarChart } from "react-native-chart-kit";
import API from "../../../services/api.js";
import { useAuth } from "../../../contexts/auth.context.js";

const screenWidth = Dimensions.get("window").width;

export default function TopProductsChart() {
	const { user } = useAuth();
	const [chartData, setChartData] = useState({
		labels: [],
		datasets: [{ data: [] }],
	});

	useEffect(() => {
		API.get("/admin/dashboard/top-products", {
			headers: { Authorization: `Bearer ${user.token}` },
		}).then((res) => {
			setChartData({
				labels: res.data.map((item) => item.name.slice(0, 8)), // uzun isimler kesilir
				datasets: [{ data: res.data.map((item) => item.totalSold) }],
			});
		});
	}, []);

	return (
		<View style={{ padding: 15 }}>
			<Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
				Top Selling Products
			</Text>
			<BarChart
				data={chartData}
				width={screenWidth - 30}
				height={250}
				chartConfig={{
					backgroundColor: "#fff",
					backgroundGradientFrom: "#fff",
					backgroundGradientTo: "#fff",
					color: () => `rgba(0, 0, 0, 0.8)`,
					labelColor: () => `#333`,
				}}
				fromZero
				showValuesOnTopOfBars
			/>
		</View>
	);
}
