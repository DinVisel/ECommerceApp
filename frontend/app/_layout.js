import { Tabs } from "expo-router";
import { AuthProvider, useAuth } from "../contexts/auth.context.js";
import { CartProvider } from "../contexts/cart.context.js";
function TabsLayout() {
	const { user } = useAuth();

	return (
		<Tabs
			screenOptions={({ route }) => ({
				tabBarIcon: ({ color, size }) => {
					let iconName;

					if (route.name === "index") iconName = "home";
					else if (route.name === "cart") iconName = "cart";
					else if (route.name === "categories") iconName = "apps";
					else if (route.name === "account") iconName = "person";

					return <Ionicons name={iconName} size={size} color={color} />;
				},
				tabBarActiveTintColor: "#007aff",
				tabBarInactiveTintColor: "gray",
				headerShown: false,
			})}
		>
			<Tabs.Screen name='index' options={{ title: "Home" }} />
			<Tabs.Screen name='categories' options={{ title: "Categories" }} />
			<Tabs.Screen name='cart' options={{ title: "Cart" }} />
			<Tabs.Screen name='account' options={{ title: "Account" }} />

			{/* Sadece admin için */}
			{user?.role === "admin" && (
				<Tabs.Screen name='admin/dashboard' options={{ title: "Admin" }} />
			)}

			{/* Sadece seller için */}
			{user?.role === "seller" && (
				<Tabs.Screen name='seller/add-product' options={{ title: "Sell" }} />
			)}
		</Tabs>
	);
}

export default function RootLayout() {
	return (
		<AuthProvider>
			<CartProvider>
				<TabsLayout />
			</CartProvider>
		</AuthProvider>
	);
}
