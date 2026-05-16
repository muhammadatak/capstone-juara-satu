import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

// TODO: Replace dengan API call POST /api/auth/login
const ADMIN_CREDENTIALS = { email: 'a@a', password: 'a' }

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loginError, setLoginError] = useState('')

  const login = (email, password) => {
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      setUser({ email, name: 'Admin CIMB Niaga', role: 'admin' })
      setLoginError('')
      return true
    }
    setLoginError('Email atau password salah.')
    return false
  }

  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, login, logout, loginError }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
