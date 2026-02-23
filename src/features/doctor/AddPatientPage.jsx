import { useState } from 'react'

export default function AddPatientPage() {
  const [form, setForm] = useState({
    name: '',
    nik: '',
    gender: '',
    birthDate: '',
    address: '',
    phone: '',
  })

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (
      !form.name ||
      !form.nik ||
      !form.gender ||
      !form.birthDate
    ) {
      alert('Lengkapi data wajib')
      return
    }

    console.log('DATA PASIEN:', form)
    alert('Pasien berhasil ditambahkan (simulasi)')

    // reset form
    setForm({
      name: '',
      nik: '',
      gender: '',
      birthDate: '',
      address: '',
      phone: '',
    })
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary mb-6">
        Tambah Pasien
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FORM */}
        <div className="lg:col-span-2 bg-white p-8 rounded shadow">
          <form onSubmit={handleSubmit}>
            {/* NAMA */}
            <div className="mb-5">
              <label className="block font-medium mb-1">
                Nama Lengkap *
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* NIK */}
            <div className="mb-5">
              <label className="block font-medium mb-1">
                NIK *
              </label>
              <input
                type="text"
                name="nik"
                value={form.nik}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* GENDER */}
            <div className="mb-5">
              <label className="block font-medium mb-1">
                Jenis Kelamin *
              </label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">-- Pilih --</option>
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>

            {/* TANGGAL LAHIR */}
            <div className="mb-5">
              <label className="block font-medium mb-1">
                Tanggal Lahir *
              </label>
              <input
                type="date"
                name="birthDate"
                value={form.birthDate}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* ALAMAT */}
            <div className="mb-5">
              <label className="block font-medium mb-1">
                Alamat
              </label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                rows="3"
              />
            </div>

            {/* TELEPON */}
            <div className="mb-6">
              <label className="block font-medium mb-1">
                No. Telepon
              </label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <button
              type="submit"
              className="bg-primary text-white px-6 py-2 rounded"
            >
              Simpan Pasien
            </button>
          </form>
        </div>

        {/* PANEL INFO */}
        <div className="bg-white p-6 rounded shadow h-fit">
          <h2 className="font-bold mb-4">
            Informasi
          </h2>

          <ul className="text-sm text-darkGrey list-disc ml-4 space-y-2">
            <li>Field bertanda * wajib diisi</li>
            <li>Data pasien tersimpan dalam sistem</li>
            <li>Pasien dapat digunakan untuk pembuatan resep</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
