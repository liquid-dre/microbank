"use client";

import { useState, useEffect, useRef } from "react";
import { transactionApi } from "@/app/client/lib/api";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowUpCircle, CheckCircle } from "lucide-react";
import { gsap } from "gsap";

export default function DepositPage() {
	const [amount, setAmount] = useState<number | "">("");
	const [loading, setLoading] = useState(false);
	const [balance, setBalance] = useState(0);
	const [loadingBalance, setLoadingBalance] = useState(true);
	const [success, setSuccess] = useState(false);

	const bgRef = useRef<HTMLDivElement>(null);
	const cardRef = useRef<HTMLFormElement>(null);
	const successRef = useRef<HTMLDivElement>(null);
	const router = useRouter();

	// Animate background gradient
	useEffect(() => {
		if (bgRef.current) {
			const tl = gsap.timeline({ repeat: -1, yoyo: true });
			tl.to(bgRef.current, { backgroundColor: "#E8F5E9", duration: 4 });
			tl.to(bgRef.current, { backgroundColor: "#FFF3E0", duration: 4 });
			tl.to(bgRef.current, {
				backgroundColor: "var(--color-cream)",
				duration: 4,
			});
		}
	}, []);

	// Fetch current balance
	useEffect(() => {
		const fetchBalance = async () => {
			try {
				const { balance } = await fetch(
					"/services/banking-services/transactions"
				).then((res) => res.json());
				setBalance(balance);
			} finally {
				setLoadingBalance(false);
			}
		};
		fetchBalance();
	}, []);

	const handleDeposit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!amount || amount <= 0) return;

		setLoading(true);
		try {
			await transactionApi.deposit(Number(amount));
			setSuccess(true);

			// shrink card
			if (cardRef.current) {
				gsap.to(cardRef.current, { opacity: 0, scale: 0.8, duration: 0.5 });
			}
			// success message
			if (successRef.current) {
				gsap.fromTo(
					successRef.current,
					{ scale: 0, opacity: 0 },
					{ scale: 1, opacity: 1, duration: 0.6, ease: "bounce.out" }
				);
			}
			// redirect
			setTimeout(() => router.push("/client/dashboard"), 1400);
		} finally {
			setLoading(false);
		}
	};

	const invalid = !amount || amount <= 0;
	const amt = typeof amount === "number" ? amount : 0;
	// Preview percent: 0 when amt=0, full at 1000+
	const percent = amt > 0 ? Math.min((amt / 1000) * 100, 100) : 0;

	return (
		<div
			ref={bgRef}
			className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
			style={{ backgroundColor: "var(--color-cream)" }}
		>
			<form
				ref={cardRef}
				onSubmit={handleDeposit}
				className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl border z-10 relative"
				style={{ borderColor: "rgba(0,0,0,0.05)" }}
			>
				<motion.h1
					className="flex items-center mb-6 text-3xl font-bold"
					style={{ color: "var(--color-primary)" }}
					initial={{ x: -30, opacity: 0 }}
					animate={{ x: 0, opacity: 1 }}
					transition={{ duration: 0.5 }}
				>
					<ArrowUpCircle size={28} className="mr-2" /> Deposit Funds
				</motion.h1>

				{/* Current Balance */}
				{loadingBalance ? (
					<div
						className="h-6 w-32 mb-6 rounded animate-pulse"
						style={{ backgroundColor: "rgba(0,0,0,0.1)" }}
					/>
				) : (
					<p className="text-gray-600 mb-4">
						Current Balance:{" "}
						<span className="font-semibold text-black">
							${balance.toFixed(2)}
						</span>
					</p>
				)}

				{/* Preset Buttons */}
				{!loadingBalance && (
					<div className="flex space-x-3 mb-4">
						{[50, 100, 250, 500, 1000].map((val) => (
							<button
								key={val}
								type="button"
								onClick={() => setAmount(val)}
								className="flex-1 py-2 rounded-lg font-medium text-sm"
								style={{
									backgroundColor: "var(--color-primary)",
									color: "white",
								}}
							>
								+${val}
							</button>
						))}
					</div>
				)}

				{/* Amount Input */}
				<motion.input
					type="number"
					value={amount}
					onChange={(e) => setAmount(Number(e.target.value))}
					placeholder="Enter amount"
					className="w-full p-3 mb-3 border rounded-lg focus:outline-none focus:ring-2"
					style={{ borderColor: "var(--color-accent)" }}
					initial={{ opacity: 0.7 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.4 }}
				/>

				{/* Preview Bar */}
				<div className="w-full h-2 bg-gray-200 rounded-full mb-4">
					<div
						className="h-full rounded-full"
						style={{
							width: `${percent}%`,
							backgroundColor: "var(--color-accent)",
							transition: "width 0.4s ease-in-out",
						}}
					/>
				</div>

				{/* Submit Button */}
				<motion.button
					type="submit"
					disabled={loading || invalid}
					className="w-full py-3 rounded-lg text-white font-semibold disabled:opacity-50"
					style={{ backgroundColor: "var(--color-primary)" }}
					whileHover={{ scale: 1.03 }}
					whileTap={{ scale: 0.97 }}
				>
					{loading ? "Processing..." : "Deposit"}
				</motion.button>
			</form>

			{/* Success Overlay */}
			{success && (
				<div
					ref={successRef}
					className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white bg-opacity-90"
				>
					<CheckCircle size={64} className="text-green-500 mb-4" />
					<p className="text-2xl font-bold text-green-700">
						Deposit Successful!
					</p>
				</div>
			)}
		</div>
	);
}
