import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import logoIhc from '../../assets/images/image 1.png'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    email: '',
    password: '',
    role: 'doctor',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    login({ role: form.role })
    navigate(form.role === 'admin' ? '/admin/dashboard' : '/doctor/dashboard')
  }

  return (
    <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-lightGrey/60 p-10">
      <div className="flex items-center gap-4 mb-6">
        <img src={logoIhc} alt="IHC" className="w-14 h-auto" />
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-darkGrey">Login</p>
          <h1 className="text-2xl font-bold text-primary leading-tight">Sistem Informasi Apotik</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-darkBlue01" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="nama@ihc.co.id"
            className="w-full rounded-lg border border-lightGrey bg-white px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-darkBlue01" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Masukkan password"
            className="w-full rounded-lg border border-lightGrey bg-white px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            required
          />
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium text-darkBlue01">Masuk sebagai</p>
          <div className="grid grid-cols-2 gap-3">
            <label className={`flex items-center justify-between rounded-lg border px-4 py-3 text-sm cursor-pointer transition ${form.role === 'doctor' ? 'border-primary bg-primary/5' : 'border-lightGrey hover:border-primary/60'}`}>
              <span className="font-medium text-darkBlue02">Dokter</span>
              <input
                type="radio"
                name="role"
                value="doctor"
                checked={form.role === 'doctor'}
                onChange={handleChange}
                className="text-primary focus:ring-primary"
              />
            </label>

            <label className={`flex items-center justify-between rounded-lg border px-4 py-3 text-sm cursor-pointer transition ${form.role === 'admin' ? 'border-primary bg-primary/5' : 'border-lightGrey hover:border-primary/60'}`}>
              <span className="font-medium text-darkBlue02">Admin</span>
              <input
                type="radio"
                name="role"
                value="admin"
                checked={form.role === 'admin'}
                onChange={handleChange}
                className="text-primary focus:ring-primary"
              />
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-primary text-white py-3 text-sm font-semibold shadow-md transition hover:bg-darkBlue02 focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          Masuk
        </button>

        <p className="text-xs text-darkGrey text-center">Gunakan kredensial internal. Saat ini autentikasi masih disimulasikan.</p>
      </form>
    </div>
  )
}
