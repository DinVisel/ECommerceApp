import { Tabs } from "expo-router";
import { AuthProvider, useAuth } from "../../contexts/auth.context.js";
import { CartProvider } from "../../contexts/cart.context.js";
import { Ionicons } from "@expo/vector-icons";

function TabsLayout() {
	const { user } = useAuth();

	return (
		<Tabs screenOptions={{ tabBarActiveTintColor: "tomato" }}>
			<Tabs.Screen
				name='products/index'
				options={{
					title: "Home",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name='home-outline' color={color} size={size} />
					),
				}}
			/>
			<Tabs.Screen
				name='products/categories'
				options={{
					title: "Categories",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name='grid-outline' color={color} size={size} />
					),
				}}
			/>
			<Tabs.Screen
				name='cart/index'
				options={{
					title: "Cart",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name='cart-outline' color={color} size={size} />
					),
				}}
			/>

			<Tabs.Screen
				name='account/index'
				options={{
					title: "Account",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name='person-outline' color={color} size={size} />
					),
				}}
			/>

			{/* Seller Route */}
			{user?.role === "seller" && (
				<Tabs.Screen
					name='(tabs)/seller/add-product'
					options={{
						title: "Add Product",
						tabBarButton: () => null, // hide from bottom tab
					}}
				/>
			)}

			{/* Admin Routes */}
			{user?.role === "admin" && (
				<>
					<Tabs.Screen
						name='(tabs)/admin/orders'
						options={{
							title: "Admin Orders",
							tabBarButton: () => null, // hide from bottom tab
						}}
					/>
					<Tabs.Screen
						name='(tabs)/admin/users'
						options={{
							title: "Admin Users",
							tabBarButton: () => null,
						}}
					/>
					<Tabs.Screen
						name='(tabs)/admin/dashboard'
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
