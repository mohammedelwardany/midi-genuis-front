import { configureStore } from '@reduxjs/toolkit';
import authReducer        from './slices/authSlice';
import patientReducer     from './slices/patientSlice';
import doctorReducer      from './slices/doctorSlice';
import adminReducer       from './slices/adminSlice';
import appointmentReducer from './slices/appointmentSlice';

const store = configureStore({
  reducer: {
    auth:         authReducer,
    patients:     patientReducer,
    doctors:      doctorReducer,
    admin:        adminReducer,
    appointments: appointmentReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
