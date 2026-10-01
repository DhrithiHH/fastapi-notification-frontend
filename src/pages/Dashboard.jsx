import { Link } from 'react-router-dom'
import Button from '../components/Button'
import { useAuth } from '../hooks/useAuth'
import { formatDate, formatDateTime } from '../utils/format'
import { getSessionActivity } from '../utils/storage'

const Card = ({ label, children }) => <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card"><p className="text-sm font-medium text-slate-500">{label}</p><div className="mt-3 text-lg font-semibold text-slate-900">{children}</div></div>

export default function Dashboard() {
  const { user } = useAuth()
  const activities = getSessionActivity()
  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-sm font-medium text-indigo-600">Account overview</p><h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">Good morning, {user?.username}</h1><p className="mt-2 text-sm text-slate-500">Here’s what’s happening with your account.</p></div>
        <Link to="/profile"><Button variant="secondary">View profile</Button></Link>
      </section>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card label="Account status"><span className="inline-flex items-center gap-2 text-emerald-700"><span className="h-2 w-2 rounded-full bg-emerald-500" />Authenticated</span></Card>
        <Card label="Email"><span className="break-all text-base">{user?.email}</span></Card>
        <Card label="Account created"><span className="text-base">{formatDate(user?.created_at)}</span></Card>
        <Card label="Last updated"><span className="text-base">{formatDate(user?.updated_at)}</span></Card>
      </section>
      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card sm:p-6">
          <div className="flex items-start justify-between gap-4"><div><h2 className="text-lg font-semibold text-slate-900">Recent Account Activity</h2><p className="mt-1 text-sm text-slate-500">Actions recorded only in this browser session.</p></div><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">Session only</span></div>
          <div className="mt-6 divide-y divide-slate-100">
            {activities.length ? activities.map((activity) => <div key={`${activity.label}-${activity.occurredAt}`} className="flex items-center justify-between gap-4 py-4 first:pt-0"><div className="flex items-center gap-3"><span className="h-2.5 w-2.5 rounded-full bg-indigo-500" /><p className="text-sm font-medium text-slate-700">{activity.label}</p></div><time className="shrink-0 text-xs text-slate-400">{formatDateTime(activity.occurredAt)}</time></div>) : <p className="py-5 text-sm text-slate-500">No account actions have been recorded in this browser session.</p>}
          </div>
        </div>
        <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-5 sm:p-6"><p className="text-sm font-semibold text-indigo-700">Lifecycle emails</p><h2 className="mt-2 text-lg font-semibold text-slate-900">Events are processed asynchronously.</h2><p className="mt-3 text-sm leading-6 text-slate-600">Account creation, profile updates, and deletion enqueue lifecycle email processing in the backend.</p><Link to="/email-activity" className="mt-5 inline-block text-sm font-semibold text-indigo-700 hover:text-indigo-500">Explore email activity →</Link></div>
      </section>
    </div>
  )
}
