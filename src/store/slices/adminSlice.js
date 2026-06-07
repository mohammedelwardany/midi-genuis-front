import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';
import { ENDPOINTS } from '../../api/endpoints';

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const fetchAdminDashboardMetrics = createAsyncThunk(
  'admin/fetchDashboardMetrics',
  async (_, { rejectWithValue }) => {
    try {
      return await apiClient.get(ENDPOINTS.adminDashboard.metrics);
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

export const fetchDoctorRevenues = createAsyncThunk(
  'admin/fetchDoctorRevenues',
  async (_, { rejectWithValue }) => {
    try {
      return await apiClient.get(ENDPOINTS.adminDashboard.doctorRevenues);
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

export const fetchMonthlyRevenues = createAsyncThunk(
  'admin/fetchMonthlyRevenues',
  async (_, { rejectWithValue }) => {
    try {
      return await apiClient.get(ENDPOINTS.adminDashboard.monthlyRevenues);
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

export const fetchAdminStats = createAsyncThunk(
  'admin/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      return await apiClient.get(ENDPOINTS.admin.stats);
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

export const fetchAdminUsers = createAsyncThunk(
  'admin/fetchUsers',
  async (params, { rejectWithValue }) => {
    try {
      return await apiClient.get(ENDPOINTS.admin.users, { params });
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

export const createUser = createAsyncThunk(
  'admin/createUser',
  async (userData, { rejectWithValue }) => {
    try {
      return await apiClient.post(ENDPOINTS.admin.users, userData);
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

export const deleteUser = createAsyncThunk(
  'admin/deleteUser',
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.del(ENDPOINTS.admin.userById(id));
      return id;
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

export const updateAdminSettings = createAsyncThunk(
  'admin/updateSettings',
  async (settings, { rejectWithValue }) => {
    try {
      return await apiClient.put(ENDPOINTS.admin.settings, settings);
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    stats:            null,     // { totalPatients, activeDoctors, visitsThisMonth, revenue }
    users:            [],
    total:            0,
    settings:         null,
    loading:          false,
    error:            null,
    dashboardMetrics: null,
    doctorRevenues:   [],
    monthlyRevenues:  [],
  },
  reducers: {
    clearAdminError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminDashboardMetrics.pending,   (s) => { s.loading = true;  s.error = null; })
      .addCase(fetchAdminDashboardMetrics.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.dashboardMetrics = Array.isArray(payload) ? payload[0] : payload;
      })
      .addCase(fetchAdminDashboardMetrics.rejected,  (s, { payload }) => {
        s.loading = false;
        s.error   = payload?.message || 'Failed to load dashboard metrics';
      });

    builder
      .addCase(fetchDoctorRevenues.pending,   (s) => { s.loading = true;  s.error = null; })
      .addCase(fetchDoctorRevenues.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.doctorRevenues = payload;
      })
      .addCase(fetchDoctorRevenues.rejected,  (s, { payload }) => {
        s.loading = false;
        s.error   = payload?.message || 'Failed to load doctor revenues';
      });

    builder
      .addCase(fetchMonthlyRevenues.pending,   (s) => { s.loading = true;  s.error = null; })
      .addCase(fetchMonthlyRevenues.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.monthlyRevenues = payload;
      })
      .addCase(fetchMonthlyRevenues.rejected,  (s, { payload }) => {
        s.loading = false;
        s.error   = payload?.message || 'Failed to load monthly revenues';
      });

    builder
      .addCase(fetchAdminStats.pending,   (s) => { s.loading = true;  s.error = null; })
      .addCase(fetchAdminStats.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.stats   = payload;
      })
      .addCase(fetchAdminStats.rejected,  (s, { payload }) => {
        s.loading = false;
        s.error   = payload?.message || 'Failed to load stats';
      });

    builder
      .addCase(fetchAdminUsers.pending,   (s) => { s.loading = true;  s.error = null; })
      .addCase(fetchAdminUsers.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.users   = payload.data  ?? payload;
        s.total   = payload.total ?? payload.length;
      })
      .addCase(fetchAdminUsers.rejected,  (s, { payload }) => {
        s.loading = false;
        s.error   = payload?.message || 'Failed to load users';
      });

    builder
      .addCase(createUser.pending,   (s) => { s.loading = true; })
      .addCase(createUser.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.users.unshift(payload);
      })
      .addCase(createUser.rejected,  (s, { payload }) => {
        s.loading = false;
        s.error   = payload?.message || 'Failed to create user';
      });

    builder.addCase(deleteUser.fulfilled, (s, { payload: id }) => {
      s.users = s.users.filter((u) => u.id !== id);
    });

    builder.addCase(updateAdminSettings.fulfilled, (s, { payload }) => {
      s.settings = payload;
    });
  },
});

export const { clearAdminError } = adminSlice.actions;

// Selectors
export const selectAdminStats            = (state) => state.admin.stats;
export const selectAdminUsers            = (state) => state.admin.users;
export const selectAdminTotal            = (state) => state.admin.total;
export const selectAdminSettings         = (state) => state.admin.settings;
export const selectAdminLoading          = (state) => state.admin.loading;
export const selectAdminError            = (state) => state.admin.error;
export const selectAdminDashboardMetrics = (state) => state.admin.dashboardMetrics;
export const selectDoctorRevenues        = (state) => state.admin.doctorRevenues;
export const selectMonthlyRevenues       = (state) => state.admin.monthlyRevenues;

export default adminSlice.reducer;
