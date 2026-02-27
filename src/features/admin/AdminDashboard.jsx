import { Link } from 'react-router-dom'

export default function AdminDashboard() {
  /* =========================
     DATA SIMULASI
  ========================== */

  const totalMedicines = 48
  const totalRequests = 5
  const prescriptionsToday = 9

  const recentRequests = [
    {
      id: 1,
      medicine: 'Paracetamol',
      from: 'Apotik B',
      status: 'Menunggu',
    },
    {
      id: 2,
      medicine: 'Amoxicillin',
      from: 'Apotik C',
      status: 'Disetujui',
    },
  ]

  const lowStockMedicines = [
    { name: 'Ibuprofen', stock: 2 },
    { name: 'Cetirizine', stock: 1 },
  ]

  const recentPrescriptions = [
    { id: 1, patient: 'Budi Santoso', totalItems: 2 },
    { id: 2, patient: 'Siti Aminah', totalItems: 1 },
  ]

  // DATA STOK ANTAR APOTIK
  const crossApotikStock = [
    {
      name: 'Paracetamol',
      stocks: {
        'Apotik A': 20,
        'Apotik B': 50,
        'Apotik C': 10,
      },
    },
    {
      name: 'Amoxicillin',
      stocks: {
        'Apotik A': 10,
        'Apotik B': 0,
        'Apotik C': 30,
      },
    },
  ]

  const getStatusColor = (stock) => {
    if (stock === 0) return 'text-red-500'
    if (stock <= 5) return 'text-yellow-600'
    return 'text-green-600'
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary mb-6">
        Dashboard Admin Apotik
      </h1>

      {/* ================= STAT CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded shadow">
          <p className="text-sm text-darkGrey">
            Total Obat
          </p>
          <p className="text-2xl font-bold mt-2">
            {totalMedicines}
          </p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <p className="text-sm text-darkGrey">
            Request Aktif
          </p>
          <p className="text-2xl font-bold mt-2">
            {totalRequests}
          </p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <p className="text-sm text-darkGrey">
            Resep Hari Ini
          </p>
          <p className="text-2xl font-bold mt-2">
            {prescriptionsToday}
          </p>
        </div>
      </div>

      {/* ================= GRID UTAMA ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* REQUEST TERBARU */}
        <div className="lg:col-span-2 bg-white p-6 rounded shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold">
              Request Obat Terbaru
            </h2>
            <Link
              to="/admin/stock"
              className="text-sm text-primary"
            >
              Kelola Stok
            </Link>
          </div>

          <table className="w-full text-sm">
            <thead className="bg-lightGrey">
              <tr>
                <th className="text-left p-2">
                  Obat
                </th>
                <th className="text-left p-2">
                  Dari
                </th>
                <th className="text-center p-2">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {recentRequests.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="p-2">
                    {r.medicine}
                  </td>
                  <td className="p-2">
                    {r.from}
                  </td>
                  <td className="p-2 text-center">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        r.status === 'Menunggu'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* STOK KRITIS */}
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
              Semua stok aman
            </p>
          )}
        </div>
      </div>

      {/* ================= RESEP MASUK ================= */}
      <div className="bg-white p-6 rounded shadow mt-6">
        <h2 className="font-bold mb-4">
          Resep Masuk Hari Ini
        </h2>

        <table className="w-full text-sm">
          <thead className="bg-lightGrey">
            <tr>
              <th className="text-left p-2">
                Pasien
              </th>
              <th className="text-center p-2">
                Jumlah Obat
              </th>
            </tr>
          </thead>
          <tbody>
            {recentPrescriptions.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-2">
                  {r.patient}
                </td>
                <td className="p-2 text-center">
                  {r.totalItems}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= STOK ANTAR APOTIK ================= */}
      <div className="bg-white p-6 rounded shadow mt-6">
        <h2 className="font-bold mb-4">
          Perbandingan Stok Antar Apotik
        </h2>

        <table className="w-full text-sm">
          <thead className="bg-lightGrey">
            <tr>
              <th className="text-left p-2">
                Obat
              </th>
              <th className="text-center p-2">
                Apotik A
              </th>
              <th className="text-center p-2">
                Apotik B
              </th>
              <th className="text-center p-2">
                Apotik C
              </th>
            </tr>
          </thead>
          <tbody>
            {crossApotikStock.map((item, index) => (
              <tr key={index} className="border-t">
                <td className="p-2 font-medium">
                  {item.name}
                </td>

                {Object.entries(item.stocks).map(
                  ([apotik, stock]) => (
                    <td
                      key={apotik}
                      className={`p-2 text-center font-medium ${getStatusColor(
                        stock
                      )}`}
                    >
                      {stock}
                    </td>
                  )
                )}
              </tr>
            ))}
          </tbody>
        </table>

        <p className="text-xs text-darkGrey mt-3">
          Hijau = aman, Kuning = menipis, Merah = habis.
        </p>
      </div>
    </div>
  )
}