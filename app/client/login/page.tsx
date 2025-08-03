"use client";

import { useState } from "react";
import { Mail, Lock, LogIn } from "lucide-react";
import { useAuth } from "@/app/client/providers/AuthProvider";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LoginPage() {
	const { login } = useAuth();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		try {
			const loggedInUser = await login(email, password);

			// Redirect based on role
			if (loggedInUser?.isAdmin) {
				router.push("/client/admin/dashboard");
			} else if (loggedInUser?.name) {
				router.push("/client/dashboard");
			} else {
				router.push("/client/login");
			}
		}finally {
			setLoading(false);
		}
	};

	return (
		<div
			className="relative flex min-h-screen items-center justify-center 
        bg-gradient-to-br from-emerald-700 via-emerald-600 to-emerald-800 overflow-hidden"
		>
			{/* Animated Background Blobs */}
			<div className="absolute -top-32 -left-32 w-[30rem] h-[30rem] bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
			<div className="absolute top-40 -right-40 w-[35rem] h-[35rem] bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000" />
			<div className="absolute bottom-0 left-1/2 w-[40rem] h-[40rem] bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000" />

			{/* Card */}
			<div
				className="relative z-10 w-full max-w-md 
          bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-white/20"
			>
				<h1 className="text-2xl font-bold text-[color:var(--color-primary)] text-center mb-6">
					Welcome Back
				</h1>

				<form className="space-y-4" onSubmit={handleLogin}>
					{/* Email Input */}
					<div className="relative">
						<Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--color-primary)] w-5 h-5" />
						<input
							type="email"
							placeholder="Email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 
                focus:ring-2 focus:ring-[color:var(--color-primary)] focus:border-[color:var(--color-primary)] 
                outline-none transition-all"
							required
						/>
					</div>

					{/* Password Input */}
					<div className="relative">
						<Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--color-primary)] w-5 h-5" />
						<input
							type="password"
							placeholder="Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 
                focus:ring-2 focus:ring-[color:var(--color-primary)] focus:border-[color:var(--color-primary)] 
                outline-none transition-all"
							required
						/>
					</div>

					{/* Login Button */}
					<button
						type="submit"
						disabled={loading}
						className="btn-primary flex items-center justify-center gap-2 w-full"
					>
						{loading ? (
							<div className="flex items-center gap-2 font-medium">
								<span>Logging In</span>
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
								<LogIn className="w-5 h-5" />
								Login
							</>
						)}
					</button>

					{/* Bottom Links */}
					<div className="flex justify-between text-sm mt-2">
						<Link
							href="/client/register"
							className="relative inline-block text-[color:var(--color-accent)] font-medium group"
						>
							Register here
							<span
								className="absolute left-0 -bottom-0.5 w-0 h-0.5 
                bg-[color:var(--color-accent)] transition-all duration-300 group-hover:w-full"
							></span>
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
}
