import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface UserContextType {
  userId: string | null
  setUserId: (id: string | null) => void
  isLoggedIn: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

interface UserProviderProps {
  children: ReactNode
}

export function UserProvider({ children }: UserProviderProps) {
  const [userId, setUserId] = useState<string | null>(() => {
    const savedUser = localStorage.getItem('user')
    const savedLoginStatus = localStorage.getItem('isLoggedIn')
    
    if (savedUser && savedLoginStatus === 'true') {
      try {
        const user = JSON.parse(savedUser)
        return user.id.toString()
      } catch {
        return null
      }
    }
    return null
  })

  useEffect(() => {
    if (userId) {
      localStorage.setItem('userId', userId)
    } else {
      localStorage.removeItem('userId')
    }
  }, [userId])

  const value = {
    userId,
    setUserId,
    isLoggedIn: userId !== null
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