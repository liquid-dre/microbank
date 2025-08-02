import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

	//  GET: Return all transactions for authenticated user
	// 	POST: Create a deposit/withdrawal
	// 	Must not be blacklisted
	// 	Must not overdraft
	// 	Must record in Transaction

export async function GET() {
  const token = (await cookies()).get('token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const payload: any = verify(token, process.env.JWT_SECRET!);
    const userId = payload.id;

    const transactions = await prisma.transaction.findMany({
      where: { clientId: userId },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate balance
    const balance = transactions.reduce((acc, tx) => {
      return tx.type === 'DEPOSIT' ? acc + tx.amount : acc - tx.amount;
    }, 0);

    return NextResponse.json({ balance, transactions });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  const token = (await cookies()).get('token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const payload: any = verify(token, process.env.JWT_SECRET!);
    const userId = payload.id;

    const client = await prisma.client.findUnique({ where: { id: userId } });
    if (!client || client.isBlacklisted)
      return NextResponse.json({ error: 'Blacklisted or not found' }, { status: 403 });

    const { type, amount } = await req.json();

    if (!['DEPOSIT', 'WITHDRAWAL'].includes(type))
      return NextResponse.json({ error: 'Invalid transaction type' }, { status: 400 });

    if (amount <= 0)
      return NextResponse.json({ error: 'Amount must be positive' }, { status: 400 });

    // Check balance for overdraft
    const transactions = await prisma.transaction.findMany({
      where: { clientId: userId },
    });

    const balance = transactions.reduce((acc, tx) => {
      return tx.type === 'DEPOSIT' ? acc + tx.amount : acc - tx.amount;
    }, 0);

    if (type === 'WITHDRAWAL' && amount > balance)
      return NextResponse.json({ error: 'Insufficient funds' }, { status: 400 });

    const transaction = await prisma.transaction.create({
      data: {
        type,
        amount,
        clientId: userId,
      },
    });

    return NextResponse.json({ success: true, transaction });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid token or internal error' }, { status: 500 });
  }
}