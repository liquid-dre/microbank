export type User = {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  isBlacklisted: boolean;
  avatar?: string | null;
};

export type TransactionType = 'DEPOSIT' | 'WITHDRAWAL';

export type Transaction = {
  id: string;
  clientId: string;  
  type: TransactionType;
  amount: number;
  createdAt: string;
};

export type TransactionResponse = {
  success: boolean;
  transaction: Transaction;
};

export type BalanceResponse = {
  balance: number;
  transactions: Transaction[];
};