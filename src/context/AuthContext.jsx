import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { login as loginRequest } from '../api/authApi'
import { getCurrentUser, updateUser as updateUserRequest } from '../api/userApi'
import {
  clearSessionActivity,
  clearStoredUser,
  clearToken,
  getStoredUser,
  getToken,
  recordSessionActivity,
  setStoredUser,
  setToken,
} from '../utils/storage'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setAuthToken] = useState(getToken)
  const [user, setUser] = useState(getStoredUser)
  const [isLoading, setIsLoading] = useState(Boolean(getToken()))

  const logout = useCallback(() => {
    clearToken()
    clearStoredUser()
    clearSessionActivity()
    setAuthToken(null)
    setUser(null)
    setIsLoading(false)
  }, [])

  const refreshUser = useCallback(async () => {
    const currentUser = await getCurrentUser()
    setUser(currentUser)
    setStoredUser(currentUser)
    return currentUser
  }, [])

  useEffect(() => {
    if (!token) {
      setIsLoading(false)
      return undefined
    }

    let isMounted = true
    setIsLoading(true)
    refreshUser()
      .catch(() => {
        if (isMounted) logout()
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })
    return () => { isMounted = false }
  }, [token, refreshUser, logout])

  useEffect(() => {
    const handleUnauthorized = () => logout()
    window.addEventListener('accountflow:unauthorized', handleUnauthorized)
    return () => window.removeEventListener('accountflow:unauthorized', handleUnauthorized)
  }, [logout])

  const login = useCallback(async (username, password) => {
    const tokenData = await loginRequest(username, password)
    setToken(tokenData.access_token)
    setAuthToken(tokenData.access_token)
    const currentUser = await getCurrentUser()
    setUser(currentUser)
    setStoredUser(currentUser)
    recordSessionActivity('Signed in to AccountFlow')
    return currentUser
  }, [])

  const updateCurrentUser = useCallback(async (payload) => {
    const updatedUser = await updateUserRequest(payload)
    setUser(updatedUser)
    setStoredUser(updatedUser)
    recordSessionActivity('Updated profile in this session')
    return updatedUser
  }, [])

  const value = useMemo(() => ({
    token,
    user,
    isLoading,
    isAuthenticated: Boolean(token && user),
    login,
    logout,
    refreshUser,
    updateCurrentUser,
  }), [token, user, isLoading, login, logout, refreshUser, updateCurrentUser])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
