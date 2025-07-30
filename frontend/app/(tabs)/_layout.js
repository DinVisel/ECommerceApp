import { Tabs } from "expo-router";
import { useAuth } from "../../contexts/auth.context.js";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator } from "react-native";
import theme, { colors } from "../../constants/theme";

export default function TabsLayout() {
	const { loading } = useAuth();

	if (loading) {
		return <ActivityIndicator style={{ marginTop: 20 }} />;
	}

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: colors.primary,
				tabBarStyle: { backgroundColor: theme.colors.card },
				headerShown: false,
			}}
		>
			<Tabs.Screen
				name='products'
				options={{
					title: "Home",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name='home-outline' color={color} size={size} />
					),
				}}
			/>
			<Tabs.Screen
				name='cart'
				options={{
					title: "Cart",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name='cart-outline' color={color} size={size} />
					),
				}}
			/>

			<Tabs.Screen
				name='account'
				options={{
					title: "Account",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name='person-outline' color={color} size={size} />
					),
				}}
			/>

			<Tabs.Screen
				name='categories'
				options={{
					title: "Categories",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name='grid-outline' color={color} size={size} />
					),
				}}
			/>
		</Tabs>
	);
}
