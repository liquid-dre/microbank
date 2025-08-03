"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function ResetPasswordPage() {
	const [loading, setLoading] = useState(false);

	const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		try {
			setLoading(true);
			await new Promise((res) => setTimeout(res, 1500));
			toast.success("Password reset link sent to your email!");
		} catch {
			toast.error("Failed to send reset link.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<motion.div
			className="flex min-h-screen items-center justify-center bg-[var(--color-neutral)] relative"
			initial={{ opacity: 0, y: 40 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -40 }}
			transition={{ duration: 0.5 }}
		>
			{/* Background Accents */}
			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute w-[600px] h-[600px] bg-[var(--color-primary)] rounded-full blur-3xl opacity-20 top-[-200px] left-[-200px]" />
				<div className="absolute w-[500px] h-[500px] bg-[var(--color-accent)] rounded-full blur-3xl opacity-20 bottom-[-150px] right-[-150px]" />
			</div>

			<div className="relative z-10 w-full max-w-md bg-white rounded-xl shadow-lg p-8">
				<h2 className="text-2xl font-bold text-center mb-6 text-[var(--color-primary)]">
					Reset Password
				</h2>

				<form onSubmit={handleReset} className="space-y-4">
					<div className="relative">
						<Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
						<input
							name="email"
							type="email"
							placeholder="Enter your email"
							required
							className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
						/>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="flex items-center justify-center gap-2 w-full py-2 
             bg-[var(--color-primary)] hover:bg-[var(--color-accent)] 
             text-white rounded-lg transition-all duration-300"
					>
						{loading ? (
							<div className="flex items-center gap-2 font-medium">
								<span>Sending Email</span>
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
							<>
								<Send className="w-5 h-5" />
								<span>Send Reset Link</span>
							</>
						)}
					</button>
				</form>

				<p className="text-center text-gray-600 text-sm mt-4">
					Remember your password?{" "}
					<Link
						href="/client/login"
						className="relative group font-medium text-[var(--color-primary)]"
					>
						Login
						<span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[var(--color-accent)] transition-all group-hover:w-full"></span>
					</Link>
				</p>
			</div>
		</motion.div>
	);
}
