import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/app/client/providers/AuthProvider";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/NavBar";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Microbank",
	description: "Created by Andre Dingiswayo",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className="bg-cream min-h-screen">
				<AuthProvider>
					<Navbar />
					{children}
					<Toaster position="top-right" richColors />
				</AuthProvider>
			</body>
		</html>
	);
}
