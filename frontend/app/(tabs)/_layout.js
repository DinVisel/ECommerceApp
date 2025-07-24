import { Tabs } from "expo-router";
import { AuthProvider, useAuth } from "../../contexts/auth.context.js";
import { CartProvider } from "../../contexts/cart.context.js";
import { Ionicons } from "@expo/vector-icons";

function TabsLayout() {
	const { user } = useAuth();

	return (
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

			{/* Admin Routes */}
			{user?.role === "admin" && (
				<>
					<Tabs.Screen
						name='../admin/orders'
						options={{
							title: "Admin Orders",
							tabBarButton: () => null, // hide from bottom tab
						}}
					/>
					<Tabs.Screen
						name='../admin/users'
						options={{
							title: "Admin Users",
							tabBarButton: () => null,
						}}
					/>
					<Tabs.Screen
						name='../admin/dashboard'
						options={{
							title: "Dashboard",
							tabBarButton: () => null,
						}}
					/>
				</>
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
