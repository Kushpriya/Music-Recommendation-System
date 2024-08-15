import { combineReducers } from 'redux'
import { alertSlice } from './alertSlice'
import { userSlice } from './userSlice'
import { configureStore } from '@reduxjs/toolkit'

const rootReducer = combineReducers({
    alerts: alertSlice.reducer,
    user: userSlice.reducer,
})

export const store = configureStore({ reducer: rootReducer ,})