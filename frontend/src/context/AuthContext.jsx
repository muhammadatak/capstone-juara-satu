import { createContext, useContext, useState } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const TOKEN_KEY = 'admin_token'
const USER_KEY = 'admin_user'

function loadUser() {
  try {
    const stored = localStorage.getItem(USER_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    localStorage.removeItem(USER_KEY)
    return null
  }
}

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
})

export function AuthProvider({ children }) {
  // Lazy initializer — baca localStorage SEBELUM render pertama
  const [user, setUser] = useState(loadUser)
  const [loginError, setLoginError] = useState('')

  const login = async (email, password) => {
    setLoginError('')
    try {
      const { data } = await api.post('/auth/login', { email, password })
      localStorage.setItem(TOKEN_KEY, data.access_token)
      const userData = { email: data.email, username: data.username, role: 'admin' }
      localStorage.setItem(USER_KEY, JSON.stringify(userData))
      setUser(userData)
      return true
    } catch (err) {
      const msg = err?.response?.data?.detail || 'Gagal login. Periksa koneksi.'
      setLoginError(msg)
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loginError }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
