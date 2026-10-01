import { NavLink } from 'react-router-dom'
import Brand from './Brand'

const links = [
  { to: '/dashboard', label: 'Overview', mark: '⌂' },
  { to: '/profile', label: 'Profile', mark: '○' },
  { to: '/security', label: 'Security', mark: '◇' },
  { to: '/email-activity', label: 'Email Activity', mark: '↗' },
]

export function NavLinks({ onNavigate }) {
  return links.map((link) => (
    <NavLink
      key={link.to}
      to={link.to}
      onClick={onNavigate}
      className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'}`}
    >
      <span className="w-4 text-center text-base" aria-hidden="true">{link.mark}</span>
      {link.label}
    </NavLink>
  ))
}

export default function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white p-5 lg:flex lg:flex-col">
      <Brand />
      <nav className="mt-10 space-y-1" aria-label="Main navigation"><NavLinks /></nav>
      <div className="mt-auto rounded-lg border border-slate-200 bg-slate-50 p-3.5">
        <p className="text-xs font-semibold text-slate-700">Lifecycle email processing</p>
        <p className="mt-1 text-xs leading-5 text-slate-500">Account actions are queued for asynchronous email handling.</p>
      </div>
    </aside>
  )
}
