import { Stack } from "expo-router";
import { Slot } from "expo-router";
import { AuthProvider } from "../contexts/auth.context";
import { CartProvider } from "../contexts/cart.context";

export default function RootLayout() {
	return (
		<AuthProvider>
			<CartProvider>
				<Stack
					screenOptions={{
						gestureEnabled: true,
						animation: "slide_from_right", // iOS benzeri geçiş
					}}
				>
					<Slot />
				</Stack>
			</CartProvider>
		</AuthProvider>
	);
}
