import { Slot } from "expo-router";
import { AuthProvider } from "../contexts/auth.context.js";
import { CartProvider } from "../contexts/cart.context.js";

export default function RootLayout() {
	return (
		<AuthProvider>
			<CartProvider>
				<Slot />
			</CartProvider>
		</AuthProvider>
	);
}
