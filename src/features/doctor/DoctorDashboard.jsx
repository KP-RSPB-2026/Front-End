import { Link } from 'react-router-dom'

export default function DoctorDashboard() {
  // DATA SIMULASI
  const totalPatients = 24
  const totalPrescriptionsToday = 6
  const totalMedicines = 12

  const recentPrescriptions = [
    {
      id: 1,
      patient: 'Budi Santoso',
      date: '16/02/2026',
      totalItems: 2,
    },
    {
      id: 2,
      patient: 'Siti Aminah',
      date: '16/02/2026',
      totalItems: 1,
    },
  ]

  const lowStockMedicines = [
    { name: 'Paracetamol', stock: 3 },
    { name: 'Amoxicillin', stock: 2 },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary mb-6">
        Dashboard Dokter
      </h1>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded shadow">
          <p className="text-sm text-darkGrey">
            Total Pasien
          </p>
          <p className="text-2xl font-bold mt-2">
            {totalPatients}
          </p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <p className="text-sm text-darkGrey">
            Resep Hari Ini
          </p>
          <p className="text-2xl font-bold mt-2">
            {totalPrescriptionsToday}
          </p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <p className="text-sm text-darkGrey">
            Total Obat Tersedia
          </p>
          <p className="text-2xl font-bold mt-2">
            {totalMedicines}
          </p>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* RESEP TERBARU */}
        <div className="lg:col-span-2 bg-white p-6 rounded shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold">
              Resep Terbaru
            </h2>
            <Link
              to="/doctor/prescription/create"
              className="text-sm text-primary"
            >
              + Buat Resep
            </Link>
          </div>

          <table className="w-full text-sm">
            <thead className="bg-lightGrey">
              <tr>
                <th className="text-left p-2">
                  Pasien
                </th>
                <th className="text-left p-2">
                  Tanggal
                </th>
                <th className="text-center p-2">
                  Jumlah Obat
                </th>
              </tr>
            </thead>
            <tbody>
              {recentPrescriptions.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="p-2">{r.patient}</td>
                  <td className="p-2">{r.date}</td>
                  <td className="p-2 text-center">
                    {r.totalItems}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* NOTIFIKASI STOK */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="font-bold mb-4">
            Stok Hampir Habis
          </h2>

          {lowStockMedicines.length > 0 ? (
            <ul className="space-y-3">
              {lowStockMedicines.map((med, i) => (
                <li
                  key={i}
                  className="flex justify-between text-sm"
                >
                  <span>{med.name}</span>
                  <span className="text-red-500 font-medium">
                    {med.stock}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-darkGrey">
              Tidak ada stok kritis
            </p>
          )}

          <hr className="my-4" />
        </div>
      </div>
    </div>
  )
}
