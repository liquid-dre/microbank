"use client";

import { useEffect, useState, useMemo } from "react";
import { transactionApi, Transaction } from "@/app/client/lib/api";
import { useAuth } from "@/app/client/providers/AuthProvider";
import {
	ArrowDownCircle,
	ArrowUpCircle,
	Check,
	ChevronsUpDown,
	Info,
	TrendingDown,
	TrendingUp,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

// Recharts
import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

export default function ClientDashboard() {
	const { user } = useAuth();
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [loading, setLoading] = useState(true);
	const [balance, setBalance] = useState(0);

	// Filters
	const [typeFilter, setTypeFilter] = useState("");
	const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
	const [typeOpen, setTypeOpen] = useState(false);
	const [dateOpen, setDateOpen] = useState(false);

	const transactionTypes = [
		{ label: "All Types", value: "" },
		{ label: "Deposit", value: "DEPOSIT" },
		{ label: "Withdrawal", value: "WITHDRAWAL" },
	];

	const isBlacklisted = user?.isBlacklisted ?? false;

	useEffect(() => {
		const fetchData = async () => {
			try {
				const { balance, transactions } = await transactionApi.list();

				const sorted = [...transactions].sort(
					(a, b) =>
						new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime() // oldest first for chart
				);

				setTransactions(sorted);
				setBalance(balance);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	const filteredTransactions = useMemo(() => {
		return transactions.filter((t) => {
			const typeMatch = !typeFilter || t.type === typeFilter;
			const dateMatch =
				!dateFilter ||
				new Date(t.createdAt).toDateString() === dateFilter.toDateString();
			return typeMatch && dateMatch;
		});
	}, [transactions, typeFilter, dateFilter]);

	// Prepare chart data
	const chartData = useMemo(() => {
		const grouped: Record<
			string,
			{ date: string; deposit: number; withdrawal: number }
		> = {};

		transactions.forEach((t) => {
			const dateKey = new Date(t.createdAt).toLocaleDateString();
			if (!grouped[dateKey]) {
				grouped[dateKey] = { date: dateKey, deposit: 0, withdrawal: 0 };
			}
			if (t.type === "DEPOSIT") grouped[dateKey].deposit += t.amount;
			if (t.type === "WITHDRAWAL") grouped[dateKey].withdrawal += t.amount;
		});

		return Object.values(grouped);
	}, [transactions]);

	const getGreeting = () => {
		const hour = new Date().getHours();
		if (hour < 12) return "Good morning";
		if (hour < 18) return "Good afternoon";
		return "Good evening";
	};

	// Calculate last 7 days net trend
	const net7DayTrend = useMemo(() => {
		const now = new Date();
		const sevenDaysAgo = new Date();
		sevenDaysAgo.setDate(now.getDate() - 7);

		let totalDeposits = 0;
		let totalWithdrawals = 0;

		transactions.forEach((t) => {
			const txDate = new Date(t.createdAt);
			if (txDate >= sevenDaysAgo) {
				if (t.type === "DEPOSIT") totalDeposits += t.amount;
				else if (t.type === "WITHDRAWAL") totalWithdrawals += t.amount;
			}
		});

		return totalDeposits - totalWithdrawals; // net trend
	}, [transactions]);

	// Calculate monthly deposits vs withdrawals
	const monthlyStats = useMemo(() => {
		const now = new Date();
		const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

		let deposits = 0;
		let withdrawals = 0;

		transactions.forEach((t) => {
			const txDate = new Date(t.createdAt);
			if (txDate >= startOfMonth) {
				if (t.type === "DEPOSIT") deposits += t.amount;
				else if (t.type === "WITHDRAWAL") withdrawals += t.amount;
			}
		});

		return { deposits, withdrawals };
	}, [transactions]);

	// Personalized summary message
	const summaryMessage = useMemo(() => {
		const difference = Math.abs(
			monthlyStats.deposits - monthlyStats.withdrawals
		).toFixed(2);
		if (monthlyStats.deposits > monthlyStats.withdrawals) {
			return `Fantastic! You saved ${difference} more than you spent this month. Keep building on this momentum!`;
		} else if (monthlyStats.deposits === monthlyStats.withdrawals) {
			return `You’re perfectly balanced this month with ${monthlyStats.deposits.toFixed(2)} in both spending and savings. Try tucking away just a bit more to grow your cushion.`;
		} else {
			return `You spent ${difference} more than you saved this month. Small tweaks—like cutting one extra coffee—can help boost your savings!`;
		}
	}, [monthlyStats]);

	return (
		<div
			className="min-h-screen p-6"
			style={{ backgroundColor: "var(--color-cream)" }}
		>
			<h1
				className="text-2xl font-bold mb-6"
				style={{ color: "var(--color-primary)" }}
			>
				{getGreeting()}
				{user?.name ? `, ${user.name}` : ""}! 👋
			</h1>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
				{/* Account Balance Card */}
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4, ease: "easeOut" }}
					whileHover={{ scale: 1.02 }}
					className="relative p-6 bg-white border border-gray-200 rounded-2xl shadow-sm transition-shadow duration-300"
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
				</motion.div>

				{/* Quick Actions */}
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4, ease: "easeOut" }}
					whileHover={{ scale: 1.02 }}
					className="relative p-6 bg-white border border-gray-200 rounded-2xl shadow-sm transition-shadow duration-300"
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
							className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white transition ${
								isBlacklisted ? "opacity-50 pointer-events-none" : ""
							}`}
							style={{ backgroundColor: "var(--color-primary)" }}
						>
							<ArrowDownCircle className="w-5 h-5" /> Deposit
						</Link>
						<Link
							href="/client/withdraw"
							className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white transition ${
								isBlacklisted ? "opacity-50 pointer-events-none" : ""
							}`}
							style={{ backgroundColor: "var(--color-accent)" }}
						>
							<ArrowUpCircle className="w-5 h-5" /> Withdraw
						</Link>
					</div>
				</motion.div>

				{/* Blacklisted Card */}
				{isBlacklisted && (
					<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4, ease: "easeOut" }}
					whileHover={{ scale: 1.02 }}
					className="relative p-6 bg-white border border-gray-200 rounded-2xl shadow-sm transition-shadow duration-300"
				><p className="text-red-600 text-xl font-bold">Blacklisted</p>
						<p className="text-gray-100 text-sm mt-2 text-center">
							Your account is currently restricted from making transactions.
						</p>
					</motion.div>
				)}

				{/* Net 7 Day Trend */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4 }}
					className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col gap-4"
				>
					{/* Label */}
					<p className="text-xs font-semibold text-gray-600 uppercase">
						Net 7-Day Trend
					</p>

					{/* Value + Icon */}
					<div className="flex items-center mt-2 gap-2">
						{net7DayTrend >= 0 ? (
							<TrendingUp
								className="w-5 h-5 text-green-600"
								aria-label="Upward trend"
							/>
						) : (
							<TrendingDown
								className="w-5 h-5 text-red-600"
								aria-label="Downward trend"
							/>
						)}
						<span
							className={`text-2xl font-bold ${
								net7DayTrend >= 0 ? "text-green-600" : "text-red-600"
							}`}
						>
							{net7DayTrend >= 0 ? "+" : "-"}$
							{Math.abs(net7DayTrend).toFixed(2)}
						</span>
					</div>
				</motion.div>

				{/* Monthly Deposits vs Withdrawals */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4 }}
					className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col gap-4"
				>
					{/* Header */}
					<div className="flex items-center justify-between">
						<h3 className="text-sm font-semibold text-gray-600 uppercase">
							Monthly Deposits vs Withdrawals
						</h3>
					</div>

					{/* Stats */}
					<div className="grid grid-cols-2 gap-6">
						<div className="flex items-center gap-3">
							<span className="block w-3 h-3 rounded-full bg-green-500" />
							<div>
								<p className="text-xs text-gray-500">Deposits</p>
								<p className="text-xl font-bold text-green-600">
									${monthlyStats.deposits.toFixed(2)}
								</p>
							</div>
						</div>
						<div className="flex items-center gap-3">
							<span className="block w-3 h-3 rounded-full bg-red-500" />
							<div>
								<p className="text-xs text-gray-500">Withdrawals</p>
								<p className="text-xl font-bold text-red-600">
									${monthlyStats.withdrawals.toFixed(2)}
								</p>
							</div>
						</div>
					</div>
				</motion.div>

				{/* Personalized Summary */}
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4, ease: "easeOut" }}
					whileHover={{ scale: 1.02 }}
					className="relative p-6 bg-white border border-gray-200 rounded-2xl shadow-sm transition-shadow duration-300"
				>
					{/* Header */}
					<div className="flex items-center gap-2 mb-2 pl-3">
						<Info className="w-5 h-5 text-blue-500" aria-hidden="true" />
						<p className="text-gray-600 font-semibold uppercase text-sm">
							Personalized Summary
						</p>
					</div>

					{/* Message */}
					<p className="text-gray-700 text-sm leading-relaxed pl-3">
						{summaryMessage}
					</p>
				</motion.div>
			</div>

			{/* Area Chart */}
			<div className="mb-8 p-6 rounded-xl shadow border bg-white">
				<h2
					className="font-semibold mb-4"
					style={{ color: "var(--color-primary)" }}
				>
					Transactions Overview
				</h2>
				<ResponsiveContainer width="100%" height={300}>
					<AreaChart data={chartData}>
						<defs>
							<linearGradient id="depositColor" x1="0" y1="0" x2="0" y2="1">
								<stop
									offset="5%"
									stopColor="var(--color-primary)"
									stopOpacity={0.8}
								/>
								<stop
									offset="95%"
									stopColor="var(--color-primary)"
									stopOpacity={0}
								/>
							</linearGradient>
							<linearGradient id="withdrawColor" x1="0" y1="0" x2="0" y2="1">
								<stop
									offset="5%"
									stopColor="var(--color-accent)"
									stopOpacity={0.8}
								/>
								<stop
									offset="95%"
									stopColor="var(--color-accent)"
									stopOpacity={0}
								/>
							</linearGradient>
						</defs>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="date" />
						<YAxis />
						<Tooltip />
						<Area
							type="monotone"
							dataKey="deposit"
							stroke="var(--color-primary)"
							fill="url(#depositColor)"
						/>
						<Area
							type="monotone"
							dataKey="withdrawal"
							stroke="var(--color-accent)"
							fill="url(#withdrawColor)"
						/>
					</AreaChart>
				</ResponsiveContainer>
			</div>

			{/* Filter Bar */}
			<div className="flex flex-wrap items-center gap-4 mb-4">
				{/* Type Combobox */}
				<Popover open={typeOpen} onOpenChange={setTypeOpen}>
					<PopoverTrigger asChild>
						<Button
							variant="outline"
							role="combobox"
							aria-expanded={typeOpen}
							className="w-[200px] justify-between"
						>
							{transactionTypes.find((opt) => opt.value === typeFilter)
								?.label || "Select type"}
							<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-[200px] p-0">
						<Command>
							<CommandInput placeholder="Search type..." />
							<CommandEmpty>No type found.</CommandEmpty>
							<CommandGroup>
								{transactionTypes.map((option) => (
									<CommandItem
										key={option.value}
										value={option.value}
										onSelect={() => {
											setTypeFilter(option.value);
											setTypeOpen(false);
										}}
									>
										<Check
											className={cn(
												"mr-2 h-4 w-4",
												typeFilter === option.value
													? "opacity-100"
													: "opacity-0"
											)}
										/>
										{option.label}
									</CommandItem>
								))}
							</CommandGroup>
						</Command>
					</PopoverContent>
				</Popover>

				{/* Date Picker */}
				<Popover open={dateOpen} onOpenChange={setDateOpen}>
					<PopoverTrigger asChild>
						<Button variant="outline" className="w-[200px] justify-start">
							{dateFilter ? dateFilter.toLocaleDateString() : "Filter by date"}
						</Button>
					</PopoverTrigger>
					<PopoverContent className="p-0" align="start">
						<Calendar
							mode="single"
							selected={dateFilter}
							onSelect={(date) => {
								setDateFilter(date);
								setDateOpen(false);
							}}
						/>
					</PopoverContent>
				</Popover>

				{dateFilter && (
					<Button
						variant="ghost"
						onClick={() => setDateFilter(undefined)}
						className="text-red-500"
					>
						Clear Date
					</Button>
				)}
			</div>

			{/* Transactions Table */}
			<div className="overflow-x-auto rounded-lg shadow border border-gray-100 bg-white">
				<table className="min-w-full divide-y divide-gray-200 text-sm">
					<thead className="bg-gray-50">
						<tr>
							<th className="px-4 py-2 text-left font-semibold text-gray-700">
								Type
							</th>
							<th className="px-4 py-2 text-left font-semibold text-gray-700">
								Amount
							</th>
							<th className="px-4 py-2 text-left font-semibold text-gray-700">
								Date
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-100">
						{loading ? (
							<tr>
								<td colSpan={3} className="px-4 py-6 text-center text-gray-500">
									Loading...
								</td>
							</tr>
						) : filteredTransactions.length === 0 ? (
							<tr>
								<td colSpan={3} className="px-4 py-6 text-center text-gray-500">
									No transactions found.
								</td>
							</tr>
						) : (
							filteredTransactions.map((t) => (
								<tr key={t.id} className="hover:bg-gray-50 transition">
									<td
										className="px-4 py-2 font-medium"
										style={{
											color:
												t.type === "DEPOSIT"
													? "var(--color-primary)"
													: "var(--color-accent)",
										}}
									>
										{t.type === "DEPOSIT" ? "Deposit" : "Withdraw"}
									</td>
									<td className="px-4 py-2">${t.amount.toFixed(2)}</td>
									<td className="px-4 py-2 text-gray-500">
										{new Date(t.createdAt).toLocaleDateString()}
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
