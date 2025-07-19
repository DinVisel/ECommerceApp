import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);

	const login = async (token, userData) => {
		await AsyncStorage.setItem("token", token);
		setUser(userData);
	};

	const logout = async () => {
		await AsyncStorage.removeItem("token");
		setUser(null);
	};

	const checkLogin = async () => {
		const token = await AsyncStorage.getItem("token");
		if (token) {
			try {
				// Token varsa, user context’i dolsun (opsiyonel)
				API.defaults.headers.common["Authorization"] = `Bearer ${token}`;

				setUser({ token });
			} catch {
				setUser(null);
			}
		}
	};

	useEffect(() => {
		checkLogin();
	}, []);

	return (
		<AuthContext.Provider value={{ user, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};
