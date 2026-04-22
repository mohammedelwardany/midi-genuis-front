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

export const addDoctor = createAsyncThunk(
  'doctors/add',
  async (doctorData, { rejectWithValue }) => {
    try {
      return await apiClient.post(ENDPOINTS.doctors.add, doctorData);
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

export const updateDoctor = createAsyncThunk(
  'doctors/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await apiClient.put(ENDPOINTS.doctors.update(id), data);
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

export const deleteDoctor = createAsyncThunk(
  'doctors/delete',
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.del(ENDPOINTS.doctors.delete(id));
      return id;
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

export const addAvailability = createAsyncThunk(
  'doctors/addAvailability',
  async (data, { rejectWithValue }) => {
    try {
      return await apiClient.post(ENDPOINTS.doctors.addAvailability, data);
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

export const fetchUpcomingAvailability = createAsyncThunk(
  'doctors/fetchUpcomingAvailability',
  async (id, { rejectWithValue }) => {
    try {
      return await apiClient.get(ENDPOINTS.doctors.upcomingAvailability(id));
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

export const fetchTopDoctors = createAsyncThunk(
  'doctors/fetchTop',
  async (_, { rejectWithValue }) => {
    try {
      return await apiClient.get(ENDPOINTS.doctors.getTopDoctors);
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const doctorSlice = createSlice({
  name: 'doctors',
  initialState: {
    list:       [],
    topDoctors: [],
    selected:   null,
    schedule:   [],
    total:      0,
    loading:    false,
    error:      null,
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

    // Add Doctor
    builder
      .addCase(addDoctor.pending, (s) => { s.loading = true; })
      .addCase(addDoctor.fulfilled, (s, { payload }) => {
        s.loading = false;
        const newDoctor = payload.data ?? payload;
        s.list.push(newDoctor);
      })
      .addCase(addDoctor.rejected, (s, { payload }) => {
        s.loading = false;
        s.error = payload?.message || 'Failed to add doctor';
      });

    // Update Doctor
    builder
      .addCase(updateDoctor.pending, (s) => { s.loading = true; })
      .addCase(updateDoctor.fulfilled, (s, { payload }) => {
        s.loading = false;
        const updatedDoctor = payload.data ?? payload;
        const index = s.list.findIndex(d => d.id === updatedDoctor.id);
        if (index !== -1) s.list[index] = updatedDoctor;
        if (s.selected?.id === updatedDoctor.id) s.selected = updatedDoctor;
      })
      .addCase(updateDoctor.rejected, (s, { payload }) => {
        s.loading = false;
        s.error = payload?.message || 'Failed to update doctor';
      });

    // Delete Doctor
    builder
      .addCase(deleteDoctor.pending, (s) => { s.loading = true; })
      .addCase(deleteDoctor.fulfilled, (s, { payload: id }) => {
        s.loading = false;
        s.list = s.list.filter(d => d.id !== id);
      })
      .addCase(deleteDoctor.rejected, (s, { payload }) => {
        s.loading = false;
        s.error = payload?.message || 'Failed to delete doctor';
      });

    // Availability
    builder
      .addCase(fetchUpcomingAvailability.pending, (s) => { s.loading = true; })
      .addCase(fetchUpcomingAvailability.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.schedule = payload.data || payload;
      })
      .addCase(fetchUpcomingAvailability.rejected, (s, { payload }) => {
        s.loading = false;
        s.error = payload?.message || 'Failed to fetch availability';
      });

    builder
      .addCase(addAvailability.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(addAvailability.fulfilled, (state) => { state.loading = false; })
      .addCase(addAvailability.rejected, (state, { payload }) => { state.loading = false; state.error = payload?.message; });

    builder
      .addCase(fetchTopDoctors.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchTopDoctors.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.topDoctors = payload.data || payload;
      })
      .addCase(fetchTopDoctors.rejected, (s, { payload }) => {
        s.loading = false;
        s.error = payload?.message || 'Failed to load top doctors';
      });
  },
});

export const { clearSelectedDoctor, clearDoctorError } = doctorSlice.actions;

// Selectors
export const selectDoctors        = (state) => state.doctors.list;
export const selectTopDoctors     = (state) => state.doctors.topDoctors;
export const selectSelectedDoctor = (state) => state.doctors.selected;
export const selectDoctorSchedule = (state) => state.doctors.schedule;
export const selectDoctorsLoading = (state) => state.doctors.loading;
export const selectDoctorsError   = (state) => state.doctors.error;

export default doctorSlice.reducer;
