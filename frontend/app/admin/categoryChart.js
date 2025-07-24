import React, { useEffect, useState } from "react";
import { View, Text, Dimensions } from "react-native";
import { PieChart } from "react-native-chart-kit";
import API from "../../services/api.js";
import { useAuth } from "../../contexts/auth.context.js";

const screenWidth = Dimensions.get("window").width;

export default function CategoryChart() {
	const { user } = useAuth();
	const [data, setData] = useState();
	const headers = { Authorization: `Bearer ${user.token}` };

	useEffect(() => {
		API.get("/admin/dashboard/category-sales", { headers }).then((res) => {
			const colors = ["#FF6384", "#36A2EB", "#FFCE56", "#66BB6A", "#BA68C8"];
			const chartData = res.data.map((item, i) => ({
				name: item._id,
				population: item.totalSold,
				color: colors[i % colors.length],
				legendFontColor: "#333",
				legendFontSize: 12,
			}));
			setData(chartData);
		});
	}, []);

	return (
		<View style={{ padding: 15 }}>
			<Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
				Sales by Category
			</Text>
			<PieChart
				data={data}
				width={screenWidth - 30}
				height={220}
				accessor='population'
				backgroundColor='transparent'
				paddingLeft='15'
				chartConfig={{
					color: () => `rgba(0, 0, 0, 0.8)`,
				}}
			/>
		</View>
	);
}
