import { Tabs } from "expo-router";
import { useAuth } from "../../contexts/auth.context.js";
import { CartProvider } from "../../contexts/cart.context.js";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator } from "react-native";

export default function TabsLayout() {
	const { user, loading } = useAuth();

	const renderUserTabs = () => (
		<Tabs screenOptions={{ tabBarActiveTintColor: "tomato" }}>
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
		</Tabs>
	);

	const renderAdminTabs = () => (
		<Tabs screenOptions={{ tabBarActiveTintColor: "tomato" }}>
			<Tabs.Screen
				name='admin/dashboard'
				options={{
					title: "Dashboard",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name='speedometer-outline' color={color} size={size} />
					),
				}}
			/>
			<Tabs.Screen
				name='admin/orders'
				options={{
					title: "Orders",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name='receipt-outline' color={color} size={size} />
					),
				}}
			/>
			<Tabs.Screen
				name='admin/users'
				options={{
					title: "Users",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name='people-outline' color={color} size={size} />
					),
				}}
			/>
		</Tabs>
	);

	const renderSellerTabs = () => <></>;

	if (loading) {
		return <ActivityIndicator style={{ marginTop: 20 }} />;
	}

	if (!user) {
		return renderUserTabs();
	} else if (user.role === "admin") {
		return renderAdminTabs();
	} else if (user.role === "seller") {
		return renderSellerTabs();
	} else {
		return renderUserTabs();
	}
}
