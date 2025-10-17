import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authAPI } from '../../services/api'

// Helper function to get initial state from localStorage
const getInitialState = () => {
    const token = localStorage.getItem('token')
    const userStr = localStorage.getItem('user')

    let user = null
    if (userStr) {
        try {
            user = JSON.parse(userStr)
        } catch (error) {
            console.error('Failed to parse user from localStorage:', error)
            localStorage.removeItem('user')
        }
    }

    return {
        user,
        token,
        isAuthenticated: !!(token && user),
        loading: false,
        error: null,
        backendAvailable: true,
        initialized: false
    }
}

// Async thunks
export const login = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await authAPI.login(credentials)
            return response.data
        } catch (error) {
            if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
                return rejectWithValue({ message: 'Cannot connect to server. Please try again later.' })
            }
            return rejectWithValue(error.response?.data || { message: error.message })
        }
    }
)

export const register = createAsyncThunk(
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await authAPI.register(userData)
            return response.data
        } catch (error) {
            if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
                return rejectWithValue({ message: 'Cannot connect to server. Please try again later.' })
            }
            return rejectWithValue(error.response?.data || { message: error.message })
        }
    }
)

export const getMe = createAsyncThunk(
    'auth/getMe',
    async (_, { rejectWithValue }) => {
        try {
            const response = await authAPI.getMe()
            return response.data
        } catch (error) {
            // Clear invalid token
            localStorage.removeItem('token')
            localStorage.removeItem('user')

            if (error.response?.status === 404 || error.code === 'NETWORK_ERROR') {
                return rejectWithValue({ message: 'Server not available' })
            }
            return rejectWithValue(error.response?.data || { message: error.message })
        }
    }
)

export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await authAPI.logout()
        } catch (error) {
            console.warn('Logout API call failed, but clearing local state anyway')
        }
    }
)

const authSlice = createSlice({
    name: 'auth',
    initialState: getInitialState(),
    reducers: {
        clearError: (state) => {
            state.error = null
        },
        logoutSuccess: (state) => {
            state.user = null
            state.token = null
            state.isAuthenticated = false
            state.initialized = true
            localStorage.removeItem('token')
            localStorage.removeItem('user')
        },
        setBackendStatus: (state, action) => {
            state.backendAvailable = action.payload
        },
        initializeAuth: (state) => {
            state.initialized = true
        }
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(login.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false
                state.isAuthenticated = true
                state.user = action.payload.user
                state.token = action.payload.token
                state.backendAvailable = true
                state.initialized = true

                localStorage.setItem('token', action.payload.token)
                localStorage.setItem('user', JSON.stringify(action.payload.user))
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false
                state.isAuthenticated = false
                state.user = null
                state.token = null
                state.error = action.payload?.message || 'Login failed'
                state.backendAvailable = false
                state.initialized = true

                localStorage.removeItem('token')
                localStorage.removeItem('user')
            })
            // Register
            .addCase(register.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false
                state.isAuthenticated = true
                state.user = action.payload.user
                state.token = action.payload.token
                state.backendAvailable = true
                state.initialized = true

                localStorage.setItem('token', action.payload.token)
                localStorage.setItem('user', JSON.stringify(action.payload.user))
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false
                state.isAuthenticated = false
                state.user = null
                state.token = null
                state.error = action.payload?.message || 'Registration failed'
                state.backendAvailable = false
                state.initialized = true

                localStorage.removeItem('token')
                localStorage.removeItem('user')
            })
            // Get Me
            .addCase(getMe.pending, (state) => {
                state.loading = true
            })
            .addCase(getMe.fulfilled, (state, action) => {
                state.loading = false
                state.isAuthenticated = true
                state.user = action.payload.user
                state.backendAvailable = true
                state.initialized = true

                localStorage.setItem('user', JSON.stringify(action.payload.user))
            })
            .addCase(getMe.rejected, (state, action) => {
                state.loading = false
                state.isAuthenticated = false
                state.user = null
                state.token = null
                state.backendAvailable = false
                state.initialized = true

                localStorage.removeItem('token')
                localStorage.removeItem('user')
            })
            // Logout
            .addCase(logout.fulfilled, (state) => {
                state.user = null
                state.token = null
                state.isAuthenticated = false
                state.initialized = true

                localStorage.removeItem('token')
                localStorage.removeItem('user')
            })
            .addCase(logout.rejected, (state) => {
                state.user = null
                state.token = null
                state.isAuthenticated = false
                state.initialized = true

                localStorage.removeItem('token')
                localStorage.removeItem('user')
            })
    }
})

export const { clearError, logoutSuccess, setBackendStatus, initializeAuth } = authSlice.actions
export default authSlice.reducer