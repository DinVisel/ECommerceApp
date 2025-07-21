import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../services/api";
import jwtDecode from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);

	const login = async (token) => {
		await AsyncStorage.setItem("token", token);
		const decoded = jwtDecode(token);
		setUser(decoded);
	};

	const logout = async () => {
		await AsyncStorage.removeItem("token");
		setUser(null);
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
	};

	/*useEffect(() => {
		loadUser();
	}, []);*/

	useEffect(() => {
		// Geliştirme kolaylığı için direkt kullanıcı set ediliyor
		setUser({ name: "Test Kullanıcı", role: "admin" }); // veya "user"
	}, []);

	return (
		<AuthContext.Provider value={{ user, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
