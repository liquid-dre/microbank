"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/client/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function EditProfilePage() {
	const { user, refreshProfile } = useAuth();
	const router = useRouter();

	const [name, setName] = useState(user?.name || "");
	const [loading, setLoading] = useState(false);

	const handleSave = async () => {
		try {
			setLoading(true);

			const res = await fetch("/services/client-services/auth/update", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name }),
			});

			if (!res.ok) throw new Error(await res.text());

			toast.success("Profile updated!");

			await refreshProfile();
			router.push("/client/dashboard");
		} catch (err: any) {
			toast.error(err.message || "Failed to update profile");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[var(--color-cream)]">
			{/* 🌟 Animated Blobs Background */}
			{[
				{ x: 150, y: 100, size: 52, color: "var(--color-primary)" },
				{ x: -100, y: 120, size: 64, color: "var(--color-accent)" },
				{ x: 80, y: -90, size: 48, color: "var(--color-primary)" },
				{ x: -140, y: -70, size: 40, color: "var(--color-accent)" },
			].map((blob, idx) => (
				<motion.div
					key={idx}
					className="absolute opacity-20 rounded-full"
					style={{
						width: `${blob.size * 1}px`,
						height: `${blob.size * 1}px`,
						backgroundColor: blob.color,
						top: idx % 2 === 0 ? "10%" : "auto",
						bottom: idx % 2 !== 0 ? "10%" : "auto",
						left: idx % 3 === 0 ? "15%" : "auto",
						right: idx % 3 !== 0 ? "15%" : "auto",
					}}
					animate={{
						x: [0, blob.x, -blob.x / 2, 0],
						y: [0, blob.y, -blob.y / 2, 0],
					}}
					transition={{
						duration: 10 + idx * 2,
						repeat: Infinity,
						repeatType: "mirror",
						ease: "easeInOut",
					}}
				>
					{/* Orbit container with multiple orbiting mini-circles */}
					<motion.div
						className="absolute inset-0 flex items-center justify-center"
						animate={{ rotate: 360 }}
						transition={{
							duration: 15 + idx * 3,
							repeat: Infinity,
							ease: "linear",
						}}
					>
						{[...Array(6)].map((_, i) => (
							<div
								key={i}
								className="absolute rounded-full"
								style={{
									width: `${Math.random() * 4 + 1}px`,
									height: `${Math.random() * 4 + 1}px`,
									backgroundColor:
										i % 2 === 0
											? "var(--color-accent)"
											: "var(--color-primary-dark,#1B5E20)",
									top: `${Math.sin((i * Math.PI) / 3) * 20 + 20}px`,
									left: `${Math.cos((i * Math.PI) / 3) * 20 + 20}px`,
								}}
							/>
						))}
					</motion.div>
				</motion.div>
			))}

			{/* Floating Gradient Orbs */}
			<motion.div
				className="absolute bottom-0 right-8 w-72 h-72 bg-gradient-to-br from-[var(--color-accent)] to-transparent opacity-25 rounded-full"
				animate={{ scale: [1, 1.1, 1], x: [0, -60, 0], y: [0, -40, 0] }}
				transition={{ duration: 9, repeat: Infinity, repeatType: "mirror" }}
			/>
			<motion.div
				className="absolute top-10 left-10 w-60 h-60 bg-gradient-to-tl from-[var(--color-primary)] to-transparent opacity-20 rounded-full"
				animate={{ scale: [1, 1.05, 1], x: [0, 40, 0], y: [0, 30, 0] }}
				transition={{ duration: 12, repeat: Infinity, repeatType: "mirror" }}
			/>

			{/* Edit Profile Card */}
			<div className="w-full max-w-lg p-6 bg-white rounded-xl shadow-lg relative z-10">
				<h1 className="text-xl font-bold mb-4 text-[var(--color-accent)]">
					Edit Profile
				</h1>

				<label className="block mb-2 font-medium">Name</label>
				<Input
					value={name}
					onChange={(e) => setName(e.target.value)}
					className="mb-4"
				/>

				<Button
					onClick={handleSave}
					disabled={loading}
					className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-accent)] text-white transition-colors"
				>
					{loading ? "Saving..." : "Save Changes"}
				</Button>
			</div>
		</div>
	);
}
