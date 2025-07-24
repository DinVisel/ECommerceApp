import React, { useEffect, useState } from "react";
import { View, Text, Dimensions } from "react-native";
import { BarChart } from "react-native-chart-kit";
import API from "../../../services/api.js";
import { useAuth } from "../../../contexts/auth.context.js";

const screenWidth = Dimensions.get("window").width;

export default function TopUsersChart() {
	const { user } = useAuth();
	const [chartData, setChartData] = useState({
		labels: [],
		datasets: [{ data: [] }],
	});

	useEffect(() => {
		API.get("/admin/dashboard/top-users", {
			headers: { Authorization: `Bearer ${user.token}` },
		})
			.then((res) => {
				setChartData({
					labels: res.data.map((item) =>
						item.name.length > 10 ? item.name.slice(0, 10) + "…" : item.name
					),
					datasets: [
						{
							data: res.data.map((item) => item.orderCount),
						},
					],
				});
			})
			.catch((err) => {
				console.error("Error loading top users:", err);
			});
	}, []);

	return (
		<View style={{ padding: 15 }}>
			<Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
				Top Customers (Order Count)
			</Text>

			<BarChart
				data={chartData}
				width={screenWidth - 30}
				height={250}
				fromZero
				showValuesOnTopOfBars
				yAxisLabel=''
				yAxisSuffix=' orders'
				chartConfig={{
					backgroundColor: "#fff",
					backgroundGradientFrom: "#fff",
					backgroundGradientTo: "#fff",
					decimalPlaces: 0,
					color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
					labelColor: () => "#333",
				}}
				style={{ borderRadius: 12 }}
			/>
		</View>
	);
}
