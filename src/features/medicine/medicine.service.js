import api from '../../lib/axios'

export const medicineService = {
  list: async ({ search, page = 1, limit = 200, lowStock } = {}) => {
    const res = await api.get('/medicines', { params: { search, page, limit, lowStock } })
    return res.data?.data ?? []
  },

  get: async (id) => {
    const res = await api.get(`/medicines/${id}`)
    return res.data?.data
  },

  create: async (payload) => {
    const res = await api.post('/medicines', payload)
    return res.data?.data
  },

  update: async (id, payload) => {
    const res = await api.put(`/medicines/${id}`, payload)
    return res.data?.data
  },

  remove: async (id) => {
    const res = await api.delete(`/medicines/${id}`)
    return res.data
  },

  updateStock: async (id, { quantity, operation }) => {
    const res = await api.patch(`/medicines/${id}/stock`, { quantity, operation })
    return res.data?.data
  },
}
