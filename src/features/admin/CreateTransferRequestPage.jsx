import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminService } from './admin.service'
import { medicineService } from '../medicine/medicine.service'

export default function CreateTransferRequestPage() {
  const [toPharmacy, setToPharmacy] = useState('')
  const [urgency, setUrgency] = useState('sedang')
  const [notes, setNotes] = useState('')
  const [medicines, setMedicines] = useState([])
  const [pharmacies, setPharmacies] = useState([])
  const [items, setItems] = useState([{ medicine: '', quantity: 1, notes: '' }])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError('')
        const [meds, phars] = await Promise.all([
          medicineService.list({ limit: 200 }),
          adminService.listPharmacies(),
        ])
        setMedicines(meds)
        setPharmacies(phars)
      } catch (err) {
        const message = err?.response?.data?.message || 'Gagal memuat data obat'
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const medicineOptions = useMemo(() => medicines.map((m) => ({ value: m._id, label: m.name })), [medicines])
  const pharmacyOptions = useMemo(
    () => pharmacies.map((p) => ({ value: p.code, label: p.code })),
    [pharmacies]
  )

  const handleItemChange = (index, field, value) => {
    setItems((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
      return next
    })
  }

  const addRow = () => {
    setItems((prev) => [...prev, { medicine: '', quantity: 1, notes: '' }])
  }

  const removeRow = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const sanitizedItems = items
      .filter((item) => item.medicine && Number(item.quantity) > 0)
      .map((item) => ({
        medicine: item.medicine,
        quantity: Number(item.quantity),
        notes: item.notes?.trim() || undefined,
      }))

    if (!toPharmacy.trim()) {
      setError('Tujuan apotek wajib diisi')
      return
    }

    if (!sanitizedItems.length) {
      setError('Minimal pilih satu obat dengan jumlah lebih dari 0')
      return
    }

    try {
      setSubmitting(true)
      await adminService.createTransferRequest({
        toPharmacy: toPharmacy.trim(),
        medicines: sanitizedItems,
        notes: notes.trim() || undefined,
        urgency,
      })
      setSuccess('Request berhasil dikirim')
      setTimeout(() => navigate('/admin/incoming-request'), 800)
    } catch (err) {
      const message = err?.response?.data?.message || 'Gagal membuat request'
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-primary">Buat Request Obat</h1>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-sm text-primary hover:underline"
        >
          Kembali
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 text-red-700 px-4 py-3 rounded border border-red-200 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 bg-green-50 text-green-700 px-4 py-3 rounded border border-green-200 text-sm">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded shadow p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Apotek Tujuan</label>
            <select
              className="w-full border rounded px-3 py-2 text-sm"
              value={toPharmacy}
              onChange={(e) => setToPharmacy(e.target.value)}
              disabled={submitting || loading}
            >
              <option value="">Pilih apotek</option>
              {pharmacyOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Urgensi</label>
            <select
              className="w-full border rounded px-3 py-2 text-sm"
              value={urgency}
              onChange={(e) => setUrgency(e.target.value)}
              disabled={submitting}
            >
              <option value="rendah">Rendah</option>
              <option value="sedang">Sedang</option>
              <option value="tinggi">Tinggi</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Catatan (opsional)</label>
          <textarea
            className="w-full border rounded px-3 py-2 text-sm"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={submitting}
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold">Daftar Obat</h2>
            <button
              type="button"
              onClick={addRow}
              className="text-sm text-primary hover:underline"
              disabled={submitting}
            >
              + Tambah Obat
            </button>
          </div>

          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-8 gap-3 bg-lightGrey p-3 rounded">
                <div className="md:col-span-4">
                  <label className="block text-xs text-darkGrey mb-1">Obat</label>
                  <select
                    className="w-full border rounded px-3 py-2 text-sm"
                    value={item.medicine}
                    onChange={(e) => handleItemChange(index, 'medicine', e.target.value)}
                    disabled={loading || submitting}
                  >
                    <option value="">Pilih obat</option>
                    {medicineOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs text-darkGrey mb-1">Jumlah</label>
                  <input
                    type="number"
                    min="1"
                    className="w-full border rounded px-3 py-2 text-sm"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    disabled={submitting}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs text-darkGrey mb-1">Catatan (opsional)</label>
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2 text-sm"
                    value={item.notes}
                    onChange={(e) => handleItemChange(index, 'notes', e.target.value)}
                    disabled={submitting}
                  />
                </div>

                {items.length > 1 && (
                  <div className="md:col-span-8 flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeRow(index)}
                      className="text-xs text-red-600 hover:underline"
                      disabled={submitting}
                    >
                      Hapus
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="bg-primary text-white px-4 py-2 rounded text-sm disabled:opacity-50"
          >
            {submitting ? 'Mengirim...' : 'Kirim Request'}
          </button>
          <p className="text-xs text-darkGrey">Pastikan jumlah dan tujuan apotek sudah benar.</p>
        </div>
      </form>
    </div>
  )
}
