import { useEffect, useState, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { doctorService } from './doctor.service'

export default function PrescriptionDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [prescription, setPrescription] = useState(null)
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

  return (
    <div className="bg-white p-6 rounded shadow">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-primary">Detail Resep</h1>
        <button
          onClick={() => navigate(-1)}
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
              <p className="font-semibold capitalize">{prescription.status || '-'}</p>
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
        </div>
      )}
    </div>
  )
}
