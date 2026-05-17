import { useEffect, useMemo, useState } from 'react'
import { doctorService } from './doctor.service'

export default function CreatePrescriptionPage() {
  const [patients, setPatients] = useState([])
  const [medicines, setMedicines] = useState([])
  const [pharmacies, setPharmacies] = useState([])
  const [crossPharmacyStock, setCrossPharmacyStock] = useState([])
  const [crossStockLoading, setCrossStockLoading] = useState(false)
  const [selectedPatientId, setSelectedPatientId] = useState('')
  const [selectedMedicineId, setSelectedMedicineId] = useState('')
  const [medicineDropdownOpen, setMedicineDropdownOpen] = useState(false)
  const [medicineFilter, setMedicineFilter] = useState('')
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
        const [p, m, ph] = await Promise.all([
          doctorService.listPatients(),
          doctorService.listMedicines(),
          doctorService.listPharmacies(),
        ])
        setPatients(p)
        setMedicines(m)
        setPharmacies(ph)
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

  const filteredMedicines = useMemo(() => {
    const keyword = medicineFilter.trim().toLowerCase()
    if (!keyword) return medicines

    return medicines.filter((medicine) => {
      const name = String(medicine.name || '').toLowerCase()
      const code = String(medicine.code || '').toLowerCase()
      const genericName = String(medicine.genericName || '').toLowerCase()
      return (
        name.includes(keyword) ||
        code.includes(keyword) ||
        genericName.includes(keyword)
      )
    })
  }, [medicines, medicineFilter])

  useEffect(() => {
    const loadCrossPharmacyStock = async () => {
      if (!selectedMedicine || pharmacies.length === 0) {
        setCrossPharmacyStock([])
        return
      }

      try {
        setCrossStockLoading(true)
        const rows = await Promise.all(
          pharmacies.map(async (pharmacy) => {
            const meds = await doctorService.listMedicines({
              pharmacyCode: pharmacy.code,
              search: selectedMedicine.name,
            })

            const matchedMedicine = meds.find((m) => m.name === selectedMedicine.name)

            return {
              code: pharmacy.code,
              stock: matchedMedicine ? Number(matchedMedicine.stock) : 0,
              minStock: matchedMedicine ? Number(matchedMedicine.minStock || 0) : 0,
            }
          })
        )

        setCrossPharmacyStock(rows)
      } catch (_err) {
        setCrossPharmacyStock([])
      } finally {
        setCrossStockLoading(false)
      }
    }

    loadCrossPharmacyStock()
  }, [selectedMedicine, pharmacies])

  const getStockBadgeClass = (stock, minStock) => {
    if (stock <= 0) return 'bg-red-100 text-red-700'
    if (minStock > 0 && stock <= minStock) return 'bg-yellow-100 text-yellow-700'
    return 'bg-green-100 text-green-700'
  }

  const getStockLabel = (stock, minStock) => {
    if (stock <= 0) return 'Habis'
    if (minStock > 0 && stock <= minStock) return 'Rendah'
    return 'Aman'
  }

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
    setMedicineFilter('')
    setMedicineDropdownOpen(false)
    setQuantity('')
    setDosageInstructions('')
    setMealTiming('')
    setDuration('')
  }

  const selectedMedicineLabel = selectedMedicine
    ? `${selectedMedicine.name} (${selectedMedicine.stock})`
    : 'Pilih Obat'

  const handleSelectMedicine = (medicine) => {
    setSelectedMedicineId(String(medicine._id))
    setMedicineDropdownOpen(false)
    setMedicineFilter('')
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
              <div
                className="relative md:col-span-2"
                tabIndex={-1}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget)) {
                    setMedicineDropdownOpen(false)
                    setMedicineFilter('')
                  }
                }}
              >
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setMedicineDropdownOpen((prev) => !prev)}
                  className="w-full border rounded-lg px-3 py-2 text-left focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60"
                >
                  {selectedMedicineLabel}
                </button>

                {medicineDropdownOpen && (
                  <div className="absolute z-20 mt-2 w-full rounded-lg border bg-white shadow-lg">
                    <div className="p-2 border-b">
                      <input
                        autoFocus
                        type="text"
                        placeholder="Cari obat di dropdown..."
                        value={medicineFilter}
                        onChange={(e) => setMedicineFilter(e.target.value)}
                        className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                      />
                    </div>

                    <div className="max-h-56 overflow-y-auto py-1">
                      {filteredMedicines.length === 0 ? (
                        <p className="px-3 py-2 text-sm text-darkGrey">Obat tidak ditemukan</p>
                      ) : (
                        filteredMedicines.map((medicine) => (
                          <button
                            key={medicine._id}
                            type="button"
                            onClick={() => handleSelectMedicine(medicine)}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-lightGrey/60"
                          >
                            <span className="font-medium">{medicine.name}</span>
                            <span className="text-darkGrey"> ({medicine.stock})</span>
                            {medicine.code ? (
                              <span className="ml-2 text-xs text-darkGrey">{medicine.code}</span>
                            ) : null}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

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
                <div className="mt-3">
                  <p className="text-sm font-semibold text-darkBlue02">Stok Antar Apotek</p>
                  {crossStockLoading ? (
                    <p className="text-xs text-darkGrey mt-1">Memuat stok APTA/APTB/APTC...</p>
                  ) : crossPharmacyStock.length === 0 ? (
                    <p className="text-xs text-darkGrey mt-1">Data stok antar apotek belum tersedia</p>
                  ) : (
                    <div className="mt-2 overflow-hidden rounded-lg border bg-white">
                      <table className="w-full text-xs">
                        <thead className="bg-lightGrey/60 text-darkGrey">
                          <tr>
                            <th className="text-left px-2 py-1.5">Apotek</th>
                            <th className="text-right px-2 py-1.5">Stok</th>
                            <th className="text-center px-2 py-1.5">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {crossPharmacyStock.map((row) => (
                            <tr key={row.code} className="border-t">
                              <td className="px-2 py-1.5 font-medium">{row.code}</td>
                              <td className="px-2 py-1.5 text-right">{row.stock}</td>
                              <td className="px-2 py-1.5 text-center">
                                <span
                                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${getStockBadgeClass(row.stock, row.minStock)}`}
                                >
                                  {getStockLabel(row.stock, row.minStock)}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
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
