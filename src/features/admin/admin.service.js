import api from '../../lib/axios'

export const adminService = {
  getDashboard: async () => {
    const [medRes, lowRes, presRes, transfersRes] = await Promise.all([
      api.get('/medicines', { params: { page: 1, limit: 1 } }),
      api.get('/medicines', { params: { lowStock: true, page: 1, limit: 5 } }),
      api.get('/prescriptions', { params: { page: 1, limit: 5 } }),
      api.get('/transfers', { params: { status: 'pending', page: 1, limit: 5 } }),
    ])

    const medicinesTotal = medRes.data?.pagination?.total ?? 0
    const lowStock = lowRes.data?.data ?? []
    const prescriptions = presRes.data?.data ?? []
    const prescriptionsTotal = presRes.data?.pagination?.total ?? prescriptions.length
    const transfers = transfersRes.data?.data ?? []
    const transfersTotal = transfersRes.data?.pagination?.total ?? transfers.length

    return {
      stats: {
        medicines: medicinesTotal,
        requests: transfersTotal,
        prescriptions: prescriptionsTotal,
      },
      lowStock,
      prescriptions,
      transfers,
    }
  },

  listTransfers: async ({ status, page = 1, limit = 50 } = {}) => {
    const res = await api.get('/transfers', { params: { status, page, limit } })
    return res.data?.data ?? []
  },

  updateTransferStatus: async (id, status) => {
    const res = await api.patch(`/transfers/${id}/status`, { status })
    return res.data?.data
  },

  updatePrescriptionStatus: async (id, { status, reason } = {}) => {
    const res = await api.patch(`/prescriptions/${id}/status`, {
      status,
      reason,
    })
    return res.data?.data
  },

  createTransferRequest: async ({ toPharmacy, medicines, notes, urgency }) => {
    const res = await api.post('/transfers/request', {
      toPharmacy,
      medicines,
      notes,
      urgency,
    })
    return res.data?.data
  },

  listPharmacies: async () => {
    const res = await api.get('/transfers/pharmacies')
    return res.data?.data ?? []
  },

  listPrescriptions: async ({ status, page = 1, limit = 50 } = {}) => {
    const res = await api.get('/prescriptions', { params: { status, page, limit } })
    return res.data?.data ?? []
  },

  getPrescription: async (id) => {
    const res = await api.get(`/prescriptions/${id}`)
    return res.data?.data
  },

  updatePrescriptionStatus: async (id, status) => {
    const res = await api.patch(`/prescriptions/${id}/status`, { status })
    return res.data?.data
  },
}
