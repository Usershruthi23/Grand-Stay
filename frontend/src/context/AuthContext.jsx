import { createContext, useState, useEffect } from 'react'
import { loginUser, registerUser, logoutUser } from '../services/authService'

export const AuthContext = createContext(null)

const AUTH_STORAGE_KEY = 'grandstay_user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY)
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY)
    }
  }, [user])

  const login = async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      const res = await loginUser(email, password)
      if (res.success) {
        const userData = {
          id: res.userId,
          name: res.name,
          email: res.email,
          role: res.role,
          hotelId: res.hotelId
        }
        setUser(userData)
        return userData
      } else {
        throw new Error(res.message || 'Login failed')
      }
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const register = async (name, email, password) => {
    setLoading(true)
    setError(null)
    try {
      const res = await registerUser(name, email, password)
      if (res.success) {
        // Automatic login after register
        return await login(email, password)
      } else {
        throw new Error(res.message || 'Registration failed')
      }
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      await logoutUser()
    } catch {
      // Ignore network errors on logout
    } finally {
      setUser(null)
      localStorage.removeItem(AUTH_STORAGE_KEY)
      setLoading(false)
    }
  }

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isCustomer: user?.role === 'CUSTOMER',
    isAdmin: user?.role === 'HOTEL_ADMIN'
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
