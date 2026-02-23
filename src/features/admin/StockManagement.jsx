import { useState } from 'react'

export default function StockManagementPage() {
  const [medicines, setMedicines] = useState([
    { id: 1, name: 'Paracetamol', stock: 20 },
    { id: 2, name: 'Amoxicillin', stock: 5 },
    { id: 3, name: 'Ibuprofen', stock: 0 },
  ])

  const updateStock = (id, amount) => {
    setMedicines(
      medicines.map((med) =>
        med.id === id
          ? { ...med, stock: med.stock + amount }
          : med
      )
    )
  }

  const getStatus = (stock) => {
    if (stock === 0)
      return {
        label: 'Habis',
        style: 'bg-red-100 text-red-600',
      }

    if (stock <= 5)
      return {
        label: 'Menipis',
        style: 'bg-yellow-100 text-yellow-600',
      }

    return {
      label: 'Aman',
      style: 'bg-green-100 text-green-600',
    }
  }

  const lowStock = medicines.filter(
    (med) => med.stock <= 5
  )

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
              {medicines.map((med) => {
                const status = getStatus(med.stock)

                return (
                  <tr key={med.id} className="border-t">
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
                        onClick={() =>
                          updateStock(med.id, 1)
                        }
                        className="bg-green text-white px-2 py-1 rounded text-xs"
                      >
                        +1
                      </button>

                      <button
                        onClick={() =>
                          updateStock(med.id, -1)
                        }
                        disabled={med.stock === 0}
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
            Obat Menipis / Habis:{' '}
            {lowStock.length}
          </p>

          <hr className="my-4" />

          <h3 className="font-semibold mb-2">
            Perhatian
          </h3>

          {lowStock.length > 0 ? (
            <ul className="text-sm space-y-2">
              {lowStock.map((med) => (
                <li
                  key={med.id}
                  className="flex justify-between"
                >
                  <span>{med.name}</span>
                  <span className="text-red-500">
                    {med.stock}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-darkGrey">
              Semua stok dalam kondisi aman.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
