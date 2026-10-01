import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import Alert from '../components/Alert'
import Button from '../components/Button'
import Input from '../components/Input'
import { useAuth } from '../hooks/useAuth'
import { getErrorMessage } from '../utils/errors'
import AuthLayout from './AuthLayout'

export default function Login() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (isAuthenticated) return <Navigate to="/dashboard" replace />

  const submit = async (event) => {
    event.preventDefault()
    const errors = {}
    if (!form.username.trim()) errors.username = 'Username is required.'
    if (!form.password) errors.password = 'Password is required.'
    setFieldErrors(errors)
    setError('')
    if (Object.keys(errors).length) return

    setIsSubmitting(true)
    try {
      await login(form.username.trim(), form.password)
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true })
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'We could not sign you in. Please check your details.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout heading="Welcome back" subheading="Sign in to manage your AccountFlow profile.">
      <form onSubmit={submit} className="space-y-5" noValidate>
        {location.state?.accountDeleted && <Alert type="success">Your account has been deleted successfully.</Alert>}
        {error && <Alert>{error}</Alert>}
        <Input label="Username" id="username" autoComplete="username" value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} error={fieldErrors.username} />
        <Input label="Password" id="password" type="password" autoComplete="current-password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} error={fieldErrors.password} showPasswordToggle />
        <Button type="submit" loading={isSubmitting} className="w-full">{isSubmitting ? 'Signing in…' : 'Sign in'}</Button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-600">New to AccountFlow? <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">Create an account</Link></p>
    </AuthLayout>
  )
}
