import api from '../../lib/axios'

export const authService = {
  login: async ({ email, password }) => {
    const res = await api.post('/auth/login', { email, password })
    // API returns { success, data: { _id, name, email, role, token } }
    return res.data?.data
  },
  me: async () => {
    const res = await api.get('/auth/me')
    return res.data?.data
  },
}
