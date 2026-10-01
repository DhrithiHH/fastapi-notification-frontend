import { useState } from 'react'

export default function Input({ label, id, error, type = 'text', showPasswordToggle = false, ...props }) {
  const [showPassword, setShowPassword] = useState(false)
  const inputType = showPasswordToggle && showPassword ? 'text' : type
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-slate-700" htmlFor={id}>{label}</label>}
      <div className="relative">
        <input
          id={id}
          type={inputType}
          className={`block w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:ring-2 ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'} ${showPasswordToggle ? 'pr-16' : ''}`}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            className="absolute inset-y-0 right-2 px-2 text-xs font-semibold text-slate-500 hover:text-slate-800 focus:outline-none"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        )}
      </div>
      {error && <p id={`${id}-error`} className="text-sm text-red-600">{error}</p>}
    </div>
  )
}
