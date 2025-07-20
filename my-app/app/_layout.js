import { Stack } from "expo-router";
import { Tabs } from "expo-router";
import { AuthProvider } from "../contexts/auth.context.js";
import { CartProvider } from "../contexts/cart.context.js";

export default function RootLayout() {
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
				</Tabs>
			</CartProvider>
		</AuthProvider>
	);
}
