import { useState } from 'react'
import Modal from '../../components/common/Modal'
import { useAuth } from '../../hooks/useAuth'

const APOTIK_DOKTER = 'Apotik A'

const initialPatients = [
  { id: 1, name: 'Budi Santoso', age: 35 },
  { id: 2, name: 'Siti Aminah', age: 29 },
]

const medicines = [
  {
    id: 1,
    name: 'Paracetamol',
    stocks: {
      'Apotik A': 20,
      'Apotik B': 50,
      'Apotik C': 0,
    },
  },
  {
    id: 2,
    name: 'Amoxicillin',
    stocks: {
      'Apotik A': 10,
      'Apotik B': 30,
      'Apotik C': 10,
    },
  },
]

const frequencies = [
  { value: 1, label: '1x sehari' },
  { value: 2, label: '2x sehari' },
  { value: 3, label: '3x sehari' },
]

const mealTimings = [
  { value: 'sebelum_makan', label: 'Sebelum makan' },
  { value: 'sesudah_makan', label: 'Sesudah makan' },
]

export default function CreatePrescriptionPage() {
  const { user } = useAuth()

  const [patients, setPatients] = useState(initialPatients)
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [medicineId, setMedicineId] = useState('')
  const [quantity, setQuantity] = useState('')
  const [frequency, setFrequency] = useState('')
  const [mealTiming, setMealTiming] = useState('')
  const [items, setItems] = useState([])
  const [patientModalOpen, setPatientModalOpen] = useState(false)
  const [newPatient, setNewPatient] = useState({ name: '', age: '' })

  const selectedMedicine = medicines.find((m) => m.id === Number(medicineId))
  const selectedMedicineStocks = selectedMedicine ? Object.entries(selectedMedicine.stocks) : []

  const addMedicine = () => {
    if (!selectedMedicine || !quantity || !frequency || !mealTiming) {
      alert('Lengkapi data obat')
      return
    }

    const qtyNumber = Number(quantity)
    if (Number.isNaN(qtyNumber) || qtyNumber <= 0) {
      alert('Jumlah tidak valid')
      return
    }

    if (qtyNumber > selectedMedicine.stocks[APOTIK_DOKTER]) {
      alert('Jumlah melebihi stok')
      return
    }

    setItems([
      ...items,
      {
        medicine: selectedMedicine.name,
        quantity: qtyNumber,
        frequency,
        mealTiming,
      },
    ])

    setMedicineId('')
    setQuantity('')
    setFrequency('')
    setMealTiming('')
  }

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const handleAddPatient = () => {
    if (!newPatient.name || !newPatient.age) {
      alert('Nama dan umur wajib diisi')
      return
    }

    const ageNumber = Number(newPatient.age)
    if (Number.isNaN(ageNumber) || ageNumber <= 0) {
      alert('Umur tidak valid')
      return
    }

    const newEntry = {
      id: Date.now(),
      name: newPatient.name,
      age: ageNumber,
    }

    setPatients((prev) => [...prev, newEntry])
    setSelectedPatient(newEntry)
    setNewPatient({ name: '', age: '' })
    setPatientModalOpen(false)
  }

  const submitPrescription = () => {
    if (!selectedPatient || items.length === 0) {
      alert('Pasien dan obat wajib diisi')
      return
    }

    const payload = {
      patient: selectedPatient,
      apotik: APOTIK_DOKTER,
      items,
      doctorRole: user?.role,
    }

    console.log('RESEP FINAL:', payload)
    alert('Resep berhasil disimpan (simulasi)')
  }

  return (
    <>
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-darkGrey">Modul Dokter</p>
          <h1 className="text-2xl font-bold text-primary">Buat Resep – {APOTIK_DOKTER}</h1>
        </div>
        <div className="flex items-center gap-2 text-sm text-darkGrey">
          <span className="inline-flex items-center gap-2 rounded-full bg-green/10 text-green px-3 py-1 font-semibold">
            Lokasi aktif: {APOTIK_DOKTER}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FORM */}
        <div className="lg:col-span-2 bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
          <div className="mb-5">
            <label className="block font-semibold text-sm mb-1">Pasien</label>
            <div className="flex gap-3">
              <select
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40"
                value={selectedPatient?.id || ''}
                onChange={(e) =>
                  setSelectedPatient(
                    patients.find((p) => p.id === Number(e.target.value)) || null
                  )
                }
              >
                <option value="">-- Pilih Pasien --</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.age} th)
                  </option>
                ))}
              </select>


            </div>
          </div>

          {selectedPatient && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">Tambah Obat</h2>
                <span className="text-xs text-darkGrey">Pastikan stok mencukupi</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40"
                  value={medicineId}
                  onChange={(e) => setMedicineId(e.target.value)}
                >
                  <option value="">Pilih Obat</option>
                  {medicines.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
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
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                >
                  <option value="">Frekuensi</option>
                  {frequencies.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>

                <select
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40"
                  value={mealTiming}
                  onChange={(e) => setMealTiming(e.target.value)}
                >
                  <option value="">Waktu Minum</option>
                  {mealTimings.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>

              {selectedMedicine && (
                <div className="rounded-xl border bg-lightGrey/60 p-4 text-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-primary">Stok semua apotik</h3>
                    <span className="text-xs text-darkGrey">Obat dipilih: {selectedMedicine.name}</span>
                  </div>
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="text-darkGrey">
                        <th className="py-1">Apotik</th>
                        <th className="py-1 text-right">Stok</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedMedicineStocks.map(([apotik, stok]) => (
                        <tr key={apotik} className="border-t border-gray-100">
                          <td className="py-1">
                            {apotik}
                            {apotik === APOTIK_DOKTER && (
                              <span className="ml-2 text-[11px] text-green font-semibold">
                                (Lokasi Anda)
                              </span>
                            )}
                          </td>
                          <td className="py-1 text-right font-semibold">{stok} unit</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <button
                onClick={addMedicine}
                className="inline-flex items-center justify-center bg-green text-white px-4 py-2 rounded-lg shadow hover:shadow-md transition"
              >
                + Tambah Obat
              </button>
            </div>
          )}

          {items.length > 0 && (
            <div className="mt-6">
              <h2 className="font-semibold mb-3">Daftar Obat</h2>
              <div className="overflow-hidden rounded-xl border">
                <table className="w-full text-sm">
                  <thead className="bg-lightGrey">
                    <tr>
                      <th className="p-2 text-left">Obat</th>
                      <th className="p-2">Jumlah</th>
                      <th className="p-2">Frekuensi</th>
                      <th className="p-2">Waktu</th>
                      <th className="p-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, i) => (
                      <tr key={i} className="border-t">
                        <td className="p-2">{item.medicine}</td>
                        <td className="p-2 text-center">{item.quantity}</td>
                        <td className="p-2 text-center">{item.frequency}x</td>
                        <td className="p-2 text-center">
                          {mealTimings.find((m) => m.value === item.mealTiming)?.label}
                        </td>
                        <td className="p-2 text-center">
                          <button
                            onClick={() => removeItem(i)}
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

          <div className="mt-6 flex justify-end">
            <button
              onClick={submitPrescription}
              className="bg-primary text-white px-6 py-2 rounded-lg shadow hover:shadow-md transition"
            >
              Simpan Resep
            </button>
          </div>
        </div>

        {/* RINGKASAN */}
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm h-fit space-y-3">
          <h2 className="font-bold">Ringkasan</h2>
          <p className="text-sm text-darkGrey">Pasien: {selectedPatient?.name || '-'}</p>
          <p className="text-sm text-darkGrey">Total Obat: {items.length}</p>

          {selectedPatient && items.length > 0 && (
            <div className="pt-3 border-t">
              <h3 className="text-sm font-semibold mb-2">Rincian</h3>
              <ul className="space-y-1 text-sm text-darkGrey">
                {items.map((item, i) => (
                  <li key={i} className="flex justify-between">
                    <span>{item.medicine}</span>
                    <span className="font-semibold">{item.quantity}x</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>

    <Modal open={patientModalOpen} onClose={() => setPatientModalOpen(false)}>
      {/* <h3 className="text-lg font-semibold mb-3">Tambah Pasien</h3> */}
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">Nama Lengkap</label>
          <input
            type="text"
            className="w-full border rounded-lg px-3 py-2"
            value={newPatient.name}
            onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Umur</label>
          <input
            type="number"
            min="0"
            className="w-full border rounded-lg px-3 py-2"
            value={newPatient.age}
            onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
          />
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={() => setPatientModalOpen(false)}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-darkGrey hover:bg-gray-100"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleAddPatient}
            className="rounded-lg bg-primary text-white px-4 py-2 text-sm font-semibold shadow hover:shadow-md transition"
          >
            Simpan Pasien
          </button>
        </div>
      </div>
    </Modal>
    </>
  )
}
