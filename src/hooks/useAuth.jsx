import { createContext, useContext, useState } from 'react'
import { authService } from '../features/auth/auth.service'
import storage from '../lib/storage'

const TOKEN_KEY = 'token'
const USER_KEY = 'user'

// Provide a safe default so consumers don't destructure undefined
const AuthContext = createContext({
  user: null,
  login: async () => {
    throw new Error('AuthProvider is missing')
  },
  logout: () => {
    throw new Error('AuthProvider is missing')
  },
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => storage.get(USER_KEY))

  const login = async ({ email, password }) => {
    const data = await authService.login({ email, password })

    storage.set(USER_KEY, data)
    storage.set(TOKEN_KEY, data.token)
    setUser(data)

    return data
  }

  const logout = () => {
    storage.remove(USER_KEY)
    storage.remove(TOKEN_KEY)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
