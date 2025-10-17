import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { candidateAPI } from '../../services/api'

// Async thunks
export const fetchCandidates = createAsyncThunk(
    'candidates/fetchCandidates',
    async (filters = {}, { rejectWithValue }) => {
        try {
            const response = await candidateAPI.getAll(filters)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message)
        }
    }
)

export const addCandidate = createAsyncThunk(
    'candidates/addCandidate',
    async (candidateData, { rejectWithValue }) => {
        try {
            const response = await candidateAPI.create(candidateData)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message)
        }
    }
)

export const updateCandidateStatus = createAsyncThunk(
    'candidates/updateStatus',
    async ({ id, status }, { rejectWithValue }) => {
        try {
            const response = await candidateAPI.updateStatus(id, status)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message)
        }
    }
)

export const deleteCandidate = createAsyncThunk(
    'candidates/deleteCandidate',
    async (id, { rejectWithValue }) => {
        try {
            await candidateAPI.delete(id)
            return id
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message)
        }
    }
)

export const fetchStats = createAsyncThunk(
    'candidates/fetchStats',
    async (_, { rejectWithValue }) => {
        try {
            const response = await candidateAPI.getStats()
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message)
        }
    }
)

const candidatesSlice = createSlice({
    name: 'candidates',
    initialState: {
        items: [],
        stats: {},
        loading: false,
        error: null,
        searchTerm: '',
        statusFilter: ''
    },
    reducers: {
        setSearchTerm: (state, action) => {
            state.searchTerm = action.payload
        },
        setStatusFilter: (state, action) => {
            state.statusFilter = action.payload
        },
        clearFilters: (state) => {
            state.searchTerm = ''
            state.statusFilter = ''
        },
        clearError: (state) => {
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch candidates
            .addCase(fetchCandidates.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchCandidates.fulfilled, (state, action) => {
                state.loading = false
                state.items = action.payload
            })
            .addCase(fetchCandidates.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload?.error || 'Failed to fetch candidates'
            })
            // Add candidate
            .addCase(addCandidate.pending, (state) => {
                state.error = null
            })
            .addCase(addCandidate.fulfilled, (state, action) => {
                state.items.unshift(action.payload)
            })
            .addCase(addCandidate.rejected, (state, action) => {
                state.error = action.payload?.error || action.payload?.errors?.[0]?.msg || 'Failed to add candidate'
            })
            // Update status
            .addCase(updateCandidateStatus.fulfilled, (state, action) => {
                const index = state.items.findIndex(item => item._id === action.payload._id)
                if (index !== -1) {
                    state.items[index] = action.payload
                }
            })
            .addCase(updateCandidateStatus.rejected, (state, action) => {
                state.error = action.payload?.error || 'Failed to update candidate status'
            })
            // Delete candidate
            .addCase(deleteCandidate.fulfilled, (state, action) => {
                state.items = state.items.filter(item => item._id !== action.payload)
            })
            .addCase(deleteCandidate.rejected, (state, action) => {
                state.error = action.payload?.error || 'Failed to delete candidate'
            })
            // Fetch stats
            .addCase(fetchStats.fulfilled, (state, action) => {
                state.stats = action.payload
            })
    }
})

export const { setSearchTerm, setStatusFilter, clearFilters, clearError } = candidatesSlice.actions
export default candidatesSlice.reducer