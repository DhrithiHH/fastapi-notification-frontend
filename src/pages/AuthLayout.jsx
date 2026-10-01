import Brand from '../components/Brand'

export default function AuthLayout({ children, heading, subheading }) {
  return (
    <main className="grid min-h-screen bg-slate-50 p-4 sm:p-8 lg:grid-cols-2 lg:p-0">
      <section className="hidden bg-slate-950 p-12 text-white lg:flex lg:flex-col">
        <Brand to="/login" />
        <div className="my-auto max-w-md">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-300">Account management, thoughtfully built</p>
          <h1 className="text-4xl font-semibold leading-tight">A clearer home for your account.</h1>
          <p className="mt-5 text-base leading-7 text-slate-300">Manage your profile securely while lifecycle emails are processed asynchronously in the background.</p>
        </div>
        <p className="text-sm text-slate-400">AccountFlow · Secure account management</p>
      </section>
      <section className="flex items-center justify-center">
        <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-card sm:p-8">
          <div className="mb-8 lg:hidden"><Brand to="/login" /></div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">{heading}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">{subheading}</p>
          <div className="mt-7">{children}</div>
        </div>
      </section>
    </main>
  )
}
