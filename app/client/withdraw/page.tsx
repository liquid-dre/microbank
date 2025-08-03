"use client";

import { useState, useEffect, useRef } from "react";
import { transactionApi } from "@/app/client/lib/api";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowDownCircle, Check } from "lucide-react";
import { gsap } from "gsap";

export default function WithdrawPage() {
	const [amount, setAmount] = useState<number | "">("");
	const [loading, setLoading] = useState(false);
	const [balance, setBalance] = useState(0);
	const [loadingBalance, setLoadingBalance] = useState(true);
	const [success, setSuccess] = useState(false);
	const router = useRouter();

	const bgRef = useRef<HTMLDivElement>(null);
	const cardRef = useRef<HTMLFormElement>(null);
	const successRef = useRef<HTMLDivElement>(null);

	// Background color animation
	useEffect(() => {
		if (bgRef.current) {
			const tl = gsap.timeline({ repeat: -1, yoyo: true });
			tl.to(bgRef.current, { backgroundColor: "#e0f7fa", duration: 5 });
			tl.to(bgRef.current, { backgroundColor: "#FDE2E4", duration: 5 });
			tl.to(bgRef.current, {
				backgroundColor: "var(--color-cream)",
				duration: 5,
			});
		}
	}, []);

	// Fetch balance on mount
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

	const handleWithdraw = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!amount || amount <= 0 || amount > balance) return;

		setLoading(true);
		try {
			await transactionApi.withdraw(Number(amount));
			setSuccess(true);

			// Animate card shrinking
			if (cardRef.current) {
				gsap.to(cardRef.current, { opacity: 0, scale: 0.8, duration: 0.6 });
			}

			// Show success overlay
			if (successRef.current) {
				gsap.fromTo(
					successRef.current,
					{ scale: 0, opacity: 0 },
					{ scale: 1, opacity: 1, duration: 0.6, ease: "bounce.out" }
				);
			}

			// Redirect after animation
			setTimeout(() => {
				router.push("/client/dashboard");
			}, 1500);
		} finally {
			setLoading(false);
		}
	};

	const invalidAmount = !amount || amount <= 0 || (amount as number) > balance;
	const percent =
		amount && balance ? Math.min((Number(amount) / balance) * 100, 100) : 0;

	return (
		<div className="min-h-screen flex justify-center items-center p-6 relative overflow-hidden">
			{/* 🌟 Animated Blobs Background */}
			<motion.div
				className="absolute top-0 left-1/4 w-72 h-72 bg-[var(--color-primary)] opacity-20 rounded-full"
				animate={{ x: [0, 180, -100, 0], y: [0, 120, -80, 0] }}
				transition={{
					duration: 10,
					repeat: Infinity,
					repeatType: "mirror",
					ease: "easeInOut",
				}}
			>
				{/* Orbit container */}
				<motion.div
					className="absolute inset-0 flex items-center justify-center"
					animate={{ rotate: 360 }}
					transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
					style={{ transformOrigin: "center", padding: "80px" }} // expand orbit space
				>
					{/* Orbiting circles - spread out */}
					<div className="absolute w-3 h-3 bg-[var(--color-accent)] rounded-full -top-16" />
					<div className="absolute w-2.5 h-2.5 bg-[var(--color-primary-dark,#1B5E20)] rounded-full top-20 right-20" />
					<div className="absolute w-2 h-2 bg-[var(--color-accent)] rounded-full bottom-16" />
					<div className="absolute w-2.5 h-2.5 bg-[var(--color-primary-dark,#1B5E20)] rounded-full -left-16" />
					<div className="absolute w-2 h-2 bg-[var(--color-accent)] rounded-full top-4 right-28" />
					<div className="absolute w-1.5 h-1.5 bg-[var(--color-primary-dark,#1B5E20)] rounded-full bottom-4 left-20" />
					<div className="absolute w-2 h-2 bg-[var(--color-accent)] rounded-full top-12 left-16" />
					<div className="absolute w-2 h-2 bg-[var(--color-primary-dark,#1B5E20)] rounded-full bottom-12 right-16" />
				</motion.div>
			</motion.div>

			{/* Other floating circles */}
			<motion.div
				className="absolute bottom-0 right-8 w-80 h-80 bg-gradient-to-br from-[var(--color-accent)] to-transparent opacity-25 rounded-full"
				animate={{ scale: [1, 1.15, 1], x: [0, -80, 0], y: [0, -60, 0] }}
				transition={{ duration: 10, repeat: Infinity, repeatType: "mirror" }}
			/>
			<motion.div
				className="absolute bottom-24 right-16 w-6 h-6 bg-[var(--color-primary)] opacity-40 rounded-full"
				animate={{ y: [0, -20, 0], x: [0, 20, 0] }}
				transition={{ duration: 6, repeat: Infinity, repeatType: "mirror" }}
			/>
			<motion.div
				className="absolute bottom-12 right-40 w-9 h-9 bg-[var(--color-accent)] opacity-30 rounded-full"
				animate={{ y: [0, -16, 0], x: [0, -16, 0] }}
				transition={{ duration: 7, repeat: Infinity, repeatType: "mirror" }}
			/>
			<motion.div
				className="absolute bottom-36 right-8 w-5 h-5 bg-[var(--color-primary)] opacity-50 rounded-full"
				animate={{ y: [0, -12, 0], x: [0, 12, 0] }}
				transition={{ duration: 5, repeat: Infinity, repeatType: "mirror" }}
			/>

			{/* Rotating Rings */}
			<motion.div
				className="absolute inset-0 flex items-center justify-center pointer-events-none"
				initial={{ rotate: 0 }}
				animate={{ rotate: 360 }}
				transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
			>
				<div className="w-[28rem] h-[28rem] border-[2px] border-[var(--color-primary)] rounded-full opacity-10" />
				<div className="w-80 h-80 border-[2px] border-[var(--color-accent)] rounded-full opacity-10 absolute" />
			</motion.div>

			<form
				ref={cardRef}
				onSubmit={handleWithdraw}
				className="w-full max-w-md p-8 rounded-2xl shadow-xl border bg-white relative z-10"
				style={{ borderColor: "rgba(0,0,0,0.05)" }}
			>
				<motion.h1
					className="flex items-center text-2xl font-bold mb-6"
					style={{ color: "var(--color-accent)" }}
					initial={{ scale: 0.9 }}
					animate={{ scale: 1 }}
					transition={{ duration: 0.3 }}
				>
					<ArrowDownCircle className="mr-2" size={24} />
					Withdraw Funds
				</motion.h1>

				{/* Balance */}
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

				{/* Presets */}
				{!loadingBalance && (
					<div className="flex space-x-2 mb-4">
						{[25, 50, 75, 100].map((pct) => (
							<button
								key={pct}
								type="button"
								onClick={() => setAmount(Math.floor((balance * pct) / 100))}
								className={`flex-1 py-1 rounded-lg font-medium text-sm transition-colors duration-200
    ${
			pct === 100
				? "bg-[var(--color-primary)] text-white hover:bg-[var(--color-accent)] hover:text-white"
				: "bg-[rgba(0,0,0,0.05)] text-black hover:bg-[var(--color-accent)] hover:text-white"
		}
  `}
							>
								{pct}%
							</button>
						))}
					</div>
				)}

				{/* Input */}
				<input
					type="number"
					value={amount}
					onChange={(e) => setAmount(Number(e.target.value))}
					placeholder="Enter amount"
					className="w-full p-3 border rounded-lg mb-2 focus:outline-none focus:ring-2"
					style={{
						borderColor: "var(--color-primary)",
						transition: "border-color 0.3s",
					}}
				/>

				{/* Progress */}
				{balance > 0 && (
					<div className="w-full h-2 bg-gray-200 rounded-full mb-4">
						<div
							className="h-full rounded-full"
							style={{
								width: `${percent}%`,
								backgroundColor: "var(--color-primary)",
								transition: "width 0.3s ease-in-out",
							}}
						/>
					</div>
				)}

				{/* Error */}
				{!!amount && amount > balance && (
					<motion.p
						className="text-red-500 text-sm mb-2"
						initial={{ x: -10 }}
						animate={{ x: 0 }}
						transition={{ type: "spring", stiffness: 300 }}
					>
						Insufficient balance for this withdrawal.
					</motion.p>
				)}

				{/* Button */}
				<motion.button
					type="submit"
					disabled={loading || invalidAmount || loadingBalance}
					className="w-full py-3 rounded-lg text-white font-medium disabled:opacity-50
             flex justify-center items-center"
					style={{ backgroundColor: "var(--color-accent)" }}
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
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
						"Withdraw"
					)}
				</motion.button>
			</form>

			{/* Success Overlay */}
			{success && (
				<div
					ref={successRef}
					className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-90 z-20"
				>
					<Check size={64} className="text-green-500 mb-4" />
					<p className="text-xl font-bold text-green-700">
						Withdrawal Successful!
					</p>
				</div>
			)}
		</div>
	);
}
