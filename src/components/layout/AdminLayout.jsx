import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function AdminLayout() {
  const { logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/admin/dashboard',
    },
    {
      name: 'Manajemen Obat',
      path: '/admin/medicine',
    },
    {
      name: 'Manajemen Stok',
      path: '/admin/stock',
    },
    {
      name: 'Request Obat',
      path: '/admin/incoming-request',
    },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex bg-lightGrey">
      {/* SIDEBAR */}
      <aside className="w-64 bg-darkBlue02 text-white flex flex-col">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-lg font-bold">
            Admin Apotik
          </h2>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-3 py-2 rounded text-sm ${
                location.pathname === item.path
                  ? 'bg-white text-darkBlue02 font-medium'
                  : 'hover:bg-white/10'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white py-2 rounded text-sm"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col">
        {/* HEADER */}
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <h1 className="font-semibold text-lg">
            Sistem Informasi Apotik
          </h1>

          <span className="text-sm text-darkGrey">
            Admin Panel
          </span>
        </header>

        {/* CONTENT */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
