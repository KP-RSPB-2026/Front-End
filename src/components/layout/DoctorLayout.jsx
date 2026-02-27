import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import logoIhc from '../../assets/images/image 1.png'

export default function DoctorLayout() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const navItems = [
    { to: '/doctor/dashboard', label: 'Dashboard' },
    { to: '/doctor/prescription/create', label: 'Buat Resep' },
    // { to: '/doctor/patient/add', label: 'Tambah Pasien' },
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

        <div className="mb-8">
          <h2 className="font-bold text-xl">Apotik A</h2>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                  isActive
                    ? 'bg-white text-darkBlue01 font-semibold shadow-sm'
                    : 'text-blue-100 hover:bg-blue-200/10'
                }`
              }
            >
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white py-2 rounded text-sm"
          >
            Logout
          </button>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="bg-white shadow px-8 py-6 flex justify-between items-center border-l border-lightGrey">
          <h1 className="font-semibold text-lg text-darkBlue02">Sistem Informasi Apotik</h1>
          <span className="text-sm text-darkGrey">Doctor Panel</span>
        </header>

        <div className="flex-1 px-8 py-6 bg-white/80 backdrop-blur-sm border border-lightGrey/60 border-l-0 rounded-none rounded-tr-2xl rounded-bl-none rounded-br-2xl shadow-sm">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
