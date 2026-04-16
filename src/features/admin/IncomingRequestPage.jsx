import { useEffect, useMemo, useState } from 'react'
import { adminService } from './admin.service'
import { medicineService } from '../medicine/medicine.service'
import { useAuth } from '../../hooks/useAuth'

export default function IncomingRequestPage() {
  const { user } = useAuth()
  const [requests, setRequests] = useState([])
  const [medicines, setMedicines] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError('')
        const [reqData, medData] = await Promise.all([
          adminService.listTransfers({ limit: 100 }),
          medicineService.list({ limit: 200 }),
        ])
        const filtered = user?.pharmacyCode
          ? reqData.filter((req) => req.toPharmacy === user.pharmacyCode)
          : reqData
        setRequests(filtered)
        setMedicines(medData)
      } catch (err) {
        const message = err?.response?.data?.message || 'Gagal memuat request'
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [user?.pharmacyCode])

  const statusLabel = useMemo(
    () => ({
      pending: 'Menunggu',
      diproses: 'Diproses',
      dikirim: 'Dikirim',
      diterima: 'Diterima',
      ditolak: 'Ditolak',
      dibatalkan: 'Dibatalkan',
    }),
    []
  )

  const statusStyle = (status) => {
    if (status === 'pending') return 'bg-yellow-100 text-yellow-700'
    if (status === 'ditolak' || status === 'dibatalkan') return 'bg-red-100 text-red-600'
    if (status === 'dikirim' || status === 'diproses') return 'bg-blue-100 text-blue-700'
    if (status === 'diterima') return 'bg-green-100 text-green-700'
    return 'bg-lightGrey text-darkGrey'
  }

  const updateStatus = async (id, status) => {
    try {
      setUpdatingId(id)
      setError('')
      const updated = await adminService.updateTransferStatus(id, status)
      setRequests((prev) => prev.map((r) => (r._id === id ? { ...r, ...updated, status } : r)))
    } catch (err) {
      const message = err?.response?.data?.message || 'Gagal memperbarui status'
      setError(message)
    } finally {
      setUpdatingId('')
    }
  }

  const medicineStockMap = useMemo(() => {
    const map = {}
    medicines.forEach((m) => {
      map[String(m._id)] = m.stock
    })
    return map
  }, [medicines])

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary mb-6">Request Masuk dari Apotik Lain</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* TABEL REQUEST */}
        <div className="lg:col-span-2 bg-white p-6 rounded shadow">
          <h2 className="font-bold mb-4">Daftar Request Masuk</h2>

          <table className="w-full text-sm">
            <thead className="bg-lightGrey">
              <tr>
                <th className="text-left p-2">Tanggal</th>
                <th className="text-left p-2">Dari</th>
                <th className="text-left p-2">Obat</th>
                <th className="text-center p-2">Jumlah</th>
                <th className="text-center p-2">Status</th>
                <th className="text-center p-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td className="p-2" colSpan={6}>Memuat...</td></tr>
              ) : requests.length === 0 ? (
                <tr><td className="p-2" colSpan={6}>Belum ada request</td></tr>
              ) : (
                requests.map((req) => {
                  const meds = req.medicines || []
                  const medicineNames = meds
                    .map((m) => m.medicine?.name || m.medicineName || '')
                    .filter(Boolean)
                    .join(', ')
                  const qty = meds.reduce((sum, m) => sum + Number(m.quantity || 0), 0)
                  const date = req.requestDate
                    ? new Date(req.requestDate).toLocaleDateString()
                    : '-'

                  return (
                    <tr key={req._id} className="border-t">
                      <td className="p-2">{date}</td>
                      <td className="p-2">{req.fromPharmacy || '-'}</td>
                      <td className="p-2">{medicineNames || '-'}</td>
                      <td className="p-2 text-center">{qty}</td>
                      <td className="p-2 text-center">
                        <span className={`px-2 py-1 rounded text-xs ${statusStyle(req.status)}`}>
                          {statusLabel[req.status] || req.status}
                        </span>
                      </td>
                      <td className="p-2 text-center space-x-2">
                        {req.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateStatus(req._id, 'diproses')}
                              disabled={!!updatingId}
                              className="bg-green text-white px-2 py-1 rounded text-xs disabled:opacity-50"
                            >
                              Setujui
                            </button>
                            <button
                              onClick={() => updateStatus(req._id, 'ditolak')}
                              disabled={!!updatingId}
                              className="bg-red-500 text-white px-2 py-1 rounded text-xs disabled:opacity-50"
                            >
                              Tolak
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* PANEL STOK */}
        <div className="bg-white p-6 rounded shadow h-fit">
          <h2 className="font-bold mb-4">Stok Saat Ini</h2>

          {loading ? (
            <p className="text-sm text-darkGrey">Memuat stok...</p>
          ) : medicines.length === 0 ? (
            <p className="text-sm text-darkGrey">Belum ada data obat</p>
          ) : (
            <ul className="space-y-3 text-sm">
              {medicines.map((med) => (
                <li key={med._id} className="flex justify-between">
                  <span>{med.name}</span>
                  <span className="font-medium">{medicineStockMap[String(med._id)] ?? '-'}</span>
                </li>
              ))}
            </ul>
          )}

          <hr className="my-4" />

          {error && <p className="text-sm text-red-600">{error}</p>}
          <p className="text-xs text-darkGrey mt-2">Status akan mengikuti pembaruan dari API transfer.</p>
        </div>
      </div>
    </div>
  )
}
