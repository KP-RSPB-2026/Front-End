import { createContext, useContext, useState } from 'react'

// Provide a safe default so consumers don't destructure undefined
const AuthContext = createContext({
  user: null,
  login: () => {
    throw new Error('AuthProvider is missing')
  },
  logout: () => {
    throw new Error('AuthProvider is missing')
  },
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })

  const login = ({ role }) => {
    const fakeUser = { role }
    setUser(fakeUser)
    localStorage.setItem('user', JSON.stringify(fakeUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
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
