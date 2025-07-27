import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../services/api.js";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	const login = async ({ user: userData, token }) => {
		await AsyncStorage.setItem("token", token);
		const userObj = { ...userData, token };
		await AsyncStorage.setItem("user", JSON.stringify(userObj));
		setUser(userObj);
		setLoading(false);
	};

	const logout = async () => {
		await AsyncStorage.removeItem("token");
		await AsyncStorage.removeItem("user");
		setUser(null);
		setLoading(false);
	};

	const loadUser = async () => {
		const token = await AsyncStorage.getItem("token");
		if (token) {
			const stored = await AsyncStorage.getItem("user");
			if (stored) {
				try {
					setUser(JSON.parse(stored));
				} catch (error) {
					console.error(error);
				}
			}
			try {
				const res = await API.get("/users/profile", {
					headers: { Authorization: `Bearer ${token}` },
				});
				const userObj = { ...res.data, token };
				await AsyncStorage.setItem("user", JSON.stringify(userObj));
				setUser(userObj);
			} catch (e) {
				if (!stored) setUser({ token });
			}
		}
		setLoading(false);
	};

	useEffect(() => {
		loadUser();
	}, []);

	return (
		<AuthContext.Provider value={{ user, login, logout, loading }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
