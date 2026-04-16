import { useEffect, useState, useMemo } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { doctorService } from './doctor.service'
import { adminService } from '../admin/admin.service'
import { useAuth } from '../../hooks/useAuth'

export default function PrescriptionDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const [prescription, setPrescription] = useState(null)
  const [adminReason, setAdminReason] = useState('')
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError('')
        const data = await doctorService.getPrescription(id)
        setPrescription(data)
      } catch (err) {
        const message = err?.response?.data?.message || 'Gagal memuat detail resep'
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [id])

  const totalItems = useMemo(() => prescription?.medicines?.reduce((sum, m) => sum + (Number(m.quantity) || 0), 0) ?? 0, [prescription])

  const formatDate = (value) => {
    if (!value) return '-'
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) return value
    return d.toLocaleDateString()
  }

  const statusLabel = (value) => {
    const labels = {
      pending: 'Menunggu',
      disiapkan: 'Diproses',
      selesai: 'Diproses',
      dibatalkan: 'Ditolak',
    }
    return labels[value] || value || '-'
  }

  const updatePrescriptionStatus = async (nextStatus) => {
    try {
      setUpdatingStatus(true)
      setError('')

      const trimmedReason = adminReason.trim()
      if (nextStatus === 'dibatalkan' && !trimmedReason) {
        setError('Alasan penolakan wajib diisi')
        return
      }

      const updated = await adminService.updatePrescriptionStatus(id, {
        status: nextStatus,
        reason: trimmedReason,
      })

      setPrescription(updated)
      if (trimmedReason) setAdminReason('')
    } catch (err) {
      const message = err?.response?.data?.message || 'Gagal memperbarui status resep'
      setError(message)
    } finally {
      setUpdatingStatus(false)
    }
  }

  const isAdmin = user?.role === 'admin_apotik'
  const canTakeAction = isAdmin && prescription?.status === 'pending'

  return (
    <div className="bg-white p-6 rounded shadow">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-primary">Detail Resep</h1>
        <button
          onClick={() => {
            if (location.pathname.startsWith('/admin')) {
              navigate('/admin/dashboard')
              return
            }
            navigate('/doctor/dashboard')
          }}
          className="text-sm text-primary"
        >
          &larr; Kembali
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-darkGrey">Memuat detail...</p>
      ) : error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : !prescription ? (
        <p className="text-sm text-darkGrey">Data tidak ditemukan</p>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-darkGrey">Pasien</p>
              <p className="font-semibold">{prescription.patient?.name || '-'}</p>
            </div>
            <div>
              <p className="text-darkGrey">Tanggal</p>
              <p className="font-semibold">{formatDate(prescription.prescriptionDate)}</p>
            </div>
            <div>
              <p className="text-darkGrey">Total Item</p>
              <p className="font-semibold">{totalItems} obat</p>
            </div>
            <div>
              <p className="text-darkGrey">Status</p>
              <p className="font-semibold">{statusLabel(prescription.status)}</p>
            </div>
          </div>

          {prescription.diagnosis && (
            <div>
              <p className="text-darkGrey text-sm">Diagnosa</p>
              <p className="text-sm font-semibold">{prescription.diagnosis}</p>
            </div>
          )}

          {prescription.notes && (
            <div>
              <p className="text-darkGrey text-sm">Catatan</p>
              <p className="text-sm">{prescription.notes}</p>
            </div>
          )}

          <div>
            <h2 className="font-semibold mb-3">Rincian Obat</h2>
            <table className="w-full text-sm">
              <thead className="bg-lightGrey">
                <tr>
                  <th className="text-left p-2">Obat</th>
                  <th className="text-center p-2">Jumlah</th>
                  <th className="text-left p-2">Aturan Pakai</th>
                  <th className="text-left p-2">Waktu Minum</th>
                  <th className="text-left p-2">Durasi</th>
                </tr>
              </thead>
              <tbody>
                {prescription.medicines?.map((item, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="p-2">{item.medicine?.name || item.name || '-'}</td>
                    <td className="p-2 text-center">{item.quantity}</td>
                    <td className="p-2">{item.dosageInstructions || '-'}</td>
                    <td className="p-2">{item.mealTiming || '-'}</td>
                    <td className="p-2">{item.duration || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {canTakeAction && (
            <div className="bg-lightGrey/40 border rounded p-4 space-y-3">
              <h2 className="font-semibold">Aksi Admin Apotik</h2>
              <textarea
                value={adminReason}
                onChange={(e) => setAdminReason(e.target.value)}
                placeholder="Alasan (wajib jika ditolak, opsional jika disetujui)"
                className="w-full border rounded px-3 py-2 text-sm"
                rows={3}
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="bg-green text-white px-3 py-2 rounded text-sm disabled:opacity-50"
                  onClick={() => updatePrescriptionStatus('selesai')}
                  disabled={updatingStatus}
                >
                  Setujui Resep
                </button>
                <button
                  type="button"
                  className="bg-red-500 text-white px-3 py-2 rounded text-sm disabled:opacity-50"
                  onClick={() => updatePrescriptionStatus('dibatalkan')}
                  disabled={updatingStatus}
                >
                  Tolak Resep
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
