import api from '../../lib/axios'

export const doctorService = {
  getDashboard: async () => {
    const [patientsRes, prescriptionsRes, medicinesRes, lowStockRes] = await Promise.all([
      api.get('/patients', { params: { page: 1, limit: 1 } }),
      api.get('/prescriptions', { params: { page: 1, limit: 5 } }),
      api.get('/medicines', { params: { page: 1, limit: 1 } }),
      api.get('/medicines', { params: { lowStock: true, page: 1, limit: 5 } }),
    ])

    const patientsTotal = patientsRes.data?.pagination?.total ?? 0
    const prescriptions = prescriptionsRes.data?.data ?? []
    const prescriptionsTotal = prescriptionsRes.data?.pagination?.total ?? prescriptions.length
    const medicinesTotal = medicinesRes.data?.pagination?.total ?? 0
    const lowStock = lowStockRes.data?.data ?? []

    return {
      stats: {
        patients: patientsTotal,
        prescriptions: prescriptionsTotal,
        medicines: medicinesTotal,
      },
      recentPrescriptions: prescriptions,
      lowStock,
    }
  },

  listPatients: async ({ search } = {}) => {
    const res = await api.get('/patients', { params: { search, page: 1, limit: 100 } })
    return res.data?.data ?? []
  },

  listMedicines: async ({ search, pharmacyCode } = {}) => {
    const res = await api.get('/medicines', {
      params: { search, pharmacyCode, page: 1, limit: 200 },
    })
    return res.data?.data ?? []
  },

  listPharmacies: async () => {
    const res = await api.get('/medicines/pharmacies')
    return res.data?.data ?? []
  },

  createPrescription: async (payload) => {
    const res = await api.post('/prescriptions', payload)
    return res.data?.data
  },

  createPatient: async (payload) => {
    const res = await api.post('/patients', payload)
    return res.data?.data
  },

  listPrescriptions: async ({ status, page = 1, limit = 100 } = {}) => {
    const res = await api.get('/prescriptions', { params: { status, page, limit } })
    return res.data?.data ?? []
  },

  getPrescription: async (id) => {
    const res = await api.get(`/prescriptions/${id}`)
    return res.data?.data
  },
}
