import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth()
  if (isLoading) return <div className="grid min-h-screen place-items-center bg-slate-50 text-sm text-slate-500">Loading your account…</div>
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}
