import { useState } from 'react'
import { Link } from 'react-router-dom'
import Alert from '../components/Alert'
import Button from '../components/Button'
import Input from '../components/Input'
import { registerUser } from '../api/userApi'
import { getErrorMessage } from '../utils/errors'
import AuthLayout from './AuthLayout'

const EMPTY_FORM = { username: '', email: '', password: '', confirmPassword: '' }

export default function Register() {
  const [form, setForm] = useState(EMPTY_FORM)
  const [fieldErrors, setFieldErrors] = useState({})
  const [error, setError] = useState('')
  const [created, setCreated] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    const errors = {}
    if (!form.username.trim()) errors.username = 'Username is required.'
    if (!form.email.trim()) errors.email = 'Email is required.'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Enter a valid email address.'
    if (form.password.length < 8) errors.password = 'Use at least 8 characters.'
    if (form.password !== form.confirmPassword) errors.confirmPassword = 'Passwords do not match.'
    setFieldErrors(errors)
    setError('')
    if (Object.keys(errors).length) return

    setIsSubmitting(true)
    try {
      await registerUser({ username: form.username.trim(), email: form.email.trim(), password: form.password })
      setCreated(true)
      setForm(EMPTY_FORM)
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'We could not create your account. Please try again.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout heading="Create your account" subheading="Start managing your account in one focused place.">
      {created ? (
        <div className="space-y-5">
          <Alert type="success"><p className="font-semibold">Account created successfully.</p><p className="mt-1">Your account has been created and its lifecycle email has been queued for processing. You can now sign in.</p></Alert>
          <Link to="/login"><Button className="w-full">Go to sign in</Button></Link>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4" noValidate>
          {error && <Alert>{error}</Alert>}
          <Input label="Username" id="register-username" autoComplete="username" value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} error={fieldErrors.username} />
          <Input label="Email address" id="email" type="email" autoComplete="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} error={fieldErrors.email} />
          <Input label="Password" id="register-password" type="password" autoComplete="new-password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} error={fieldErrors.password} showPasswordToggle />
          <Input label="Confirm password" id="confirm-password" type="password" autoComplete="new-password" value={form.confirmPassword} onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })} error={fieldErrors.confirmPassword} showPasswordToggle />
          <Button type="submit" loading={isSubmitting} className="mt-2 w-full">{isSubmitting ? 'Creating account…' : 'Create account'}</Button>
        </form>
      )}
      {!created && <p className="mt-6 text-center text-sm text-slate-600">Already have an account? <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">Sign in</Link></p>}
    </AuthLayout>
  )
}
