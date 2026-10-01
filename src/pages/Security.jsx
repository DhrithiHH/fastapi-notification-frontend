import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Alert from '../components/Alert'
import Button from '../components/Button'
import Input from '../components/Input'
import Modal from '../components/Modal'
import { deleteUser } from '../api/userApi'
import { useAuth } from '../hooks/useAuth'
import { getErrorMessage } from '../utils/errors'

export default function Security() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  const closeModal = () => {
    if (isDeleting) return
    setIsModalOpen(false)
    setPassword('')
    setError('')
  }

  const removeAccount = async (event) => {
    event.preventDefault()
    if (!password) {
      setError('Enter your password to confirm account deletion.')
      return
    }
    setError('')
    setIsDeleting(true)
    try {
      await deleteUser(password)
      logout()
      navigate('/login', { replace: true, state: { accountDeleted: true } })
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'We could not delete your account.'))
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-7">
      <section><p className="text-sm font-medium text-indigo-600">Account settings</p><h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">Security</h1><p className="mt-2 text-sm text-slate-500">Manage your current authenticated session and account access.</p></section>
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-card sm:p-6"><h2 className="text-lg font-semibold text-slate-900">Password &amp; Authentication</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Your account is protected by the backend’s authentication system. Use your password to sign in and to confirm destructive changes.</p></section>
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-card sm:p-6"><h2 className="text-lg font-semibold text-slate-900">Current session</h2><div className="mt-4 flex items-center gap-3 rounded-lg border border-emerald-100 bg-emerald-50 p-3.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /><div><p className="text-sm font-semibold text-emerald-800">Authenticated</p><p className="mt-0.5 text-sm text-emerald-700">You are signed in as {user?.username}.</p></div></div></section>
      <section className="rounded-xl border border-red-200 bg-white p-5 shadow-card sm:p-6"><div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-lg font-semibold text-red-700">Danger zone</h2><p className="mt-1 max-w-lg text-sm leading-6 text-slate-600">Permanently delete your account. This action cannot be undone.</p></div><Button variant="danger" onClick={() => setIsModalOpen(true)}>Delete account</Button></div></section>
      {isModalOpen && <Modal title="Delete your account?" onClose={closeModal}><form onSubmit={removeAccount} className="space-y-5"><p className="text-sm leading-6 text-slate-600">This permanently removes your account. Confirm with your password to continue.</p>{error && <Alert>{error}</Alert>}<Input label="Password confirmation" id="delete-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} showPasswordToggle /><div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-end"><Button variant="secondary" onClick={closeModal} disabled={isDeleting}>Cancel</Button><Button variant="danger" type="submit" loading={isDeleting}>{isDeleting ? 'Deleting account…' : 'Delete account'}</Button></div></form></Modal>}
    </div>
  )
}
