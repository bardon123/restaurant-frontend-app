import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
	const [token, setToken] = useState(() => localStorage.getItem("token") || "");

	const login = (token) => {
		setToken(token);
		localStorage.setItem("token", token);
	};

	const logout = () => {
		setToken("");
		localStorage.removeItem("token");
	};

	return (
		<AuthContext.Provider value={{ token, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	return useContext(AuthContext);
}
