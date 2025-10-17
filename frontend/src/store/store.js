import { configureStore } from '@reduxjs/toolkit'
import candidatesReducer from './slices/candidatesSlice'
import authReducer from './slices/authSlice'

export const store = configureStore({
    reducer: {
        candidates: candidatesReducer,
        auth: authReducer, // Make sure this line exists and is correct
    },
})