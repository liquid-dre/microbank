import { toast } from "sonner";
import type {
	User,
	Transaction,
	BalanceResponse,
	TransactionResponse,
} from "./types";

/**
 * Get JWT token from localStorage
 */
export const getToken = () => localStorage.getItem("token");

/**
 * Central request handler
 */
async function request<T>(
	url: string,
	options: RequestInit = {},
	showToast = false,
	successMessage?: string
): Promise<T> {
	const token = getToken();

	const headers: HeadersInit = {
		"Content-Type": "application/json",
		...(options.headers || {}),
		...(token ? { Authorization: `Bearer ${token}` } : {}),
	};

	try {
		const res = await fetch(url, { ...options, headers });

		if (!res.ok) {
			const errorMsg = await res.text();
			if (showToast) toast.error(errorMsg || "Request failed");
			throw new Error(errorMsg || "Request failed");
		}

		const data = await res.json();

		if (showToast && successMessage) toast.success(successMessage);

		return data;
	} catch (err: any) {
		if (showToast) toast.error(err.message || "Something went wrong");
		throw err;
	}
}

/**
 * Generic API wrapper
 */
export const api = {
	get: <T>(url: string, showToast = false, successMessage?: string) =>
		request<T>(url, {}, showToast, successMessage),

	post: <T>(
		url: string,
		body: any,
		showToast = false,
		successMessage?: string
	) =>
		request<T>(
			url,
			{ method: "POST", body: JSON.stringify(body) },
			showToast,
			successMessage
		),

	put: <T>(
		url: string,
		body: any,
		showToast = false,
		successMessage?: string
	) =>
		request<T>(
			url,
			{ method: "PUT", body: JSON.stringify(body) },
			showToast,
			successMessage
		),

	delete: <T>(url: string, showToast = false, successMessage?: string) =>
		request<T>(url, { method: "DELETE" }, showToast, successMessage),
};

/**
 * 🔐 Auth API
 */
export const authApi = {
	register: (name: string, email: string, password: string) =>
		api.post<{ token: string }>(
			"/services/client-services/auth/register",
			{ name, email, password },
			true,
			"Registration successful"
		),

	login: (email: string, password: string) =>
		api.post<{ token: string }>(
			"/services/client-services/auth/login",
			{ email, password },
			true,
			"Login successful"
		),

	profile: () => api.get<User>("/services/client-services/profile"),
};

export const adminApi = {
	listClients: () => api.get<User[]>("/services/client-services/admin/clients"),
	toggleBlacklist: (clientId: string) =>
		api.post<User>(`/services/client-services/admin/clients`, { clientId }),
};


/**
 * 💰 Transactions API
 */

export const transactionApi = {
  list: () => api.get<BalanceResponse>("/services/banking-services/transactions"),
  deposit: (amount: number) =>
    api.post<Transaction>(
      "/services/banking-services/transactions",
      { type: "DEPOSIT", amount },
      true,
      "Deposit successful!"
    ),
  withdraw: (amount: number) =>
    api.post<Transaction>(
      "/services/banking-services/transactions",
      { type: "WITHDRAWAL", amount },
      true,
      "Withdrawal successful!"
    ),
};

/**
 * ✅ Re-export types for legacy imports
 */
export type { User, Transaction, BalanceResponse, TransactionResponse };
