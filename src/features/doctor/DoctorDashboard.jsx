import { Link } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { doctorService } from './doctor.service'

export default function DoctorDashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [stats, setStats] = useState({ patients: 0, prescriptions: 0, medicines: 0 })
  const [recentPrescriptions, setRecentPrescriptions] = useState([])
  const [lowStockMedicines, setLowStockMedicines] = useState([])

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError('')
        const data = await doctorService.getDashboard()
        setStats(data.stats)
        setRecentPrescriptions(data.recentPrescriptions)
        setLowStockMedicines(data.lowStock)
      } catch (err) {
        const message = err?.response?.data?.message || 'Gagal memuat data dashboard'
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const todayCount = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10)
    return recentPrescriptions.filter((r) => (r.prescriptionDate || '').slice(0, 10) === today).length
  }, [recentPrescriptions])

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary mb-6">
        Dashboard Dokter
      </h1>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded shadow">
          <p className="text-sm text-darkGrey">
            Total Pasien
          </p>
          <p className="text-2xl font-bold mt-2">
            {loading ? '...' : stats.patients}
          </p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <p className="text-sm text-darkGrey">
            Total Obat Tersedia
          </p>
          <p className="text-2xl font-bold mt-2">
            {loading ? '...' : stats.medicines}
          </p>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* RESEP TERBARU */}
        <div className="lg:col-span-2 bg-white p-6 rounded shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold">
              Resep Terbaru
            </h2>
            <Link
              to="/doctor/prescription/create"
              className="text-sm text-primary"
            >
              + Buat Resep
            </Link>
          </div>

          <table className="w-full text-sm">
            <thead className="bg-lightGrey">
              <tr>
                <th className="text-left p-2">
                  Pasien
                </th>
                <th className="text-left p-2">
                  Tanggal
                </th>
                <th className="text-center p-2">
                  Jumlah Obat
                </th>
                <th className="text-center p-2">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td className="p-2" colSpan={4}>Memuat...</td></tr>
              ) : recentPrescriptions.length === 0 ? (
                <tr><td className="p-2" colSpan={4}>Belum ada resep</td></tr>
              ) : (
                recentPrescriptions.map((r) => (
                  <tr key={r._id} className="border-t">
                    <td className="p-2">{r.patient?.name || '-'}</td>
                    <td className="p-2">{r.prescriptionDate ? r.prescriptionDate.split('T')[0] : '-'}</td>
                    <td className="p-2 text-center">{r.medicines?.length ?? 0}</td>
                    <td className="p-2 text-center">
                      <Link to={`/doctor/prescription/${r._id}`} className="text-primary text-sm">
                        Lihat Detail
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* NOTIFIKASI STOK */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="font-bold mb-4">
            Stok Hampir Habis
          </h2>

          {loading ? (
            <p className="text-sm text-darkGrey">Memuat...</p>
          ) : lowStockMedicines.length > 0 ? (
            <ul className="space-y-3">
              {lowStockMedicines.map((med, i) => (
                <li
                  key={med._id || i}
                  className="flex justify-between text-sm"
                >
                  <span>{med.name}</span>
                  <span className="text-red-500 font-medium">
                    {med.stock}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-darkGrey">
              Tidak ada stok kritis
            </p>
          )}

          <hr className="my-4" />
        </div>
      </div>

      {error && (
        <p className="mt-4 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
