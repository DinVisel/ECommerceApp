import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	const login = async (token) => {
		await AsyncStorage.setItem("token", token);
		const decoded = jwtDecode(token);
		setUser(decoded);
		setLoading(false);
	};

	const logout = async () => {
		await AsyncStorage.removeItem("token");
		setUser(null);
		setLoading(false);
	};

	const loadUser = async () => {
		const token = await AsyncStorage.getItem("token");
		if (token) {
			try {
				const decoded = jwtDecode(token);
				setUser(decoded);
			} catch (e) {
				setUser(null);
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
