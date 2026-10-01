import { Link } from 'react-router-dom'

export default function Brand({ to = '/dashboard', compact = false }) {
  return (
    <Link to={to} className="inline-flex items-center gap-2.5 text-slate-950" aria-label="AccountFlow home">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-600 text-sm font-bold text-white shadow-sm">A</span>
      {!compact && <span className="text-base font-semibold tracking-tight">AccountFlow</span>}
    </Link>
  )
}
