import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';
import { ENDPOINTS } from '../../api/endpoints';

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const fetchAppointments = createAsyncThunk(
  'appointments/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const getappointments = await apiClient.get(ENDPOINTS.patients.getPatientAppointments, { params });
      console.log("appts", getappointments)
      return getappointments;
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

export const fetchAllAppointments = createAsyncThunk(
  'appointments/fetchAllAdmin',
  async (_, { rejectWithValue }) => {
    try {
      return await apiClient.get(ENDPOINTS.appointments.getAllAppointments);
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

export const fetchAppointmentById = createAsyncThunk(
  'appointments/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      return await apiClient.get(ENDPOINTS.appointments.getAppointmentById(id));
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

export const fetchNextAppointment = createAsyncThunk(
  'appointments/fetchNext',
  async (_, { rejectWithValue }) => {
    try {
      return await apiClient.get(ENDPOINTS.patients.getNextAppointment);
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

export const fetchDoctorAppointments = createAsyncThunk(
  'appointments/fetchDoctor',
  async (_, { rejectWithValue }) => {
    try {
      return await apiClient.get(ENDPOINTS.doctors.getDoctorAppointments);
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

export const fetchMyPatientsByDate = createAsyncThunk(
  'appointments/fetchMyPatientsByDate',
  async (date, { rejectWithValue }) => {
    try {
      return await apiClient.get(ENDPOINTS.doctors.getMyPatientsByDate(date));
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────


const appointmentSlice = createSlice({
  name: 'appointments',
  initialState: {
    list: [],
    selected: null,
    nextAppointment: null,
    doctorAppointments: [],
    patientsByDate: [],
    total: 0,
    loading: false,
    error: null,
    bookingDraft: {
      doctorId: null,
      doctorName: null,
      doctorSpecialization: null,
      doctorAvatar: null,
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
    clearAppointmentError: (state) => { state.error = null; },
    setSelectedAppt: (state, action) => { state.selected = action.payload; },
    updateBookingDraft: (state, action) => {
      state.bookingDraft = { ...state.bookingDraft, ...action.payload };
    },
    clearBookingDraft: (state) => {
      state.bookingDraft = {
        doctorId: null,
        doctorName: null,
        doctorSpecialization: null,
        doctorAvatar: null,
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
      .addCase(fetchAppointments.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchAppointments.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.list = payload?.appointments ?? payload?.data ?? (Array.isArray(payload) ? payload : []);
        s.total = payload?.total ?? s.list.length;
      })
      .addCase(fetchAppointments.rejected, (s, { payload }) => {
        s.loading = false;
        s.error = payload?.message || 'Failed to load appointments';
      });

    builder
      .addCase(fetchAllAppointments.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchAllAppointments.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.list = payload?.appointments ?? payload?.data ?? (Array.isArray(payload) ? payload : []);
        s.total = payload?.total ?? s.list.length;
      })
      .addCase(fetchAllAppointments.rejected, (s, { payload }) => {
        s.loading = false;
        s.error = payload?.message || 'Failed to load all appointments';
      });

    builder
      .addCase(fetchAppointmentById.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchAppointmentById.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.selected = payload?.data ?? payload ?? null;
      })
      .addCase(fetchAppointmentById.rejected, (s, { payload }) => {
        s.loading = false;
        s.error = payload?.message || 'Failed to load appointment details';
      });

    builder
      .addCase(fetchNextAppointment.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchNextAppointment.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.nextAppointment = payload?.data ?? payload ?? null;
      })
      .addCase(fetchNextAppointment.rejected, (s, { payload }) => {
        s.loading = false;
        s.error = payload?.message || 'Failed to load next appointment';
      });

    builder
      .addCase(fetchDoctorAppointments.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchDoctorAppointments.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.doctorAppointments = payload?.appointments ?? payload?.data ?? (Array.isArray(payload) ? payload : []);
      })
      .addCase(fetchDoctorAppointments.rejected, (s, { payload }) => {
        s.loading = false;
        s.error = payload?.message || 'Failed to load doctor appointments';
      });

    builder
      .addCase(fetchMyPatientsByDate.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchMyPatientsByDate.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.patientsByDate = payload?.appointments ?? payload?.data ?? (Array.isArray(payload) ? payload : []);
      })
      .addCase(fetchMyPatientsByDate.rejected, (s, { payload }) => {
        s.loading = false;
        s.error = payload?.message || 'Failed to load patients for the selected date';
      });

    builder
      .addCase(createAppointment.pending, (s) => { s.loading = true; })
      .addCase(createAppointment.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.list.unshift(payload);
      })
      .addCase(createAppointment.rejected, (s, { payload }) => {
        s.loading = false;
        s.error = payload?.message || 'Failed to book appointment';
      });

    builder.addCase(cancelAppointment.fulfilled, (s, { payload: id }) => {
      const appt = s.list.find((a) => (a.id ?? a.appointment_id) === id);
      if (appt) appt.status = 'cancelled';
    });
  },
});

export const { clearAppointmentError, setSelectedAppt, updateBookingDraft, clearBookingDraft } = appointmentSlice.actions;

// Selectors
export const selectAppointments = (state) => state.appointments.list;
export const selectSelectedAppt = (state) => state.appointments.selected;
export const selectNextAppointment = (state) => state.appointments.nextAppointment;
export const selectDoctorAppointments = (state) => state.appointments.doctorAppointments;
export const selectPatientsByDate = (state) => state.appointments.patientsByDate;
export const selectAppointmentsLoading = (state) => state.appointments.loading;
export const selectAppointmentsError = (state) => state.appointments.error;
export const selectBookingDraft = (state) => state.appointments.bookingDraft;

export default appointmentSlice.reducer;
