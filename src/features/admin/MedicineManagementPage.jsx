import { useEffect, useState } from 'react'
import { medicineService } from '../medicine/medicine.service'

export default function MedicineManagementPage() {
  const [medicines, setMedicines] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    id: null,
    code: '',
    name: '',
    genericName: '',
    category: '',
    manufacturer: '',
    dosage: '',
    unit: '',
    stock: '',
    minStock: '',
    price: '',
    expiryDate: '',
    batchNumber: '',
    description: '',
  })

  const [isEditing, setIsEditing] = useState(false)

  const generateMedicineCode = (name = '') => {
    const clean = String(name).replace(/[^a-zA-Z0-9\s]/g, '').trim()
    const parts = clean.split(/\s+/).filter(Boolean)
    const prefix = (parts.map((p) => p.slice(0, 2)).join('').slice(0, 6) || 'MED').toUpperCase()
    const suffix = String(Date.now()).slice(-5)
    return `${prefix}-${suffix}`
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === 'name' && !isEditing && !form.code) {
      setForm({
        ...form,
        name: value,
        code: generateMedicineCode(value),
      })
      return
    }

    setForm({
      ...form,
      [name]: value,
    })
  }

  const handleGenerateCode = () => {
    setForm((prev) => ({
      ...prev,
      code: generateMedicineCode(prev.name),
    }))
  }

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError('')
        const data = await medicineService.list({ limit: 200 })
        setMedicines(data)
      } catch (err) {
        const message = err?.response?.data?.message || 'Gagal memuat data obat'
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!form.code || !form.name || !form.category || !form.unit) {
      alert('Kode, nama, kategori, dan satuan wajib diisi')
      return
    }

    const stockValue = form.stock === '' ? 0 : Number(form.stock)
    const minStockValue = form.minStock === '' ? 10 : Number(form.minStock)
    const priceValue = form.price === '' ? 0 : Number(form.price)

    if (stockValue < 0 || minStockValue < 0 || priceValue < 0) {
      alert('Stok, minimum stok, dan harga tidak boleh negatif')
      return
    }

    const payload = {
      code: form.code,
      name: form.name,
      genericName: form.genericName || undefined,
      category: form.category,
      manufacturer: form.manufacturer || undefined,
      description: form.description || undefined,
      dosage: form.dosage || undefined,
      unit: form.unit,
      stock: stockValue,
      minStock: minStockValue,
      price: priceValue,
      expiryDate: form.expiryDate || undefined,
      batchNumber: form.batchNumber || undefined,
    }

    const save = async () => {
      try {
        setSaving(true)
        setError('')
        if (isEditing && form.id) {
          const updated = await medicineService.update(form.id, payload)
          setMedicines((prev) => prev.map((m) => (String(m._id) === String(form.id) ? updated : m)))
        } else {
          const created = await medicineService.create(payload)
          setMedicines((prev) => [created, ...prev])
        }
        setIsEditing(false)
        setForm({
          id: null,
          code: '',
          name: '',
          genericName: '',
          category: '',
          manufacturer: '',
          dosage: '',
          unit: '',
          stock: '',
          minStock: '',
          price: '',
          expiryDate: '',
          batchNumber: '',
          description: '',
        })
      } catch (err) {
        const message = err?.response?.data?.message || 'Gagal menyimpan obat'
        setError(message)
      } finally {
        setSaving(false)
      }
    }

    save()
  }

  const handleEdit = (medicine) => {
    setForm({
      id: medicine._id,
      code: medicine.code || '',
      name: medicine.name || '',
      genericName: medicine.genericName || '',
      category: medicine.category || '',
      manufacturer: medicine.manufacturer || '',
      dosage: medicine.dosage || '',
      unit: medicine.unit || '',
      stock: medicine.stock ?? '',
      minStock: medicine.minStock ?? '',
      price: medicine.price ?? '',
      expiryDate: medicine.expiryDate ? String(medicine.expiryDate).slice(0, 10) : '',
      batchNumber: medicine.batchNumber || '',
      description: medicine.description || '',
    })
    setIsEditing(true)
  }

  const resetForm = () => {
    setIsEditing(false)
    setForm({
      id: null,
      code: '',
      name: '',
      genericName: '',
      category: '',
      manufacturer: '',
      dosage: '',
      unit: '',
      stock: '',
      minStock: '',
      price: '',
      expiryDate: '',
      batchNumber: '',
      description: '',
    })
  }

  const handleDelete = async (id) => {
    try {
      setSaving(true)
      setError('')
      await medicineService.remove(id)
      setMedicines(medicines.filter((med) => String(med._id) !== String(id)))
      if (isEditing && String(form.id) === String(id)) {
        setIsEditing(false)
        setForm({ id: null, code: '', name: '', category: '', unit: '', stock: '', price: '' })
      }
    } catch (err) {
      const message = err?.response?.data?.message || 'Gagal menghapus obat'
      setError(message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary mb-6">
        Manajemen Obat
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FORM */}
        <div className="bg-white p-6 rounded shadow h-fit">
          <h2 className="font-bold mb-4">
            {isEditing ? 'Edit Obat' : 'Tambah Obat'}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm mb-1">Kode Obat *</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="code"
                  value={form.code}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
                <button
                  type="button"
                  onClick={handleGenerateCode}
                  className="whitespace-nowrap border border-primary text-primary px-3 py-2 rounded text-sm"
                >
                  Auto
                </button>
              </div>
              <p className="text-xs text-darkGrey mt-1">Kode bisa dibuat otomatis, tetap bisa diubah manual.</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm mb-1">Nama Obat *</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm mb-1">Nama Generik</label>
              <input
                type="text"
                name="genericName"
                value={form.genericName}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm mb-1">Kategori *</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              >
                <option value="">Pilih kategori</option>
                <option value="Tablet">Tablet</option>
                <option value="Kapsul">Kapsul</option>
                <option value="Sirup">Sirup</option>
                <option value="Salep">Salep</option>
                <option value="Injeksi">Injeksi</option>
                <option value="Tetes">Tetes</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm mb-1">Produsen</label>
              <input
                type="text"
                name="manufacturer"
                value={form.manufacturer}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm mb-1">Dosis</label>
              <input
                type="text"
                name="dosage"
                value={form.dosage}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                placeholder="Contoh: 500mg"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm mb-1">Satuan *</label>
              <select
                name="unit"
                value={form.unit}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              >
                <option value="">Pilih satuan</option>
                <option value="Tablet">Tablet</option>
                <option value="Kapsul">Kapsul</option>
                <option value="Botol">Botol</option>
                <option value="Tube">Tube</option>
                <option value="Strip">Strip</option>
                <option value="Vial">Vial</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm mb-1">Stok</label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                min="0"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm mb-1">Minimum Stok</label>
              <input
                type="number"
                name="minStock"
                value={form.minStock}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                min="0"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm mb-1">Harga</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                min="0"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm mb-1">Tanggal Kedaluwarsa</label>
              <input
                type="date"
                name="expiryDate"
                value={form.expiryDate}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm mb-1">Batch Number</label>
              <input
                type="text"
                name="batchNumber"
                value={form.batchNumber}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm mb-1">Deskripsi</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                rows={3}
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="bg-primary text-white px-4 py-2 rounded w-full disabled:opacity-50"
            >
              {isEditing ? 'Update' : 'Simpan'}
            </button>

            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="mt-2 border border-gray-300 text-gray-700 px-4 py-2 rounded w-full"
              >
                Batal Edit
              </button>
            )}
          </form>
        </div>

        {/* TABEL */}
        <div className="lg:col-span-2 bg-white p-6 rounded shadow">
          <h2 className="font-bold mb-4">Daftar Obat</h2>

          <table className="w-full text-sm">
            <thead className="bg-lightGrey">
              <tr>
                <th className="text-left p-2">Kode</th>
                <th className="text-left p-2">Nama</th>
                <th className="text-left p-2">Kategori</th>
                <th className="text-left p-2">Satuan</th>
                <th className="text-center p-2">Stok</th>
                <th className="text-right p-2">Harga</th>
                <th className="text-center p-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td className="p-2" colSpan={7}>Memuat...</td></tr>
              ) : medicines.length === 0 ? (
                <tr><td className="p-2" colSpan={7}>Belum ada data</td></tr>
              ) : (
                medicines.map((med) => (
                  <tr key={med._id} className="border-t">
                    <td className="p-2">{med.code}</td>
                    <td className="p-2">{med.name}</td>
                    <td className="p-2">{med.category}</td>
                    <td className="p-2">{med.unit}</td>
                    <td className="p-2 text-center">{med.stock}</td>
                    <td className="p-2 text-right">Rp {(med.price ?? 0).toLocaleString()}</td>
                    <td className="p-2 text-center space-x-2">
                      <button
                        onClick={() => handleEdit(med)}
                        className="text-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(med._id)}
                        disabled={saving}
                        className="text-red-600 disabled:opacity-50"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
        </div>
      </div>
    </div>
  )
}
