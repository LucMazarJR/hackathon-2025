import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: number
  name: string
  email: string
  cpf: string
  user_type: 'patient' | 'doctor' | 'admin'
}

interface UserContextType {
  user: User | null
  setUser: (user: User | null) => void
  userId: string | null
  setUserId: (id: string | null) => void
  isLoggedIn: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

interface UserProviderProps {
  children: ReactNode
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user')
    const savedLoginStatus = localStorage.getItem('isLoggedIn')
    
    if (savedUser && savedLoginStatus === 'true') {
      try {
        return JSON.parse(savedUser)
      } catch {
        return null
      }
    }
    return null
  })

  const [userId, setUserId] = useState<string | null>(() => {
    return user ? user.id.toString() : null
  })

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('isLoggedIn', 'true')
      setUserId(user.id.toString())
    } else {
      localStorage.removeItem('user')
      localStorage.removeItem('isLoggedIn')
      setUserId(null)
    }
  }, [user])

  const value = {
    user,
    setUser,
    userId,
    setUserId,
    isLoggedIn: user !== null
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser deve ser usado dentro de UserProvider')
  }
  return context
}