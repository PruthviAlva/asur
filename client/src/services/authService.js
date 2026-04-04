import axios from 'axios'
import { API_BASE_URL } from '../utils/constants'

const api = axios.create({ baseURL: API_BASE_URL })

// Attach JWT to every request automatically
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('asur_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

const authService = {
    register: (data) => api.post('/auth/register', data).then(r => r.data),
    login: (data) => api.post('/auth/login', data).then(r => r.data),
    getMe: () => api.get('/auth/me').then(r => r.data),
}

export default authService
export { api } // named export — reused by other services