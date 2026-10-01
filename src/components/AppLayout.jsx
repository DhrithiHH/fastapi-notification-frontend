// import Navbar from './Navbar'
// import Sidebar from './Sidebar'

// export default function AppLayout({ children }) {
//   return (
//     <div className="min-h-screen bg-slate-50 lg:flex">
//       <Sidebar />
//       <div className="min-w-0 flex-1">
//         <Navbar />
//         <main className="mx-auto w-full max-w-6xl p-4 sm:p-6 lg:p-8">{children}</main>
//       </div>
//     </div>
//   )
// }



import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <Sidebar />

      <div className="min-w-0 flex-1">
        <Navbar />

        <main className="mx-auto w-full max-w-6xl p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}