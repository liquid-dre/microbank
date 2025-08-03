"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "@/app/client/lib/api";
import type { User } from "@/app/client/lib/types";
import { toast } from "sonner";

type AuthContextType = {
	user: User | null;
	token: string | null;
	loading: boolean;
	login: (email: string, password: string) => Promise<User>;
	register: (name: string, email: string, password: string) => Promise<void>;
	logout: () => void;
	refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [token, setToken] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	/**
	 * 🔹 Load user/token from localStorage on first render
	 */
	useEffect(() => {
		const storedToken = localStorage.getItem("token");
		const storedUser = localStorage.getItem("user");
		if (storedToken && storedUser) {
			setToken(storedToken);
			setUser(JSON.parse(storedUser));
		}
		setLoading(false);
	}, []);

	/**
	 * 🔹 Refresh profile (fetch /api/profile)
	 */
	const refreshProfile = async () => {
		try {
			const profile = await authApi.profile();
			setUser(profile);
			localStorage.setItem("user", JSON.stringify(profile));
		} catch {
			toast.error("Failed to refresh profile. Please log in again.");
			logout();
		}
	};

	/**
	 * 🔹 Login and store token/user
	 */
	const login = async (email: string, password: string) => {
		try {
			const { token } = await authApi.login(email, password);
			localStorage.setItem("token", token);
			setToken(token);

			document.cookie = `token=${token}; path=/; max-age=86400;`;

			await refreshProfile();
			const storedUser = JSON.parse(localStorage.getItem("user")!);
			toast.success("Welcome back!");
			return storedUser; 
		} catch (err: unknown) {
			if (err instanceof Error) {
				toast.error(err.message || "Failed to login");
			} else {
				toast.error("Failed to login");
			}
		}
	};

	/**
	 * 🔹 Register and auto-login
	 */
	const register = async (name: string, email: string, password: string) => {
		try {
			const { token } = await authApi.register(name, email, password);
			localStorage.setItem("token", token);
			setToken(token);

			await refreshProfile();
			toast.success("Account created! Welcome aboard 🚀");
		} catch (err: unknown) {
			if (err instanceof Error) {
				toast.error(err.message || "Registration failed");
			} else {
				toast.error("Registration failed");
			}
		}
	};

	/**
	 * 🔹 Logout
	 */
	const logout = () => {
		setUser(null);
		setToken(null);
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		toast.info("Logged out successfully.");
	};

	return (
		<AuthContext.Provider
			value={{ user, token, loading, login, register, logout, refreshProfile }}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) throw new Error("useAuth must be used within AuthProvider");
	return context;
};
