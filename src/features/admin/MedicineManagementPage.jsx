import { useState } from 'react'

export default function MedicineManagementPage() {
  const [medicines, setMedicines] = useState([
    {
      id: 1,
      name: 'Paracetamol',
      category: 'Analgesik',
      stock: 20,
      price: 5000,
    },
    {
      id: 2,
      name: 'Amoxicillin',
      category: 'Antibiotik',
      stock: 15,
      price: 12000,
    },
  ])

  const [form, setForm] = useState({
    id: null,
    name: '',
    category: '',
    stock: '',
    price: '',
  })

  const [isEditing, setIsEditing] = useState(false)

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!form.name || !form.category) {
      alert('Nama dan kategori wajib diisi')
      return
    }

    if (isEditing) {
      setMedicines(
        medicines.map((med) =>
          med.id === form.id ? form : med
        )
      )
      setIsEditing(false)
    } else {
      setMedicines([
        ...medicines,
        {
          ...form,
          id: Date.now(),
          stock: Number(form.stock),
          price: Number(form.price),
        },
      ])
    }

    setForm({
      id: null,
      name: '',
      category: '',
      stock: '',
      price: '',
    })
  }

  const handleEdit = (medicine) => {
    setForm(medicine)
    setIsEditing(true)
  }

  const handleDelete = (id) => {
    setMedicines(
      medicines.filter((med) => med.id !== id)
    )
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
              <label className="block text-sm mb-1">
                Nama Obat
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm mb-1">
                Kategori
              </label>
              <input
                type="text"
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm mb-1">
                Stok
              </label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm mb-1">
                Harga
              </label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded w-full"
            >
              {isEditing ? 'Update' : 'Simpan'}
            </button>
          </form>
        </div>

        {/* TABEL */}
        <div className="lg:col-span-2 bg-white p-6 rounded shadow">
          <h2 className="font-bold mb-4">
            Daftar Obat
          </h2>

          <table className="w-full text-sm">
            <thead className="bg-lightGrey">
              <tr>
                <th className="text-left p-2">
                  Nama
                </th>
                <th className="text-left p-2">
                  Kategori
                </th>
                <th className="text-center p-2">
                  Stok
                </th>
                <th className="text-right p-2">
                  Harga
                </th>
                <th className="text-center p-2">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {medicines.map((med) => (
                <tr key={med.id} className="border-t">
                  <td className="p-2">
                    {med.name}
                  </td>
                  <td className="p-2">
                    {med.category}
                  </td>
                  <td className="p-2 text-center">
                    {med.stock}
                  </td>
                  <td className="p-2 text-right">
                    Rp {med.price.toLocaleString()}
                  </td>
                  <td className="p-2 text-center space-x-2">
                    <button
                      onClick={() =>
                        handleEdit(med)
                      }
                      className="text-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        handleDelete(med.id)
                      }
                      className="text-red-600"
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
    </div>
  )
}
