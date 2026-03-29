import { Link } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { adminService } from './admin.service'

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [stats, setStats] = useState({ medicines: 0, requests: 0, prescriptions: 0 })
  const [lowStockMedicines, setLowStockMedicines] = useState([])
  const [recentPrescriptions, setRecentPrescriptions] = useState([])
  const [recentRequests, setRecentRequests] = useState([])

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError('')
        const data = await adminService.getDashboard()
        setStats(data.stats)
        setLowStockMedicines(data.lowStock)
        setRecentPrescriptions(data.prescriptions)
        setRecentRequests(data.transfers)
      } catch (err) {
        const message = err?.response?.data?.message || 'Gagal memuat dashboard'
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const prescriptionsToday = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10)
    return recentPrescriptions.filter((r) => (r.prescriptionDate || '').slice(0, 10) === today)
      .length
  }, [recentPrescriptions])

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary mb-6">Dashboard Admin Apotik</h1>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded shadow">
          <p className="text-sm text-darkGrey">Total Obat</p>
          <p className="text-2xl font-bold mt-2">{loading ? '...' : stats.medicines}</p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <p className="text-sm text-darkGrey">Request Aktif</p>
          <p className="text-2xl font-bold mt-2">{loading ? '...' : stats.requests}</p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <p className="text-sm text-darkGrey">Resep Hari Ini</p>
          <p className="text-2xl font-bold mt-2">{loading ? '...' : prescriptionsToday}</p>
        </div>
      </div>

      {/* GRID UTAMA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* REQUEST TERBARU */}
        <div className="lg:col-span-2 bg-white p-6 rounded shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold">Request Obat Terbaru</h2>
            <div className="flex items-center gap-3 text-sm">
              <Link to="/admin/request/create" className="text-primary">Buat Request</Link>
              <Link to="/admin/stock" className="text-primary">Kelola Stok</Link>
            </div>
          </div>

          <table className="w-full text-sm">
            <thead className="bg-lightGrey">
              <tr>
                <th className="text-left p-2">Obat</th>
                <th className="text-left p-2">Dari</th>
                <th className="text-center p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td className="p-2" colSpan={3}>Memuat...</td></tr>
              ) : recentRequests.length === 0 ? (
                <tr><td className="p-2" colSpan={3}>Belum ada request</td></tr>
              ) : (
                recentRequests.map((r) => (
                  <tr key={r._id} className="border-t">
                    <td className="p-2">
                      {r.medicines?.map((m) => m.medicine?.name).filter(Boolean).join(', ') || '-'}
                    </td>
                    <td className="p-2">{r.fromPharmacy}</td>
                    <td className="p-2 text-center">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          r.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* STOK KRITIS */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="font-bold mb-4">Stok Hampir Habis</h2>

          {loading ? (
            <p className="text-sm text-darkGrey">Memuat...</p>
          ) : lowStockMedicines.length > 0 ? (
            <ul className="space-y-3">
              {lowStockMedicines.map((med, i) => (
                <li key={i} className="flex justify-between text-sm">
                  <span>{med.name}</span>
                  <span className="text-red-500 font-medium">{med.stock}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-darkGrey">Semua stok aman</p>
          )}
        </div>
      </div>

      {/* RESEP MASUK */}
      <div className="bg-white p-6 rounded shadow mt-6">
        <h2 className="font-bold mb-4">Resep Masuk</h2>

        <table className="w-full text-sm">
          <thead className="bg-lightGrey">
            <tr>
              <th className="text-left p-2">Pasien</th>
              <th className="text-center p-2">Jumlah Obat</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="p-2" colSpan={2}>Memuat...</td></tr>
            ) : recentPrescriptions.length === 0 ? (
              <tr><td className="p-2" colSpan={2}>Belum ada resep</td></tr>
            ) : (
              recentPrescriptions.map((r) => (
                <tr key={r._id} className="border-t">
                  <td className="p-2">{r.patient?.name || '-'}</td>
                  <td className="p-2 text-center">{r.medicines?.length ?? 0}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
    </div>
  )
}
