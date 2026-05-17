import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { doctorService } from './doctor.service'

export default function PrescriptionStatusPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [prescriptions, setPrescriptions] = useState([])

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError('')
        const data = await doctorService.listPrescriptions({
          status: statusFilter === 'all' ? undefined : statusFilter,
          limit: 100,
        })
        setPrescriptions(data)
      } catch (err) {
        const message = err?.response?.data?.message || 'Gagal memuat status resep'
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [statusFilter])

  const statusOptions = [
    { value: 'all', label: 'Semua' },
    { value: 'pending', label: 'Pending' },
    { value: 'disiapkan', label: 'Disetujui' },
    { value: 'selesai', label: 'Selesai' },
    { value: 'dibatalkan', label: 'Ditolak' },
  ]

  const statusBadgeClass = (status) => {
    if (status === 'pending') return 'bg-yellow-100 text-yellow-700'
    if (status === 'disiapkan') return 'bg-blue-100 text-blue-700'
    if (status === 'selesai') return 'bg-green-100 text-green-700'
    if (status === 'dibatalkan') return 'bg-red-100 text-red-700'
    return 'bg-gray-100 text-gray-700'
  }

  const statusLabel = (status) => {
    if (status === 'pending') return 'Pending'
    if (status === 'disiapkan') return 'Disetujui'
    if (status === 'selesai') return 'Selesai'
    if (status === 'dibatalkan') return 'Ditolak'
    return status || '-'
  }

  const sortedPrescriptions = useMemo(
    () => prescriptions,
    [prescriptions]
  )

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-darkGrey">Modul Dokter</p>
          <h1 className="text-2xl font-bold text-primary">Status Resep</h1>
        </div>
        <select
          className="border rounded px-3 py-2 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-lightGrey/60 text-darkGrey">
            <tr>
              <th className="text-left p-3">Pasien</th>
              <th className="text-left p-3">Tanggal</th>
              <th className="text-center p-3">Jumlah Obat</th>
              <th className="text-center p-3">Status</th>
              <th className="text-center p-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="p-3" colSpan={5}>Memuat...</td></tr>
            ) : sortedPrescriptions.length === 0 ? (
              <tr><td className="p-3" colSpan={5}>Belum ada resep</td></tr>
            ) : (
              sortedPrescriptions.map((item) => (
                <tr key={item._id} className="border-t">
                  <td className="p-3 font-medium">{item.patient?.name || '-'}</td>
                  <td className="p-3">{item.prescriptionDate ? new Date(item.prescriptionDate).toLocaleDateString('id-ID') : '-'}</td>
                  <td className="p-3 text-center">{item.medicines?.length ?? 0}</td>
                  <td className="p-3 text-center">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeClass(item.status)}`}>
                      {statusLabel(item.status)}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <Link to={`/doctor/prescription/${item._id}`} className="text-primary hover:underline">
                      Lihat Detail
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}