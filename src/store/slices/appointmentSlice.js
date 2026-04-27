import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';
import { ENDPOINTS } from '../../api/endpoints';

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const fetchAppointments = createAsyncThunk(
  'appointments/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      return await apiClient.get(ENDPOINTS.appointments.list, { params });
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

export const createAppointment = createAsyncThunk(
  'appointments/create',
  async (payload, { rejectWithValue }) => {
    try {
      return await apiClient.post(ENDPOINTS.appointments.create, payload);
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

export const cancelAppointment = createAsyncThunk(
  'appointments/cancel',
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.put(ENDPOINTS.appointments.cancel(id), {});
      return id;
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState: {
    list:     [],
    selected: null,
    total:    0,
    loading:  false,
    error:    null,
    bookingDraft: {
      doctorId: null,
      selectedDate: null,
      selectedSlot: null,
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      reason: '',
      symptoms: '',
      reports: [],
      bookingType: 'consultation' // 'consultation' or 'followup'
    }
  },
  reducers: {
    clearAppointmentError: (state) => { state.error    = null; },
    setSelectedAppt:       (state, action) => { state.selected = action.payload; },
    updateBookingDraft:    (state, action) => { 
      state.bookingDraft = { ...state.bookingDraft, ...action.payload }; 
    },
    clearBookingDraft:     (state) => { 
      state.bookingDraft = {
        doctorId: null,
        selectedDate: null,
        selectedSlot: null,
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        reason: '',
        symptoms: '',
        reports: [],
        bookingType: 'consultation'
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointments.pending,   (s) => { s.loading = true;  s.error = null; })
      .addCase(fetchAppointments.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.list    = payload.data  ?? payload;
        s.total   = payload.total ?? payload.length;
      })
      .addCase(fetchAppointments.rejected,  (s, { payload }) => {
        s.loading = false;
        s.error   = payload?.message || 'Failed to load appointments';
      });

    builder
      .addCase(createAppointment.pending,   (s) => { s.loading = true; })
      .addCase(createAppointment.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.list.unshift(payload);
      })
      .addCase(createAppointment.rejected,  (s, { payload }) => {
        s.loading = false;
        s.error   = payload?.message || 'Failed to book appointment';
      });

    builder.addCase(cancelAppointment.fulfilled, (s, { payload: id }) => {
      const appt = s.list.find((a) => a.id === id);
      if (appt) appt.status = 'cancelled';
    });
  },
});

export const { clearAppointmentError, setSelectedAppt, updateBookingDraft, clearBookingDraft } = appointmentSlice.actions;

// Selectors
export const selectAppointments        = (state) => state.appointments.list;
export const selectSelectedAppt        = (state) => state.appointments.selected;
export const selectAppointmentsLoading = (state) => state.appointments.loading;
export const selectAppointmentsError   = (state) => state.appointments.error;
export const selectBookingDraft        = (state) => state.appointments.bookingDraft;

export default appointmentSlice.reducer;
