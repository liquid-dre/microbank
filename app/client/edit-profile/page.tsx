"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function EditProfilePage() {
	const { user, refreshProfile } = useAuth();
	const router = useRouter();

	const [name, setName] = useState(user?.name || "");
	const [loading, setLoading] = useState(false);

	const handleSave = async () => {
		try {
			setLoading(true);

			const res = await fetch("/api/auth/update", {
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
		<div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded shadow">
			<h1 className="text-xl font-bold mb-4">Edit Profile</h1>

			<label className="block mb-2 font-medium">Name</label>
			<Input
				value={name}
				onChange={(e) => setName(e.target.value)}
				className="mb-4"
			/>

			<Button onClick={handleSave} disabled={loading} className="w-full">
				{loading ? "Saving..." : "Save Changes"}
			</Button>
		</div>
	);
}
