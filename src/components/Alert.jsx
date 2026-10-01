export default function Alert({ children, type = 'error' }) {
  const styles = type === 'success'
    ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
    : type === 'info'
      ? 'border-blue-200 bg-blue-50 text-blue-800'
      : 'border-red-200 bg-red-50 text-red-800'
  return <div className={`rounded-lg border px-3.5 py-3 text-sm ${styles}`} role={type === 'error' ? 'alert' : 'status'}>{children}</div>
}
