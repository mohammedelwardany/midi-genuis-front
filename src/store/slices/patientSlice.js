import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';
import { ENDPOINTS } from '../../api/endpoints';

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const fetchPatients = createAsyncThunk(
  'patients/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      return await apiClient.get(ENDPOINTS.patients.list, { params });
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

export const fetchPatientById = createAsyncThunk(
  'patients/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      return await apiClient.get(ENDPOINTS.patients.byId(id));
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

export const updatePatient = createAsyncThunk(
  'patients/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await apiClient.put(ENDPOINTS.patients.byId(id), data);
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const patientSlice = createSlice({
  name: 'patients',
  initialState: {
    list:     [],
    selected: null,   // currently viewed patient
    total:    0,
    loading:  false,
    error:    null,
  },
  reducers: {
    clearSelectedPatient: (state) => { state.selected = null; },
    clearPatientError:    (state) => { state.error    = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatients.pending,   (s) => { s.loading = true;  s.error = null; })
      .addCase(fetchPatients.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.list    = payload.data  ?? payload;
        s.total   = payload.total ?? payload.length;
      })
      .addCase(fetchPatients.rejected,  (s, { payload }) => {
        s.loading = false;
        s.error   = payload?.message || 'Failed to load patients';
      });

    builder
      .addCase(fetchPatientById.pending,   (s) => { s.loading = true; })
      .addCase(fetchPatientById.fulfilled, (s, { payload }) => {
        s.loading  = false;
        s.selected = payload;
      })
      .addCase(fetchPatientById.rejected,  (s, { payload }) => {
        s.loading = false;
        s.error   = payload?.message || 'Failed to load patient';
      });

    builder.addCase(updatePatient.fulfilled, (s, { payload }) => {
      const idx = s.list.findIndex((p) => p.id === payload.id);
      if (idx !== -1) s.list[idx] = payload;
      if (s.selected?.id === payload.id) s.selected = payload;
    });
  },
});

export const { clearSelectedPatient, clearPatientError } = patientSlice.actions;

// Selectors
export const selectPatients        = (state) => state.patients.list;
export const selectSelectedPatient = (state) => state.patients.selected;
export const selectPatientsLoading = (state) => state.patients.loading;
export const selectPatientsError   = (state) => state.patients.error;
export const selectPatientsTotal   = (state) => state.patients.total;

export default patientSlice.reducer;
