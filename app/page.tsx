"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { BarChart2, LifeBuoy, Shield, SlashIcon } from "lucide-react";
import { useAuth } from "./client/providers/AuthProvider";

const faqData = [
	{
		question: "Is Microbank really free to use?",
		answer:
			"Yes! Microbank offers a fully free plan so you can start managing your money right away, with no hidden fees.",
	},
	{
		question: "How secure is my data?",
		answer:
			"Bank-level encryption and strict privacy policies keep your data safe and for your eyes only.",
	},
	{
		question: "Can I upgrade to premium features?",
		answer:
			"Absolutely! Stay tuned—premium features are on the roadmap, and you’ll be the first to know.",
	},
];

function AccordionItem({ item }: { item: (typeof faqData)[0] }) {
	const [open, setOpen] = useState(false);
	return (
		<div className="border border-gray-200 rounded-lg overflow-hidden">
			<button
				onClick={() => setOpen(!open)}
				className="w-full flex justify-between items-center p-4 bg-[var(--color-cream)] hover:bg-gray-100 transition"
			>
				<span className="text-left text-gray-800 font-medium">
					{item.question}
				</span>
				<motion.span
					animate={{ rotate: open ? 180 : 0 }}
					transition={{ duration: 0.3 }}
				>
					<SlashIcon className="w-5 h-5 text-[var(--color-primary)]" />
				</motion.span>
			</button>
			<motion.div
				initial={{ height: 0, opacity: 0 }}
				animate={
					open ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }
				}
				transition={{ duration: 0.4 }}
				className="overflow-hidden px-4"
			>
				<p className="py-3 text-gray-700">{item.answer}</p>
			</motion.div>
		</div>
	);
}

export default function LandingPage() {
	const { user } = useAuth();
	const destination = !user
		? "/client/register"
		: user.isAdmin
			? "/client/admin/dashboard"
			: "/client/dashboard";

	return (
		<div className="bg-[var(--color-cream)] text-gray-800">
			{/* Hero Section */}
			<section className="relative h-screen flex items-center overflow-hidden pt-20 pb-36">
				<div className="max-w-3xl mx-auto px-6 text-center ">
					<motion.h1
						initial={{ y: -20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ duration: 0.8 }}
						className="text-5xl md:text-6xl font-extrabold text-[var(--color-primary)] mb-4"
					>
						Welcome to Microbank
					</motion.h1>
					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.5, duration: 0.8 }}
						className="text-xl md:text-2xl mb-8"
					>
						Your friendly microbanking partner—track expenses, grow your
						savings, and feel confident about your financial future.
					</motion.p>
					<motion.div
						initial={{ scale: 0.8, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{ delay: 1, duration: 0.6 }}
					>
						<Link
							href={destination}
							className="inline-block px-8 py-4 bg-[var(--color-accent)] text-white font-semibold rounded-full shadow-lg hover:bg-opacity-90 
      transition relative 
      ring-2 ring-[var(--color-accent)] ring-offset-2
      hover:animate-glow"
						>
							Get Started — It’s Free!
						</Link>
					</motion.div>
				</div>

				{/* Animated Blobs */}
				<motion.div
					className="absolute top-0 left-1/4 w-52 h-52 bg-[var(--color-primary)] opacity-20 rounded-full"
					animate={{
						x: [0, 120, -50, 0], // swings further left/right
						y: [0, 80, -40, 0], // moves up/down more dramatically
					}}
					transition={{
						duration: 8,
						repeat: Infinity,
						repeatType: "mirror",
						ease: "easeInOut",
					}}
				/>
				<motion.div
					className="absolute bottom-0 right-8 w-72 h-72 bg-gradient-to-br from-[var(--color-accent)] to-transparent opacity-25 rounded-full filter "
					animate={{
						scale: [1, 1.1, 1],
						x: [0, -60, 0],
						y: [0, -40, 0],
					}}
					transition={{ duration: 9, repeat: Infinity, repeatType: "mirror" }}
				/>
				{/* Little floating circles */}
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
			</section>

			{/* Features Section */}
			<section className="relative py-20 px-6 bg-[var(--color-cream)] overflow-hidden">
				{/* Subtle background blob */}
				<motion.div
					className="absolute inset-0 bg-[var(--color-primary)] opacity-10 rounded-full filter blur-3xl"
					animate={{ scale: [1, 1.1, 1] }}
					transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
				/>

				<div className="relative max-w-5xl mx-auto text-center">
					<motion.h2
						initial={{ y: 20, opacity: 0 }}
						whileInView={{ y: 0, opacity: 1 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className="text-4xl md:text-5xl font-extrabold text-[var(--color-primary)] mb-12"
					>
						Why You’ll Love Microbank
					</motion.h2>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{[
							{
								Icon: BarChart2,
								title: "Real-Time Insights",
								text: "See exactly where your money goes with live, beautifully charted analytics.",
							},
							{
								Icon: Shield,
								title: "Rock-Solid Security",
								text: "Your data is encrypted end-to-end with bank-grade protocols—privacy you can trust.",
							},
							{
								Icon: LifeBuoy,
								title: "24/7 Support",
								text: "Our friendly team is here anytime you need a hand or some financial advice.",
							},
						].map((feat, i) => (
							<motion.div
								key={i}
								className="group relative bg-white p-6 rounded-2xl shadow-lg overflow-hidden"
								initial={{ y: 30, opacity: 0 }}
								whileInView={{ y: 0, opacity: 1 }}
								viewport={{ once: true }}
								transition={{ delay: 0.2 * i, duration: 0.6 }}
								whileHover={{ scale: 1.03 }}
							>
								<div className="flex items-center justify-center w-16 h-16 mb-4 mx-auto bg-[var(--color-accent)] rounded-full text-white shadow-md transition-all group-hover:shadow-xl">
									<feat.Icon className="w-8 h-8" />
								</div>
								<h3 className="text-xl font-semibold mb-2 text-gray-800">
									{feat.title}
								</h3>
								<p className="text-gray-600 leading-relaxed">{feat.text}</p>

								{/* Animated underline on hover */}
								<motion.span
									className="absolute bottom-0 left-1/2 w-0 h-1 bg-[var(--color-primary)]"
									whileHover={{ width: "50%", x: "-25%" }}
									transition={{ duration: 0.5, ease: "easeInOut" }}
								/>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* FAQ Section */}
			<section className="py-16 px-6 bg-white">
				<h2 className="text-3xl md:text-4xl font-bold text-center text-[var(--color-primary)] mb-8">
					Frequently Asked Questions
				</h2>
				<div className="max-w-3xl mx-auto space-y-4">
					{faqData.map((item, idx) => (
						<AccordionItem key={idx} item={item} />
					))}
				</div>
			</section>

			{/* Footer */}
			<footer className="py-8 text-center text-sm text-gray-600">
				&copy; {new Date().getFullYear()} Microbank. Designed to help you grow.
			</footer>
		</div>
	);
}
