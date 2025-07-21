import { Stack } from "expo-router";
import { Tabs } from "expo-router";
import { AuthProvider, useAuth } from "../contexts/auth.context.js";
import { CartProvider } from "../contexts/cart.context.js";
function TabsLayout() {
	const { user } = useAuth();
	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: "#007aff",
				tabBarLabelStyle: { fontSize: 12 },
			}}
		>
			<Tabs.Screen name='index' options={{ title: "Ana Sayfa" }} />
			<Tabs.Screen name='products/index' options={{ title: "Ürünler" }} />
			<Tabs.Screen name='seller/add-product' options={{ title: "Ürün Ekle" }} />
			<Tabs.Screen name='cart/index' options={{ title: "Sepet" }} />
			<Tabs.Screen name='orders/index' options={{ title: "Siparişlerim" }} />
			{user?.role === "admin" && (
				<>
					<Tabs.Screen
						name='(tabs)/admin/orders'
						options={{ title: "Admin Siparişler" }}
					/>
					<Tabs.Screen
						name='(tabs)/admin/users'
						options={{ title: "Admin Kullanıcılar" }}
					/>
				</>
			)}
		</Tabs>
	);
}

export default function RootLayout() {
	const { user } = useAuth();
	return (
		<AuthProvider>
			<CartProvider>
				<Tabs
					screenOptions={{
						tabBarActiveTintColor: "#007aff",
						tabBarLabelStyle: { fontSize: 12 },
					}}
				>
					<Tabs.Screen name='index' options={{ title: "Ana Sayfa" }} />
					<Tabs.Screen name='products/index' options={{ title: "Ürünler" }} />
					<Tabs.Screen
						name='seller/add-product'
						options={{ title: "Ürün Ekle" }}
					/>
					<Tabs.Screen name='cart/index' options={{ title: "Sepet" }} />
					<Tabs.Screen
						name='orders/index'
						options={{ title: "Siparişlerim" }}
					/>
					{user?.role === "admin" && (
						<Tabs.Screen
							name='admin/orders'
							options={{ title: "Admin Siparişler" }}
						/>
					)}
					{user?.role === "admin" && (
						<>
							<Tabs.Screen
								name='(tabs)/admin/orders'
								options={{ title: "Admin Siparişler" }}
							/>
							<Tabs.Screen
								name='(tabs)/admin/users'
								options={{ title: "Admin Kullanıcılar" }}
							/>
						</>
					)}
				</Tabs>
			</CartProvider>
		</AuthProvider>
	);
	return (
		<AuthProvider>
			<CartProvider>
				<TabsLayout />
			</CartProvider>
		</AuthProvider>
	);
}
