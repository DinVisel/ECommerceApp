import { Tabs } from "expo-router";
import { AuthProvider, useAuth } from "../contexts/auth.context.js";
import { CartProvider } from "../contexts/cart.context.js";
function TabsLayout() {
	const { user } = useAuth();

	return (
		<Tabs>
			<Tabs.Screen name='products' options={{ title: "Ürünler" }} />
			<Tabs.Screen name='cart' options={{ title: "Sepet" }} />
			<Tabs.Screen name='orders' options={{ title: "Siparişler" }} />

			{user?.role === "seller" && (
				<Tabs.Screen
					name='(tabs)/seller/add-product'
					options={{ title: "Ürün Ekle" }}
				/>
			)}

			{user?.role === "admin" && (
				<>
					<Tabs.Screen
						name='admin/orders'
						options={{ title: "Admin Siparişler" }}
					/>
					<Tabs.Screen name='admin/users' options={{ title: "Kullanıcılar" }} />
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
