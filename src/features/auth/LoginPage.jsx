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
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const data = await login({ email: form.email, password: form.password })
      const role = data?.role
      if (role === 'admin_apotik') {
        navigate('/admin/dashboard')
      } else {
        navigate('/doctor/dashboard')
      }
    } catch (err) {
      const message = err?.response?.data?.message || 'Login gagal. Periksa email/password.'
      setError(message)
    } finally {
      setLoading(false)
    }
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

        {error && <p className="text-sm text-red-600 text-center">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-primary text-white py-3 text-sm font-semibold shadow-md transition hover:bg-darkBlue02 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Memproses...' : 'Masuk'}
        </button>

        <p className="text-xs text-darkGrey text-center">Gunakan kredensial internal.</p>
      </form>
    </div>
  )
}
