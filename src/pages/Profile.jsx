import { useEffect, useState } from 'react'
import Alert from '../components/Alert'
import Button from '../components/Button'
import Input from '../components/Input'
import { useAuth } from '../hooks/useAuth'
import { getErrorMessage } from '../utils/errors'
import { formatDateTime } from '../utils/format'

export default function Profile() {
  const { user, refreshUser, updateCurrentUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [form, setForm] = useState({ username: '', email: '' })
  const [fieldErrors, setFieldErrors] = useState({})
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    setForm({ username: user?.username || '', email: user?.email || '' })
  }, [user])

  useEffect(() => {
    let mounted = true
    setIsRefreshing(true)
    refreshUser().catch(() => {}).finally(() => { if (mounted) setIsRefreshing(false) })
    return () => { mounted = false }
  }, [refreshUser])

  const cancel = () => {
    setForm({ username: user?.username || '', email: user?.email || '' })
    setFieldErrors({})
    setError('')
    setIsEditing(false)
  }

  const save = async (event) => {
    event.preventDefault()
    const errors = {}
    if (!form.username.trim()) errors.username = 'Username is required.'
    if (!form.email.trim()) errors.email = 'Email is required.'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Enter a valid email address.'
    setFieldErrors(errors)
    setError('')
    setSuccess('')
    if (Object.keys(errors).length) return

    const updates = {}
    if (form.username.trim() !== user?.username) updates.username = form.username.trim()
    if (form.email.trim() !== user?.email) updates.email = form.email.trim()
    if (!Object.keys(updates).length) {
      setIsEditing(false)
      return
    }

    setIsLoading(true)
    try {
      await updateCurrentUser(updates)
      setSuccess('Profile changes saved. A lifecycle email event was queued for processing.')
      setIsEditing(false)
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'We could not save your profile changes.'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-7">
      <section><p className="text-sm font-medium text-indigo-600">Account settings</p><h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">Profile</h1><p className="mt-2 text-sm text-slate-500">Review and update the information associated with your account.</p></section>
      {success && <Alert type="success">{success}</Alert>}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-card sm:p-6">
        <div className="mb-6 flex items-start justify-between gap-4"><div><h2 className="text-lg font-semibold text-slate-900">Personal details</h2><p className="mt-1 text-sm text-slate-500">Your changes are saved directly to your account.</p></div>{!isEditing && <Button variant="secondary" onClick={() => { setSuccess(''); setIsEditing(true) }}>Edit profile</Button>}</div>
        {error && <div className="mb-5"><Alert>{error}</Alert></div>}
        {isEditing ? (
          <form onSubmit={save} className="space-y-5" noValidate>
            <Input label="Username" id="profile-username" value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} error={fieldErrors.username} />
            <Input label="Email address" id="profile-email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} error={fieldErrors.email} />
            <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-end"><Button variant="secondary" onClick={cancel} disabled={isLoading}>Cancel</Button><Button type="submit" loading={isLoading}>{isLoading ? 'Saving changes…' : 'Save changes'}</Button></div>
          </form>
        ) : (
          <dl className="divide-y divide-slate-100">
            <div className="grid gap-1 py-4 first:pt-0 sm:grid-cols-3"><dt className="text-sm font-medium text-slate-500">Username</dt><dd className="text-sm font-medium text-slate-900 sm:col-span-2">{isRefreshing ? 'Refreshing…' : user?.username}</dd></div>
            <div className="grid gap-1 py-4 sm:grid-cols-3"><dt className="text-sm font-medium text-slate-500">Email address</dt><dd className="break-all text-sm font-medium text-slate-900 sm:col-span-2">{user?.email}</dd></div>
            <div className="grid gap-1 py-4 sm:grid-cols-3"><dt className="text-sm font-medium text-slate-500">Account created</dt><dd className="text-sm text-slate-700 sm:col-span-2">{formatDateTime(user?.created_at)}</dd></div>
            <div className="grid gap-1 py-4 last:pb-0 sm:grid-cols-3"><dt className="text-sm font-medium text-slate-500">Last updated</dt><dd className="text-sm text-slate-700 sm:col-span-2">{formatDateTime(user?.updated_at)}</dd></div>
          </dl>
        )}
      </section>
    </div>
  )
}
