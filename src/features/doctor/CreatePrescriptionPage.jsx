import { useEffect, useMemo, useState } from 'react'
import { doctorService } from './doctor.service'

export default function CreatePrescriptionPage() {
  const [patients, setPatients] = useState([])
  const [medicines, setMedicines] = useState([])
  const [selectedPatientId, setSelectedPatientId] = useState('')
  const [selectedMedicineId, setSelectedMedicineId] = useState('')
  const [quantity, setQuantity] = useState('')
  const [dosageInstructions, setDosageInstructions] = useState('')
  const [mealTiming, setMealTiming] = useState('')
  const [duration, setDuration] = useState('')
  const [items, setItems] = useState([])
  const [diagnosis, setDiagnosis] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError('')
        const [p, m] = await Promise.all([
          doctorService.listPatients(),
          doctorService.listMedicines(),
        ])
        setPatients(p)
        setMedicines(m)
      } catch (err) {
        const message = err?.response?.data?.message || 'Gagal memuat data pasien/obat'
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const selectedMedicine = useMemo(
    () => medicines.find((m) => String(m._id) === String(selectedMedicineId)),
    [medicines, selectedMedicineId]
  )

  const addMedicine = () => {
    setSuccess('')
    setError('')

    if (!selectedMedicine) {
      setError('Pilih obat terlebih dahulu')
      return
    }
    if (!quantity || Number(quantity) <= 0) {
      setError('Jumlah obat harus lebih dari 0')
      return
    }
    if (!dosageInstructions) {
      setError('Instruksi dosis wajib diisi')
      return
    }
    if (!mealTiming) {
      setError('Pilih waktu minum obat')
      return
    }

    const qtyNumber = Number(quantity)

    setItems((prev) => [
      ...prev,
      {
        medicineId: selectedMedicine._id,
        name: selectedMedicine.name,
        unit: selectedMedicine.unit,
        stock: selectedMedicine.stock,
        quantity: qtyNumber,
        dosageInstructions,
        mealTiming,
        duration: duration || '',
      },
    ])

    setSelectedMedicineId('')
    setQuantity('')
    setDosageInstructions('')
    setMealTiming('')
    setDuration('')
  }

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const submitPrescription = async () => {
    setSuccess('')
    setError('')

    if (!selectedPatientId) {
      setError('Pasien wajib dipilih')
      return
    }
    if (items.length === 0) {
      setError('Tambahkan minimal 1 obat')
      return
    }

    const payload = {
      patient: Number(selectedPatientId),
      diagnosis: diagnosis || undefined,
      notes: notes || undefined,
      medicines: items.map((item) => ({
        medicine: Number(item.medicineId),
        quantity: Number(item.quantity),
        dosageInstructions: item.mealTiming
          ? `${item.dosageInstructions} (${item.mealTiming})`
          : item.dosageInstructions,
        duration: item.duration || undefined,
      })),
    }

    try {
      setSubmitting(true)
      await doctorService.createPrescription(payload)
      setSuccess('Resep berhasil dibuat')
      setItems([])
      setSelectedPatientId('')
      setDiagnosis('')
      setNotes('')
    } catch (err) {
      const message = err?.response?.data?.message || 'Gagal membuat resep'
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-darkGrey">Modul Dokter</p>
          <h1 className="text-2xl font-bold text-primary">Buat Resep</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-gray-100 p-6 rounded-2xl shadow-sm space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-sm mb-1">Pasien</label>
              <select
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40"
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                disabled={loading}
              >
                <option value="">-- Pilih Pasien --</option>
                {patients.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-sm mb-1">Diagnosis (opsional)</label>
              <input
                type="text"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="Misal: Infeksi saluran pernapasan"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-sm mb-1">Catatan (opsional)</label>
            <textarea
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Instruksi tambahan untuk apotik"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Tambah Obat</h2>
              <span className="text-xs text-darkGrey">Pastikan stok mencukupi</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40"
                value={selectedMedicineId}
                onChange={(e) => setSelectedMedicineId(e.target.value)}
                disabled={loading}
              >
                <option value="">Pilih Obat</option>
                {medicines.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.name} ({m.stock})
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Jumlah"
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="1"
              />

              <select
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40"
                value={dosageInstructions}
                onChange={(e) => setDosageInstructions(e.target.value)}
              >
                <option value="">Instruksi dosis (wajib)</option>
                <option value="1 x sehari">1 x sehari</option>
                <option value="2 x sehari">2 x sehari</option>
                <option value="3 x sehari">3 x sehari</option>
              </select>

              <select
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40"
                value={mealTiming}
                onChange={(e) => setMealTiming(e.target.value)}
              >
                <option value="">Waktu minum</option>
                <option value="sebelum makan">Sebelum makan</option>
                <option value="sesudah makan">Sesudah makan</option>
              </select>

              <input
                type="text"
                placeholder="Durasi (opsional, mis: 5 hari)"
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>

            {selectedMedicine && (
              <div className="rounded-xl border bg-lightGrey/60 p-4 text-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-primary">Info Obat</h3>
                  <span className="text-xs text-darkGrey">Stok: {selectedMedicine.stock}</span>
                </div>
                <p className="text-sm text-darkGrey">Kategori: {selectedMedicine.category || '-'}</p>
                <p className="text-sm text-darkGrey">Dosis: {selectedMedicine.dosage || '-'}</p>
                <p className="text-sm text-darkGrey">Harga: Rp {selectedMedicine.price}</p>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="button"
                onClick={addMedicine}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-lg bg-primary text-white px-4 py-2 text-sm font-semibold shadow hover:bg-darkBlue02 focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60"
              >
                + Tambah ke Resep
              </button>
            </div>
          </div>

          {items.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold mb-3">Daftar Obat</h3>
              <div className="overflow-hidden rounded-xl border">
                <table className="w-full text-sm">
                  <thead className="bg-lightGrey/60 text-darkGrey">
                    <tr>
                      <th className="text-left p-2">Obat</th>
                      <th className="text-left p-2">Jumlah</th>
                      <th className="text-left p-2">Waktu Minum</th>
                      <th className="text-left p-2">Instruksi</th>
                      <th className="text-left p-2">Durasi</th>
                      <th className="p-2 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="p-2">{item.name}</td>
                        <td className="p-2">{item.quantity} {item.unit}</td>
                        <td className="p-2">{item.mealTiming || '-'}</td>
                        <td className="p-2">{item.dosageInstructions}</td>
                        <td className="p-2">{item.duration || '-'}</td>
                        <td className="p-2 text-right">
                          <button
                            type="button"
                            onClick={() => removeItem(idx)}
                            className="text-red-500 hover:underline"
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={submitPrescription}
              disabled={submitting}
              className="rounded-lg bg-primary text-white px-5 py-2 text-sm font-semibold shadow hover:bg-darkBlue02 focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60"
            >
              {submitting ? 'Menyimpan...' : 'Simpan Resep'}
            </button>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}
        </div>

        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm space-y-4">
          <div>
            <h3 className="font-semibold text-sm">Tips</h3>
            <p className="text-sm text-darkGrey mt-1">Periksa alergi pasien sebelum menambahkan obat.</p>
          </div>
          <div className="rounded-xl border bg-lightGrey/40 p-3 text-sm text-darkGrey">
            <p className="font-semibold text-darkBlue02">Catatan</p>
            <ul className="list-disc list-inside space-y-1 mt-1">
              <li>Jumlah obat tidak boleh melebihi stok tersedia.</li>
              <li>Isi instruksi dosis dengan jelas.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
