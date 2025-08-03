import { prisma } from "@/app/services/client-services/prisma/prisma";

export async function getUserTransactions(userId: string) {
  return prisma.transaction.findMany({
    where: { clientId: userId },
    orderBy: { createdAt: 'desc' },
  });
}

export function calculateBalance(transactions: any[]) {
  return transactions.reduce((acc, tx) =>
    tx.type === 'DEPOSIT' ? acc + tx.amount : acc - tx.amount
  , 0);
}

export async function createTransaction(userId: string, type: 'DEPOSIT' | 'WITHDRAWAL', amount: number) {
  // Get client to check blacklist
  const client = await prisma.client.findUnique({ where: { id: userId } });
  if (!client || client.isBlacklisted) {
    throw new Error('Blacklisted or not found');
  }

  // Calculate current balance
  const transactions = await getUserTransactions(userId);
  const balance = calculateBalance(transactions);

  // Check for overdraft
  if (type === 'WITHDRAWAL' && amount > balance) {
    throw new Error('Insufficient funds');
  }

  // Create transaction
  return prisma.transaction.create({
    data: {
      type,
      amount,
      clientId: userId,
    },
  });
}