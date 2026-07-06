import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';
import { ENDPOINTS } from '../../api/endpoints';

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const fetchPlatformMetrics = createAsyncThunk(
  'platform/fetchMetrics',
  async (_, { rejectWithValue }) => {
    try {
      return await apiClient.get(ENDPOINTS.platform.metrics);
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

export const fetchAllClinics = createAsyncThunk(
  'platform/fetchAllClinics',
  async (_, { rejectWithValue }) => {
    try {
      return await apiClient.get(ENDPOINTS.platform.clinics);
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

export const fetchClinicById = createAsyncThunk(
  'platform/fetchClinicById',
  async (id, { rejectWithValue }) => {
    try {
      return await apiClient.get(ENDPOINTS.platform.clinicById(id));
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

export const createClinic = createAsyncThunk(
  'platform/createClinic',
  async (clinicData, { rejectWithValue }) => {
    try {
      return await apiClient.post(ENDPOINTS.platform.clinics, clinicData);
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

export const updateClinic = createAsyncThunk(
  'platform/updateClinic',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await apiClient.put(ENDPOINTS.platform.clinicById(id), data);
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

export const addClinicAdmin = createAsyncThunk(
  'platform/addClinicAdmin',
  async ({ id, admin }, { rejectWithValue }) => {
    try {
      return await apiClient.post(ENDPOINTS.platform.addClinicAdmin(id), admin);
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

export const updateSubscription = createAsyncThunk(
  'platform/updateSubscription',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await apiClient.put(ENDPOINTS.platform.updateSubscription(id), data);
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

export const updateClinicStatus = createAsyncThunk(
  'platform/updateClinicStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      return await apiClient.put(ENDPOINTS.platform.updateClinicStatus(id), { status });
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const platformSlice = createSlice({
  name: 'platform',
  initialState: {
    metrics: null,
    clinics: [],
    selectedClinic: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearPlatformError: (state) => { state.error = null; },
    clearSelectedClinic: (state) => { state.selectedClinic = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlatformMetrics.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchPlatformMetrics.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.metrics = payload;
      })
      .addCase(fetchPlatformMetrics.rejected, (s, { payload }) => {
        s.loading = false;
        s.error = payload?.message || 'Failed to load platform metrics';
      });

    builder
      .addCase(fetchAllClinics.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchAllClinics.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.clinics = payload;
      })
      .addCase(fetchAllClinics.rejected, (s, { payload }) => {
        s.loading = false;
        s.error = payload?.message || 'Failed to load clinics';
      });

    builder
      .addCase(fetchClinicById.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchClinicById.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.selectedClinic = payload;
      })
      .addCase(fetchClinicById.rejected, (s, { payload }) => {
        s.loading = false;
        s.error = payload?.message || 'Failed to load clinic';
      });

    builder
      .addCase(createClinic.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(createClinic.fulfilled, (s, { payload }) => {
        s.loading = false;
        if (payload?.clinic) s.clinics.unshift(payload.clinic);
      })
      .addCase(createClinic.rejected, (s, { payload }) => {
        s.loading = false;
        s.error = payload?.message || 'Failed to create clinic';
      });

    builder
      .addCase(updateClinic.fulfilled, (s, { payload }) => {
        if (s.selectedClinic) s.selectedClinic = { ...s.selectedClinic, ...payload.clinic };
      })
      .addCase(updateClinic.rejected, (s, { payload }) => {
        s.error = payload?.message || 'Failed to update clinic';
      });

    builder
      .addCase(addClinicAdmin.fulfilled, (s, { payload }) => {
        if (s.selectedClinic) {
          s.selectedClinic.admins = [...(s.selectedClinic.admins || []), payload.admin];
        }
      })
      .addCase(addClinicAdmin.rejected, (s, { payload }) => {
        s.error = payload?.message || 'Failed to add clinic admin';
      });

    builder
      .addCase(updateSubscription.fulfilled, (s, { payload }) => {
        if (s.selectedClinic) {
          s.selectedClinic = {
            ...s.selectedClinic,
            plan_name: payload.subscription.plan_name,
            max_doctors: payload.subscription.max_doctors,
            subscription_status: payload.subscription.status,
            renews_at: payload.subscription.renews_at,
          };
        }
      })
      .addCase(updateSubscription.rejected, (s, { payload }) => {
        s.error = payload?.message || 'Failed to update subscription';
      });

    builder
      .addCase(updateClinicStatus.fulfilled, (s, { payload }) => {
        if (s.selectedClinic) s.selectedClinic = { ...s.selectedClinic, status: payload.clinic.status };
        const idx = s.clinics.findIndex((c) => c.id === payload.clinic.id);
        if (idx !== -1) s.clinics[idx] = { ...s.clinics[idx], status: payload.clinic.status };
      })
      .addCase(updateClinicStatus.rejected, (s, { payload }) => {
        s.error = payload?.message || 'Failed to update clinic status';
      });
  },
});

export const { clearPlatformError, clearSelectedClinic } = platformSlice.actions;

// Selectors
export const selectPlatformMetrics = (state) => state.platform.metrics;
export const selectClinics = (state) => state.platform.clinics;
export const selectSelectedClinic = (state) => state.platform.selectedClinic;
export const selectPlatformLoading = (state) => state.platform.loading;
export const selectPlatformError = (state) => state.platform.error;

export default platformSlice.reducer;
