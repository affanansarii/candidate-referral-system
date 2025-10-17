import axios from 'axios'

const API_BASE_URL = 'https://candidate-referral-system-gamma.vercel.app/api'

const api = axios.create({
    baseURL: API_BASE_URL,
})

// Request interceptor for auth
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response interceptor for better error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response?.data || error.message)
        return Promise.reject(error)
    }
)

export const candidateAPI = {
    getAll: (filters = {}) => {
        const params = new URLSearchParams()
        if (filters.search) params.append('search', filters.search)
        if (filters.status) params.append('status', filters.status)

        return api.get(`/candidates?${params.toString()}`)
    },

    create: (candidateData) => {
        const formData = new FormData()

        // Append all fields to FormData
        Object.keys(candidateData).forEach(key => {
            if (candidateData[key] !== null && candidateData[key] !== undefined) {
                formData.append(key, candidateData[key])
            }
        })

        return api.post('/candidates', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    },

    updateStatus: (id, status) => {
        return api.put(`/candidates/${id}/status`, { status })
    },

    delete: (id) => {
        return api.delete(`/candidates/${id}`)
    },

    getStats: () => {
        return api.get('/candidates/stats')
    }
}

export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData)
}

export default api