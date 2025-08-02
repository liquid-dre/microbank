import { toast } from 'sonner'

/**
 * Get JWT token from localStorage
 */
export const getToken = () => localStorage.getItem('token')

/**
 * Central request handler for all HTTP requests
 */
async function request<T>(
  url: string,
  options: RequestInit = {},
  showToast: boolean = false,
  successMessage?: string
): Promise<T> {
  const token = getToken()

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }

  try {
    const res = await fetch(url, { ...options, headers })

    if (!res.ok) {
      const errorMsg = await res.text()
      if (showToast) toast.error(errorMsg || 'Request failed')
      throw new Error(errorMsg || 'Request failed')
    }

    const data = await res.json()

    if (showToast && successMessage) {
      toast.success(successMessage)
    }

    return data
  } catch (err: any) {
    if (showToast) toast.error(err.message || 'Something went wrong')
    throw err
  }
}

/**
 * Generic API calls
 */
export const api = {
  get: <T>(url: string, showToast = false, successMessage?: string) =>
    request<T>(url, {}, showToast, successMessage),

  post: <T>(url: string, body: any, showToast = false, successMessage?: string) =>
    request<T>(
      url,
      { method: 'POST', body: JSON.stringify(body) },
      showToast,
      successMessage
    ),

  put: <T>(url: string, body: any, showToast = false, successMessage?: string) =>
    request<T>(
      url,
      { method: 'PUT', body: JSON.stringify(body) },
      showToast,
      successMessage
    ),

  delete: <T>(url: string, showToast = false, successMessage?: string) =>
    request<T>(
      url,
      { method: 'DELETE' },
      showToast,
      successMessage
    ),
}

/**
 * 🔐 Auth API
 */
export const authApi = {
  register: (name: string, email: string, password: string) =>
    api.post<{ token: string }>('/api/auth/register', { name, email, password }, true, 'Registration successful'),

  login: (email: string, password: string) =>
    api.post<{ token: string }>('/api/auth/login', { email, password }, true, 'Login successful'),

  profile: () => api.get<User>('/api/profile'),
}

/**
 * 💰 Transactions API
 */
export const transactionApi = {
  list: () => api.get<Transaction[]>('/api/transactions'),
  deposit: (amount: number) =>
    api.post<Transaction>('/api/transactions', { type: 'deposit', amount }, true, 'Deposit successful!'),
  withdraw: (amount: number) =>
    api.post<Transaction>('/api/transactions', { type: 'withdraw', amount }, true, 'Withdrawal successful!'),
}

/**
 * 🛠️ Admin API
 */
export const adminApi = {
  listClients: () => api.get<User[]>('/api/admin/clients'),
  toggleBlacklist: (clientId: string) =>
    api.post<User>(
      '/api/admin/clients',
      { clientId },
      true,
      'Client blacklist status updated'
    ),
}

/**
 * Types (keep in sync with Prisma schema)
 */
export type User = {
  id: string
  name: string
  email: string
  isAdmin: boolean
  isBlacklisted: boolean
}

export type Transaction = {
  id: string
  userId: string
  type: 'deposit' | 'withdraw'
  amount: number
  createdAt: string
}