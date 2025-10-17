import axios from 'axios'

// Determine API base URL based on environment
const getApiBaseUrl = () => {
    // If we're in development, use localhost
    if (import.meta.env.DEV) {
        return 'https://candidate-referral-system-gamma.vercel.app/api'
    }

    // If we're in production, use the same domain (if backend is deployed with frontend)
    // Or use your backend deployment URL
    return 'https://candidate-referral-system-gamma.vercel.app/api'
}

const API_BASE_URL = getApiBaseUrl()

// For now, let's use a relative path since your backend might be at the same domain
// const API_BASE_URL = '/api'

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

// Response interceptor for auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token')
            window.location.href = '/login'
        }
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
    register: (userData) => api.post('/auth/register', userData),
    getMe: () => api.get('/auth/me'),
    logout: () => api.post('/auth/logout')
}

export default api