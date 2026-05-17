import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import logoIhc from '../../assets/images/image 1.png'
import { formatPharmacyName } from '../../utils/formatPharmacyName'

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const pharmacyName = formatPharmacyName(user?.pharmacyCode)

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
    {
      name: 'Persetujuan Resep',
      path: '/admin/prescription-approval',
    },
    {
      name: 'Buat Request',
      path: '/admin/request/create',
    },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lightGrey to-white flex font-gotham">
      <aside className="sticky top-0 h-screen w-68 bg-darkBlue01 text-white px-5 py-6 shadow-lg flex flex-col">
        <div className="flex flex-col items-center gap-2 mb-6">
          <img
            src={logoIhc}
            alt="IHC Rumah Sakit Pertamina Balikpapan"
            className="w-32 h-auto"
          />
        </div>

        <div className="mb-8 text-center">
          <h2 className="font-bold text-xl text-center">{`Admin ${pharmacyName}`}</h2>
        </div>

        <nav className="space-y-1 flex-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                  isActive
                    ? 'bg-white text-darkBlue01 font-semibold shadow-sm'
                    : 'text-blue-100 hover:bg-blue-200/10'
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="pt-6 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white py-2 rounded text-sm"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* HEADER */}
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center flex-shrink-0">
          <h1 className="font-semibold text-lg">
            {`Sistem Informasi ${pharmacyName}`}
          </h1>

          <div className="text-right">
            <p className="text-sm text-darkGrey">Admin Panel</p>
            <p className="text-sm font-semibold text-darkBlue02">
              {user?.name ? ` ${user.name}` : 'Admin'}
            </p>
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
