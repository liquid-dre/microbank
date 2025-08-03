"use client";

import { useEffect, useState, useMemo } from "react";
import { transactionApi, Transaction } from "@/app/client/lib/api";
import { useAuth } from "@/app/client/providers/AuthProvider";
import {
	ArrowDownCircle,
	ArrowUpCircle,
	Check,
	ChevronsUpDown,
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
import { cn } from "@/app/client/lib/utils";

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

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
				</div>

				{/* Blacklisted Card */}
				{isBlacklisted && (
					<div
						className="p-6 rounded-xl bg-black shadow border flex flex-col items-center justify-center"
					>
						<p className="text-red-600 text-xl font-bold">Blacklisted</p>
						<p className="text-gray-100 text-sm mt-2 text-center">
							Your account is currently restricted from making transactions.
						</p>
					</div>
				)}
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
