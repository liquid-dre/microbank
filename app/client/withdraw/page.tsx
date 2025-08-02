"use client";

import { useState, useEffect } from "react";
import { transactionApi } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function WithdrawPage() {
  const [amount, setAmount] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const [loadingBalance, setLoadingBalance] = useState(true);
  const router = useRouter();

  // Fetch balance on page load
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const { balance } = await fetch("/api/transactions").then((res) =>
          res.json()
        );
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
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const invalidAmount =
    !amount || amount <= 0 || (amount as number) > balance;

  return (
    <div
      className="min-h-screen flex justify-center items-center p-6"
      style={{ backgroundColor: "var(--color-cream)" }}
    >
      <form
        onSubmit={handleWithdraw}
        className="w-full max-w-sm p-6 rounded-xl shadow border"
        style={{ backgroundColor: "white", borderColor: "rgba(0,0,0,0.05)" }}
      >
        <h1
          className="text-xl font-bold mb-4"
          style={{ color: "var(--color-accent)" }}
        >
          Withdraw Funds
        </h1>

        {/* Balance Display */}
        {loadingBalance ? (
          <div
            className="h-6 w-24 mb-4 rounded animate-pulse"
            style={{ backgroundColor: "rgba(0,0,0,0.1)" }}
          ></div>
        ) : (
          <p className="text-gray-600 mb-4">
            Current Balance:{" "}
            <span className="font-semibold text-black">
              ${balance.toFixed(2)}
            </span>
          </p>
        )}

        {/* Input */}
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="Enter amount"
          className="w-full p-2 border rounded-lg mb-4 focus:outline-none"
          style={{ borderColor: "rgba(0,0,0,0.1)" }}
        />

        {/* Error */}
        {amount && amount > balance && (
          <p className="text-red-500 text-sm mb-2">
            Insufficient balance for this withdrawal.
          </p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || invalidAmount || loadingBalance}
          className="w-full py-2 rounded-lg text-white font-medium disabled:opacity-50"
          style={{ backgroundColor: "var(--color-accent)" }}
        >
          {loading ? "Processing..." : "Withdraw"}
        </button>
      </form>
    </div>
  );
}