import { useEffect, useMemo, useState } from 'react'
import { adminService } from './admin.service'

export default function PrescriptionApprovalPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [prescriptions, setPrescriptions] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [selectedPrescription, setSelectedPrescription] = useState(null)

  const loadList = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await adminService.listPrescriptions({ status: 'pending', limit: 100 })
      setPrescriptions(data)
      if (!selectedId && data[0]?._id) {
        setSelectedId(String(data[0]._id))
      }
    } catch (err) {
      const message = err?.response?.data?.message || 'Gagal memuat daftar resep'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const loadDetail = async () => {
      if (!selectedId) {
        setSelectedPrescription(null)
        return
      }

      try {
        setError('')
        const detail = await adminService.getPrescription(selectedId)
        setSelectedPrescription(detail)
      } catch (err) {
        const message = err?.response?.data?.message || 'Gagal memuat detail resep'
        setError(message)
      }
    }

    loadDetail()
  }, [selectedId])

  const totalItems = useMemo(
    () =>
      selectedPrescription?.medicines?.reduce(
        (sum, item) => sum + (Number(item.quantity) || 0),
        0
      ) ?? 0,
    [selectedPrescription]
  )

  const formatDate = (value) => {
    if (!value) return '-'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value
    return date.toLocaleDateString('id-ID')
  }

  const handleAction = async (status) => {
    if (!selectedId) return

    try {
      setSaving(true)
      setError('')
      await adminService.updatePrescriptionStatus(selectedId, status)
      await loadList()
      const updated = await adminService.getPrescription(selectedId)
      setSelectedPrescription(updated)
    } catch (err) {
      const message = err?.response?.data?.message || 'Gagal memperbarui status resep'
      setError(message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-darkGrey">Admin Apotik</p>
          <h1 className="text-2xl font-bold text-primary">Persetujuan Resep</h1>
        </div>
        <p className="text-sm text-darkGrey">Setujui atau tolak resep dari dokter</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded shadow xl:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold">Resep Menunggu Persetujuan</h2>
            <span className="text-xs text-darkGrey">{prescriptions.length} data</span>
          </div>

          {loading ? (
            <p className="text-sm text-darkGrey">Memuat...</p>
          ) : prescriptions.length === 0 ? (
            <p className="text-sm text-darkGrey">Tidak ada resep pending</p>
          ) : (
            <div className="space-y-2 max-h-[540px] overflow-y-auto pr-1">
              {prescriptions.map((item) => {
                const active = String(item._id) === String(selectedId)
                return (
                  <button
                    key={item._id}
                    type="button"
                    onClick={() => setSelectedId(String(item._id))}
                    className={`w-full text-left border rounded-lg px-3 py-3 transition ${
                      active ? 'border-primary bg-primary/5' : 'border-gray-200 hover:bg-lightGrey/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold">{item.patient?.name || '-'}</p>
                        <p className="text-xs text-darkGrey">{item.prescriptionNumber || '-'}</p>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 capitalize">
                        {item.status || 'pending'}
                      </span>
                    </div>
                    <p className="text-xs text-darkGrey mt-2">
                      {formatDate(item.prescriptionDate)} • {item.medicines?.length || 0} obat
                    </p>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded shadow xl:col-span-2">
          {!selectedPrescription ? (
            <p className="text-sm text-darkGrey">Pilih resep untuk melihat detail</p>
          ) : (
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-primary">Detail Resep</h2>
                  <p className="text-sm text-darkGrey">{selectedPrescription.prescriptionNumber}</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold capitalize">
                  {selectedPrescription.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-darkGrey">Pasien</p>
                  <p className="font-semibold">{selectedPrescription.patient?.name || '-'}</p>
                </div>
                <div>
                  <p className="text-darkGrey">Dokter</p>
                  <p className="font-semibold">{selectedPrescription.doctor?.name || '-'}</p>
                </div>
                <div>
                  <p className="text-darkGrey">Tanggal</p>
                  <p className="font-semibold">{formatDate(selectedPrescription.prescriptionDate)}</p>
                </div>
                <div>
                  <p className="text-darkGrey">Total Item</p>
                  <p className="font-semibold">{totalItems} obat</p>
                </div>
              </div>

              {selectedPrescription.diagnosis && (
                <div>
                  <p className="text-darkGrey text-sm">Diagnosa</p>
                  <p className="font-semibold">{selectedPrescription.diagnosis}</p>
                </div>
              )}

              {selectedPrescription.notes && (
                <div>
                  <p className="text-darkGrey text-sm">Catatan</p>
                  <p className="text-sm">{selectedPrescription.notes}</p>
                </div>
              )}

              <div>
                <h3 className="font-semibold mb-3">Rincian Obat</h3>
                <div className="overflow-hidden rounded-lg border">
                  <table className="w-full text-sm">
                    <thead className="bg-lightGrey">
                      <tr>
                        <th className="text-left p-2">Obat</th>
                        <th className="text-center p-2">Jumlah</th>
                        <th className="text-left p-2">Aturan Pakai</th>
                        <th className="text-left p-2">Durasi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedPrescription.medicines?.map((item, idx) => (
                        <tr key={idx} className="border-t">
                          <td className="p-2">{item.medicine?.name || item.name || '-'}</td>
                          <td className="p-2 text-center">{item.quantity}</td>
                          <td className="p-2">{item.dosageInstructions || '-'}</td>
                          <td className="p-2">{item.duration || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 max-w-md">
                <button
                  type="button"
                  onClick={() => handleAction('disiapkan')}
                  disabled={saving || selectedPrescription.status !== 'pending'}
                  style={{ backgroundColor: '#16a34a', borderColor: '#16a34a', color: '#ffffff' }}
                  className="inline-flex items-center justify-center rounded-lg border px-4 py-2 text-sm font-semibold shadow-sm transition hover:brightness-95 disabled:cursor-not-allowed disabled:border-gray-300 disabled:bg-gray-200 disabled:text-gray-600"
                >
                  Setujui Resep
                </button>
                <button
                  type="button"
                  onClick={() => handleAction('dibatalkan')}
                  disabled={saving || selectedPrescription.status !== 'pending'}
                  className="inline-flex items-center justify-center rounded-lg border border-red-500 bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-600 disabled:cursor-not-allowed disabled:border-gray-300 disabled:bg-gray-200 disabled:text-gray-600"
                >
                  Tolak Resep
                </button>
              </div>
            </div>
          )}

          {error && <p className="text-sm text-red-600 mt-4">{error}</p>}
        </div>
      </div>
    </div>
  )
}