'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { toast } from 'sonner'

// Create a context to store:
// 	•	user object
// 	•	token
// 	•	login(), logout(), register()

type User = {
  id: string
  name: string
  email: string
  isAdmin: boolean
  isBlacklisted: boolean
}

type AuthContextType = {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) throw new Error('Login failed')
      const data = await res.json()
      setToken(data.token)
      const userProfile = await fetchProfile(data.token)
      setUser(userProfile)
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(userProfile))
      toast.success(`Welcome back, ${userProfile.name}!`)
    } catch (err) {
      toast.error('Invalid email or password.')
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      if (!res.ok) throw new Error('Register failed')
      const data = await res.json()
      setToken(data.token)
      const userProfile = await fetchProfile(data.token)
      setUser(userProfile)
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(userProfile))
      toast.success(`Welcome, ${userProfile.name}! Your account is ready.`)
    } catch (err) {
      toast.error('Could not register. Please try again.')
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.clear()
    toast.info('Logged out successfully.')
  }

  const fetchProfile = async (jwt: string): Promise<User> => {
    const res = await fetch('/api/profile', {
      headers: { Authorization: `Bearer ${jwt}` },
    })
    if (!res.ok) throw new Error('Could not fetch profile')
    return res.json()
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}