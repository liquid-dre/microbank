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

	const cardRef = useRef<HTMLFormElement>(null);
	const successRef = useRef<HTMLDivElement>(null);
	const router = useRouter();

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
	const percent = amt > 0 ? Math.min((amt / 1000) * 100, 100) : 0;

	return (
		<div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[var(--color-cream)]">
			{/* 🌟 Animated Blobs Background */}
			<motion.div
				className="absolute top-0 left-1/4 w-52 h-52 bg-[var(--color-primary)] opacity-20 rounded-full"
				animate={{ x: [0, 120, -50, 0], y: [0, 80, -40, 0] }}
				transition={{
					duration: 8,
					repeat: Infinity,
					repeatType: "mirror",
					ease: "easeInOut",
				}}
			>
				{/* Orbit container */}
				<motion.div
					className="absolute inset-0 flex items-center justify-center"
					animate={{ rotate: 360 }}
					transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
				>
					{/* Orbiting circles */}
					<div className="absolute w-3 h-3 bg-[var(--color-accent)] rounded-full -top-8" />
					<div className="absolute w-2.5 h-2.5 bg-[var(--color-primary-dark,#1B5E20)] rounded-full top-12 right-12" />
					<div className="absolute w-2 h-2 bg-[var(--color-accent)] rounded-full bottom-8" />
					<div className="absolute w-2.5 h-2.5 bg-[var(--color-primary-dark,#1B5E20)] rounded-full -left-8" />
					<div className="absolute w-2 h-2 bg-[var(--color-accent)] rounded-full top-0 right-16" />
					<div className="absolute w-1.5 h-1.5 bg-[var(--color-primary-dark,#1B5E20)] rounded-full bottom-0 left-12" />
					<div className="absolute w-2 h-2 bg-[var(--color-accent)] rounded-full top-8 left-10" />
					<div className="absolute w-2 h-2 bg-[var(--color-primary-dark,#1B5E20)] rounded-full bottom-6 right-10" />
				</motion.div>
			</motion.div>
			<motion.div
				className="absolute bottom-0 right-8 w-72 h-72 bg-gradient-to-br from-[var(--color-accent)] to-transparent opacity-25 rounded-full"
				animate={{ scale: [1, 1.1, 1], x: [0, -60, 0], y: [0, -40, 0] }}
				transition={{ duration: 9, repeat: Infinity, repeatType: "mirror" }}
			/>
			<motion.div
				className="absolute bottom-24 right-16 w-5 h-5 bg-[var(--color-primary)] opacity-40 rounded-full"
				animate={{ y: [0, -10, 0], x: [0, 10, 0] }}
				transition={{ duration: 5, repeat: Infinity, repeatType: "mirror" }}
			/>
			<motion.div
				className="absolute bottom-12 right-32 w-7 h-7 bg-[var(--color-accent)] opacity-30 rounded-full"
				animate={{ y: [0, -8, 0], x: [0, -8, 0] }}
				transition={{ duration: 6, repeat: Infinity, repeatType: "mirror" }}
			/>
			<motion.div
				className="absolute bottom-32 right-8 w-4 h-4 bg-[var(--color-primary)] opacity-50 rounded-full"
				animate={{ y: [0, -6, 0], x: [0, 6, 0] }}
				transition={{ duration: 4, repeat: Infinity, repeatType: "mirror" }}
			/>
			<motion.div
				className="absolute inset-0 flex items-center justify-center pointer-events-none"
				initial={{ rotate: 0 }}
				animate={{ rotate: 360 }}
				transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
			>
				<div className="w-80 h-80 border-[2px] border-[var(--color-primary)] rounded-full opacity-10" />
				<div className="w-56 h-56 border-[2px] border-[var(--color-accent)] rounded-full opacity-10 absolute" />
			</motion.div>

			{/* Deposit Card */}
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
								className={`flex-1 py-1 rounded-lg font-medium text-sm transition-colors duration-200
    ${
			val === 1000
				? "bg-[var(--color-primary)] text-white hover:bg-[var(--color-accent)] hover:text-white"
				: "bg-[rgba(0,0,0,0.05)] text-black hover:bg-[var(--color-accent)] hover:text-white"
		}
  `}
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
					{loading ? (
						<div className="flex items-center gap-2 font-medium">
							<span>Processing</span>
							<div className="flex items-end h-4">
								{[0, 1, 2].map((i) => (
									<motion.span
										key={i}
										className="mx-0.5 w-1 h-1 bg-white rounded-full"
										animate={{ y: [0, -6, 0] }}
										transition={{
											repeat: Infinity,
											duration: 0.6,
											delay: i * 0.2,
										}}
									/>
								))}
							</div>
						</div>
					) : (
						"Deposit"
					)}
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
