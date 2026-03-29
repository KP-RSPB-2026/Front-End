import { useEffect, useState } from 'react'
import { medicineService } from '../medicine/medicine.service'

export default function StockManagementPage() {
  const [medicines, setMedicines] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError('')
        const data = await medicineService.list({ limit: 200 })
        setMedicines(data)
      } catch (err) {
        const message = err?.response?.data?.message || 'Gagal memuat stok'
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const updateStock = async (id, amount) => {
    const operation = amount > 0 ? 'add' : 'subtract'
    const quantity = Math.abs(amount)

    try {
      setUpdatingId(id)
      setError('')
      const updated = await medicineService.updateStock(id, { quantity, operation })
      setMedicines((prev) => prev.map((m) => (String(m._id) === String(id) ? updated : m)))
    } catch (err) {
      const message = err?.response?.data?.message || 'Gagal memperbarui stok'
      setError(message)
    } finally {
      setUpdatingId('')
    }
  }

  const getStatus = (stock, minStock = 5) => {
    if (stock === 0)
      return {
        label: 'Habis',
        style: 'bg-red-100 text-red-600',
      }

    if (stock <= minStock)
      return {
        label: 'Menipis',
        style: 'bg-yellow-100 text-yellow-600',
      }

    return {
      label: 'Aman',
      style: 'bg-green-100 text-green-600',
    }
  }

  const lowStock = medicines.filter((med) => med.stock <= (med.minStock ?? 5))

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary mb-6">
        Manajemen Stok
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* TABEL STOK */}
        <div className="lg:col-span-2 bg-white p-6 rounded shadow">
          <h2 className="font-bold mb-4">
            Daftar Stok Obat
          </h2>

          <table className="w-full text-sm">
            <thead className="bg-lightGrey">
              <tr>
                <th className="text-left p-2">
                  Nama Obat
                </th>
                <th className="text-center p-2">
                  Stok
                </th>
                <th className="text-center p-2">
                  Status
                </th>
                <th className="text-center p-2">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td className="p-2" colSpan={4}>Memuat...</td></tr>
              ) : medicines.length === 0 ? (
                <tr><td className="p-2" colSpan={4}>Belum ada data obat</td></tr>
              ) : medicines.map((med) => {
                const status = getStatus(med.stock, med.minStock)

                return (
                  <tr key={med._id} className="border-t">
                    <td className="p-2">
                      {med.name}
                    </td>

                    <td className="p-2 text-center">
                      {med.stock}
                    </td>

                    <td className="p-2 text-center">
                      <span
                        className={`px-2 py-1 rounded text-xs ${status.style}`}
                      >
                        {status.label}
                      </span>
                    </td>

                    <td className="p-2 text-center space-x-2">
                      <button
                        onClick={() => updateStock(med._id, 1)}
                        disabled={!!updatingId}
                        className="bg-green text-white px-2 py-1 rounded text-xs disabled:opacity-50"
                      >
                        +1
                      </button>

                      <button
                        onClick={() => updateStock(med._id, -1)}
                        disabled={med.stock === 0 || !!updatingId}
                        className="bg-red-500 text-white px-2 py-1 rounded text-xs disabled:opacity-50"
                      >
                        -1
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* PANEL INFO */}
        <div className="bg-white p-6 rounded shadow h-fit">
          <h2 className="font-bold mb-4">
            Ringkasan Stok
          </h2>

          <p className="text-sm mb-3">
            Total Obat: {medicines.length}
          </p>

          <p className="text-sm mb-4">
            Obat Menipis / Habis: {lowStock.length}
          </p>

          <hr className="my-4" />

          <h3 className="font-semibold mb-2">
            Perhatian
          </h3>

          {lowStock.length > 0 ? (
            <ul className="text-sm space-y-2">
              {lowStock.map((med) => (
                <li key={med._id} className="flex justify-between">
                  <span>{med.name}</span>
                  <span className="text-red-500">{med.stock}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-darkGrey">
              Semua stok dalam kondisi aman.
            </p>
          )}

          {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
        </div>
      </div>
    </div>
  )
}
