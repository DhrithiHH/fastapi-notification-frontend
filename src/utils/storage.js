const TOKEN_KEY = 'accountflow_token'
const USER_KEY = 'accountflow_user'
const ACTIVITY_KEY = 'accountflow_session_activity'

export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token)
export const clearToken = () => localStorage.removeItem(TOKEN_KEY)

export const getStoredUser = () => {
  try {
    const user = localStorage.getItem(USER_KEY)
    return user ? JSON.parse(user) : null
  } catch {
    return null
  }
}

export const setStoredUser = (user) => localStorage.setItem(USER_KEY, JSON.stringify(user))
export const clearStoredUser = () => localStorage.removeItem(USER_KEY)

export function recordSessionActivity(label) {
  const current = getSessionActivity()
  const item = { label, occurredAt: new Date().toISOString() }
  sessionStorage.setItem(ACTIVITY_KEY, JSON.stringify([item, ...current].slice(0, 5)))
}

export function getSessionActivity() {
  try {
    return JSON.parse(sessionStorage.getItem(ACTIVITY_KEY) || '[]')
  } catch {
    return []
  }
}

export const clearSessionActivity = () => sessionStorage.removeItem(ACTIVITY_KEY)
