"use client";

import { useState } from "react";
import { transactionApi } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function DepositPage() {
  const [amount, setAmount] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount <= 0) return;

    setLoading(true);
    try {
      await transactionApi.deposit(Number(amount));
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex justify-center items-center p-6"
      style={{ backgroundColor: "var(--color-cream)" }}
    >
      <form
        onSubmit={handleDeposit}
        className="w-full max-w-sm p-6 rounded-xl shadow border"
        style={{ backgroundColor: "white", borderColor: "rgba(0,0,0,0.05)" }}
      >
        <h1
          className="text-xl font-bold mb-4"
          style={{ color: "var(--color-primary)" }}
        >
          Deposit Funds
        </h1>

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="Enter amount"
          className="w-full p-2 border rounded-lg mb-4 focus:outline-none"
          style={{ borderColor: "rgba(0,0,0,0.1)" }}
        />

        <button
          type="submit"
          disabled={loading || !amount}
          className="w-full py-2 rounded-lg text-white font-medium disabled:opacity-50"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          {loading ? "Processing..." : "Deposit"}
        </button>
      </form>
    </div>
  );
}