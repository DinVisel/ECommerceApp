import { Stack } from "expo-router";
import { Slot } from "expo-router";
import { Provider as PaperProvider } from "react-native-paper";
import { AuthProvider } from "../contexts/auth.context";
import { CartProvider } from "../contexts/cart.context";
import theme from "../constants/theme";

export default function RootLayout() {
	return (
		<AuthProvider>
			<CartProvider>
				<PaperProvider theme={theme}>
					<Stack
						screenOptions={{
							gestureEnabled: true,
							animation: "slide_from_right",
						}}
					>
						<Slot />
					</Stack>
				</PaperProvider>
			</CartProvider>
		</AuthProvider>
	);
}
