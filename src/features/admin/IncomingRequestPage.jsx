import { useState } from 'react'

export default function IncomingRequestPage() {
  // SIMULASI STOK ADMIN
  const [medicines, setMedicines] = useState([
    { id: 1, name: 'Paracetamol', stock: 20 },
    { id: 2, name: 'Amoxicillin', stock: 10 },
  ])

  // SIMULASI REQUEST MASUK
  const [requests, setRequests] = useState([
    {
      id: 1,
      from: 'Apotik B',
      medicine: 'Paracetamol',
      quantity: 5,
      status: 'Menunggu',
      date: '16/02/2026',
    },
    {
      id: 2,
      from: 'Apotik C',
      medicine: 'Amoxicillin',
      quantity: 8,
      status: 'Menunggu',
      date: '16/02/2026',
    },
  ])

  const handleApprove = (request) => {
    const medicine = medicines.find(
      (m) => m.name === request.medicine
    )

    if (!medicine || medicine.stock < request.quantity) {
      alert('Stok tidak mencukupi')
      return
    }

    // Kurangi stok
    setMedicines(
      medicines.map((m) =>
        m.name === request.medicine
          ? {
              ...m,
              stock: m.stock - request.quantity,
            }
          : m
      )
    )

    // Update status
    setRequests(
      requests.map((r) =>
        r.id === request.id
          ? { ...r, status: 'Disetujui' }
          : r
      )
    )
  }

  const handleReject = (id) => {
    setRequests(
      requests.map((r) =>
        r.id === id
          ? { ...r, status: 'Ditolak' }
          : r
      )
    )
  }

  const getStatusStyle = (status) => {
    if (status === 'Menunggu')
      return 'bg-yellow-100 text-yellow-600'
    if (status === 'Disetujui')
      return 'bg-green-100 text-green-600'
    if (status === 'Ditolak')
      return 'bg-red-100 text-red-600'
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary mb-6">
        Request Masuk dari Apotik Lain
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* TABEL REQUEST */}
        <div className="lg:col-span-2 bg-white p-6 rounded shadow">
          <h2 className="font-bold mb-4">
            Daftar Request Masuk
          </h2>

          <table className="w-full text-sm">
            <thead className="bg-lightGrey">
              <tr>
                <th className="text-left p-2">
                  Tanggal
                </th>
                <th className="text-left p-2">
                  Dari
                </th>
                <th className="text-left p-2">
                  Obat
                </th>
                <th className="text-center p-2">
                  Jumlah
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
              {requests.map((req) => (
                <tr key={req.id} className="border-t">
                  <td className="p-2">
                    {req.date}
                  </td>
                  <td className="p-2">
                    {req.from}
                  </td>
                  <td className="p-2">
                    {req.medicine}
                  </td>
                  <td className="p-2 text-center">
                    {req.quantity}
                  </td>
                  <td className="p-2 text-center">
                    <span
                      className={`px-2 py-1 rounded text-xs ${getStatusStyle(
                        req.status
                      )}`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="p-2 text-center space-x-2">
                    {req.status === 'Menunggu' && (
                      <>
                        <button
                          onClick={() =>
                            handleApprove(req)
                          }
                          className="bg-green text-white px-2 py-1 rounded text-xs"
                        >
                          Setujui
                        </button>
                        <button
                          onClick={() =>
                            handleReject(req.id)
                          }
                          className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                        >
                          Tolak
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PANEL STOK */}
        <div className="bg-white p-6 rounded shadow h-fit">
          <h2 className="font-bold mb-4">
            Stok Saat Ini
          </h2>

          <ul className="space-y-3 text-sm">
            {medicines.map((med) => (
              <li
                key={med.id}
                className="flex justify-between"
              >
                <span>{med.name}</span>
                <span className="font-medium">
                  {med.stock}
                </span>
              </li>
            ))}
          </ul>

          <hr className="my-4" />

          <p className="text-xs text-darkGrey">
            Jika request disetujui, stok
            otomatis berkurang.
          </p>
        </div>
      </div>
    </div>
  )
}
