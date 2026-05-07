'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User } from './types'

interface AuthContextType {
  user: User | null
  setUser: (user: User | null) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const stored = localStorage.getItem('bpo_user')
      setUser(stored ? JSON.parse(stored) : null)
      setIsLoading(false)
    }, 0)

    return () => window.clearTimeout(timeout)
  }, [])

  const handleSetUser = (user: User | null) => {
    setUser(user)
    if (user) {
      localStorage.setItem('bpo_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('bpo_user')
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('bpo_user')
  }

  return (
    <AuthContext.Provider value={{ user, setUser: handleSetUser, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
