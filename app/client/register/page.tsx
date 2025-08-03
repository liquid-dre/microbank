"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, User, UserPlus } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { authApi } from "@/app/client/lib/api";
import { useRouter } from "next/navigation";
import SkeletonBlock from "@/components/layout/SkeletonBlock";

export default function RegisterPage() {
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const name = formData.get("name") as string;
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;

		try {
			setLoading(true);
			await authApi.register(name, email, password);
			toast.success("Registration successful! Redirecting...");
			router.push("/");
		} catch {
			toast.error("Registration failed. Try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<motion.div
			className="flex min-h-screen items-center justify-center  bg-gradient-to-br from-emerald-700 via-emerald-600 to-emerald-800 relative"
			initial={{ opacity: 0, y: 40 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -40 }}
			transition={{ duration: 0.5 }}
		>
			{/* Background accents */}
			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute w-[600px] h-[600px] bg-[var(--color-primary)] rounded-full blur-3xl opacity-20 top-[-200px] left-[-200px]" />
				<div className="absolute w-[500px] h-[500px] bg-[var(--color-accent)] rounded-full blur-3xl opacity-20 bottom-[-150px] right-[-150px]" />
			</div>

			<div className="relative z-10 w-full max-w-md bg-white rounded-xl shadow-lg p-8">
				<h2 className="text-2xl font-bold text-center mb-6 text-[var(--color-primary)]">
					Create Your Account
				</h2>

				<form onSubmit={handleRegister} className="space-y-4">
					{/* Name Input */}
					<div className="relative">
						<User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
						<input
							name="name"
							type="text"
							placeholder="Full Name"
							required
							className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
						/>
					</div>

					{/* Email Input */}
					<div className="relative">
						<Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
						<input
							name="email"
							type="email"
							placeholder="Email"
							required
							className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
						/>
					</div>

					{/* Password Input */}
					<div className="relative">
						<Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
						<input
							name="password"
							type="password"
							placeholder="Password"
							required
							className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
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
							<SkeletonBlock rows={3} width="100%" height="40px" />
						) : (
							<UserPlus className="w-5 h-5" />
						)}
						Register
					</button>
				</form>

				<p className="text-center text-gray-600 text-sm mt-4">
					Already have an account?{" "}
					<Link
						href="/"
						className="relative group font-medium text-[var(--color-accent)]"
					>
						Login here
						<span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[var(--color-accent)] transition-all group-hover:w-full"></span>
					</Link>
				</p>
			</div>
		</motion.div>
	);
}
