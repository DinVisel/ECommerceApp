import { Stack } from "expo-router";
import { AuthProvider } from "../contexts/auth.context.js";

export default function Layout() {
	return (
		<AuthProvider>
			<Stack />
		</AuthProvider>
	);
}
