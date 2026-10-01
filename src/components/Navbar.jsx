import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Brand from './Brand'
import Button from './Button'
import { NavLinks } from './Sidebar'

export default function Navbar() {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const initial = user?.username?.slice(0, 1).toUpperCase() || 'A'

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden">
        <Brand />
        <button type="button" onClick={() => setMenuOpen((open) => !open)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700" aria-expanded={menuOpen} aria-controls="mobile-menu">
          Menu
        </button>
      </header>
      {menuOpen && (
        <div id="mobile-menu" className="border-b border-slate-200 bg-white px-4 py-4 lg:hidden">
          <nav className="space-y-1" aria-label="Mobile navigation"><NavLinks onNavigate={() => setMenuOpen(false)} /></nav>
        </div>
      )}
      <header className="hidden h-16 items-center justify-end border-b border-slate-200 bg-white px-8 lg:flex">
        <div className="flex items-center gap-3">
          <div className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">{initial}</div>
          <span className="max-w-36 truncate text-sm font-medium text-slate-700">{user?.username}</span>
          <Button variant="ghost" className="min-h-8 px-2.5 text-xs" onClick={handleLogout}>Sign out</Button>
        </div>
      </header>
      <div className="border-b border-slate-200 bg-white px-4 py-2 lg:hidden">
        <button type="button" onClick={handleLogout} className="text-sm font-medium text-slate-600 hover:text-slate-900">Sign out</button>
      </div>
    </>
  )
}
