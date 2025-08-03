import { cookies } from "next/headers";
import { verify, JwtPayload } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import {
	getUserTransactions,
	calculateBalance,
	createTransaction,
} from "./services";

interface AuthPayload extends JwtPayload {
	id: string;
}

export async function GET() {
	const token = (await cookies()).get("token")?.value;
	if (!token)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	try {
		const payload = verify(token, process.env.JWT_SECRET!) as AuthPayload;
		const userId = payload.id;

		const transactions = await getUserTransactions(userId);
		const balance = calculateBalance(transactions);

		return NextResponse.json({ balance, transactions });
	} catch (err: unknown) {
		console.error(err);
		return NextResponse.json({ error: "Invalid token" }, { status: 401 });
	}
}

export async function POST(req: NextRequest) {
	const token = (await cookies()).get("token")?.value;
	if (!token)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	try {
		const payload = verify(token, process.env.JWT_SECRET!) as AuthPayload;
		const userId = payload.id;

		const { type, amount } = (await req.json()) as {
			type: "DEPOSIT" | "WITHDRAWAL";
			amount: number;
		};

		if (!["DEPOSIT", "WITHDRAWAL"].includes(type))
			return NextResponse.json(
				{ error: "Invalid transaction type" },
				{ status: 400 }
			);

		if (amount <= 0)
			return NextResponse.json(
				{ error: "Amount must be positive" },
				{ status: 400 }
			);

		const transaction = await createTransaction(userId, type, amount);

		return NextResponse.json({ success: true, transaction });
	} catch (err: unknown) {
		if (err instanceof Error) {
			if (err.message === "Blacklisted or not found")
				return NextResponse.json({ error: err.message }, { status: 403 });

			if (err.message === "Insufficient funds")
				return NextResponse.json({ error: err.message }, { status: 400 });
		}

		return NextResponse.json(
			{ error: "Invalid token or internal error" },
			{ status: 500 }
		);
	}
}