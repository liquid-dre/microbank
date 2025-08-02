"use client";

import { useEffect, useState } from "react";
import { transactionApi, Transaction } from "@/lib/api";
import { useAuth } from "@/providers/AuthProvider";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import Link from "next/link";

export default function ClientDashboard() {
	const { user } = useAuth();
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [loading, setLoading] = useState(true);
	const [balance, setBalance] = useState(0);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const { balance, transactions } = await transactionApi.list();

				// Sort by newest first, then take 10
				const latestTransactions = [...transactions]
					.sort(
						(a, b) =>
							new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
					)
					.slice(0, 10);

				setTransactions(latestTransactions);
				setBalance(balance); // use backend balance
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	return (
		<div
			className="min-h-screen p-6"
			style={{ backgroundColor: "var(--color-cream)" }}
		>
			<h1
				className="text-2xl font-bold mb-6"
				style={{ color: "var(--color-primary)" }}
			>
				Welcome back{user?.name ? `, ${user.name}` : ""}! 👋
			</h1>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{/* Account Balance Card */}
				<div
					className="p-6 rounded-xl shadow border"
					style={{
						backgroundColor: "white",
						borderColor: "rgba(0,0,0,0.05)",
					}}
				>
					{loading ? (
						<div
							className="h-8 w-32 animate-pulse rounded"
							style={{ backgroundColor: "rgba(0,0,0,0.08)" }}
						></div>
					) : (
						<>
							<p className="text-gray-600">Account Balance</p>
							<p
								className="text-3xl font-bold mt-2"
								style={{ color: "var(--color-primary)" }}
							>
								${balance.toFixed(2)}
							</p>
						</>
					)}
				</div>

				{/* Quick Actions */}
				<div
					className="p-6 rounded-xl shadow border flex flex-col gap-4 justify-center"
					style={{
						backgroundColor: "white",
						borderColor: "rgba(0,0,0,0.05)",
					}}
				>
					<h2
						className="font-semibold"
						style={{ color: "var(--color-primary)" }}
					>
						Quick Actions
					</h2>
					<div className="flex gap-4">
						<Link
							href="/client/deposit"
							className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white transition"
							style={{ backgroundColor: "var(--color-primary)" }}
						>
							<ArrowDownCircle className="w-5 h-5" /> Deposit
						</Link>
						<Link
							href="/client/withdraw"
							className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white transition"
							style={{ backgroundColor: "var(--color-accent)" }}
						>
							<ArrowUpCircle className="w-5 h-5" /> Withdraw
						</Link>
					</div>
				</div>

				{/* Recent Transactions */}
				<div
					className="p-6 rounded-xl shadow border"
					style={{
						backgroundColor: "white",
						borderColor: "rgba(0,0,0,0.05)",
					}}
				>
					<h2
						className="font-semibold mb-4"
						style={{ color: "var(--color-primary)" }}
					>
						Recent Transactions
					</h2>

					{loading ? (
						<ul className="space-y-3">
							{Array.from({ length: 5 }).map((_, i) => (
								<li
									key={i}
									className="h-6 animate-pulse rounded"
									style={{ backgroundColor: "rgba(0,0,0,0.08)" }}
								></li>
							))}
						</ul>
					) : transactions.length === 0 ? (
						<p className="text-gray-500 text-sm">No transactions yet.</p>
					) : (
						<ul className="space-y-2">
							{transactions.slice(0, 5).map((t) => (
								<li
									key={t.id}
									className="flex justify-between items-center border-b last:border-b-0 pb-2"
									style={{ borderColor: "rgba(0,0,0,0.05)" }}
								>
									<span
										className="font-medium"
										style={{
											color:
												t.type === "deposit"
													? "var(--color-primary)"
													: "var(--color-accent)",
										}}
									>
										{t.type === "deposit" ? "Deposit" : "Withdraw"}
									</span>
									<span className="text-gray-600">${t.amount.toFixed(2)}</span>
									<span className="text-gray-400 text-xs">
										{new Date(t.createdAt).toLocaleDateString()}
									</span>
								</li>
							))}
						</ul>
					)}
				</div>
			</div>
		</div>
	);
}
