import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';
import { ENDPOINTS } from '../../api/endpoints';

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const fetchDoctors = createAsyncThunk(
  'doctors/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      return await apiClient.get(ENDPOINTS.doctors.list, { params });
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

export const fetchDoctorById = createAsyncThunk(
  'doctors/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      return await apiClient.get(ENDPOINTS.doctors.byId(id));
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

export const fetchDoctorSchedule = createAsyncThunk(
  'doctors/fetchSchedule',
  async (id, { rejectWithValue }) => {
    try {
      return await apiClient.get(ENDPOINTS.doctors.schedule(id));
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

export const updateDoctorSchedule = createAsyncThunk(
  'doctors/updateSchedule',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await apiClient.put(ENDPOINTS.doctors.schedule(id), data);
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const doctorSlice = createSlice({
  name: 'doctors',
  initialState: {
    list:     [],
    selected: null,
    schedule: [],
    total:    0,
    loading:  false,
    error:    null,
  },
  reducers: {
    clearSelectedDoctor: (state) => { state.selected = null; },
    clearDoctorError:    (state) => { state.error    = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctors.pending,   (s) => { s.loading = true;  s.error = null; })
      .addCase(fetchDoctors.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.list    = payload.data  ?? payload;
        s.total   = payload.total ?? payload.length;
      })
      .addCase(fetchDoctors.rejected,  (s, { payload }) => {
        s.loading = false;
        s.error   = payload?.message || 'Failed to load doctors';
      });

    builder
      .addCase(fetchDoctorById.pending,   (s) => { s.loading = true; })
      .addCase(fetchDoctorById.fulfilled, (s, { payload }) => {
        s.loading  = false;
        s.selected = payload;
      })
      .addCase(fetchDoctorById.rejected,  (s, { payload }) => {
        s.loading = false;
        s.error   = payload?.message || 'Failed to load doctor';
      });

    builder
      .addCase(fetchDoctorSchedule.pending,   (s) => { s.loading = true; })
      .addCase(fetchDoctorSchedule.fulfilled, (s, { payload }) => {
        s.loading  = false;
        s.schedule = payload;
      })
      .addCase(fetchDoctorSchedule.rejected,  (s, { payload }) => {
        s.loading = false;
        s.error   = payload?.message || 'Failed to load schedule';
      });

    builder.addCase(updateDoctorSchedule.fulfilled, (s, { payload }) => {
      s.schedule = payload;
    });
  },
});

export const { clearSelectedDoctor, clearDoctorError } = doctorSlice.actions;

// Selectors
export const selectDoctors        = (state) => state.doctors.list;
export const selectSelectedDoctor = (state) => state.doctors.selected;
export const selectDoctorSchedule = (state) => state.doctors.schedule;
export const selectDoctorsLoading = (state) => state.doctors.loading;
export const selectDoctorsError   = (state) => state.doctors.error;

export default doctorSlice.reducer;
