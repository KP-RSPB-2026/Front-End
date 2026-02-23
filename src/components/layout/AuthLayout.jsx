import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-lightGrey via-white to-lightGrey flex items-center justify-center font-gotham px-4 py-12">
      <Outlet />
    </div>
  )
}
