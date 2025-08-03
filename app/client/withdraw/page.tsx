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
      tl.to(bgRef.current, { backgroundColor: "var(--color-cream)", duration: 5 });
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
  const percent = amount && balance ? Math.min((Number(amount) / balance) * 100, 100) : 0;

  return (
    <div
      ref={bgRef}
      className="min-h-screen flex justify-center items-center p-6 relative overflow-hidden"
      style={{ backgroundColor: "var(--color-cream)" }}
    >
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
                className="flex-1 py-1 rounded-lg font-medium text-sm"
                style={{
                  backgroundColor:
                    pct === 100 ? "var(--color-primary)" : "rgba(0,0,0,0.05)",
                  color: pct === 100 ? "white" : "black",
                }}
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
          className="w-full py-3 rounded-lg text-white font-medium disabled:opacity-50"
          style={{ backgroundColor: "var(--color-accent)" }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? "Processing..." : "Withdraw"}
        </motion.button>
      </form>

      {/* Success Overlay */}
      {success && (
        <div
          ref={successRef}
          className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-90 z-20"
        >
          <Check size={64} className="text-green-500 mb-4" />
          <p className="text-xl font-bold text-green-700">Withdrawal Successful!</p>
        </div>
      )}
    </div>
  );
}