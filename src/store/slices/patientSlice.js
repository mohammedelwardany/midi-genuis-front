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

export const registerPatient = createAsyncThunk(
  'patients/register',
  async (patientData, { rejectWithValue }) => {
    try {
      return await apiClient.post(ENDPOINTS.patients.register, patientData);
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

export const addPatient = createAsyncThunk(
  'patients/addByAdmin',
  async (patientData, { rejectWithValue }) => {
    try {
      return await apiClient.post(ENDPOINTS.patients.addPatient, patientData);
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

export const updatePatient = createAsyncThunk(
  'patients/updateByAdmin',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await apiClient.put(ENDPOINTS.patients.update(id), data);
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

export const updateMe = createAsyncThunk(
  'patients/updateSelf',
  async (data, { rejectWithValue }) => {
    try {
      return await apiClient.put(ENDPOINTS.patients.updateMe, data);
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

export const deletePatient = createAsyncThunk(
  'patients/deleteByAdmin',
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.del(ENDPOINTS.patients.delete(id));
      return id;
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

export const deleteMe = createAsyncThunk(
  'patients/deleteSelf',
  async (_, { rejectWithValue }) => {
    try {
      return await apiClient.del(ENDPOINTS.patients.deleteMe);
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

export const fetchMyReports = createAsyncThunk(
  'patients/fetchReports',
  async (_, { rejectWithValue }) => {
    try {
      return await apiClient.get(ENDPOINTS.patients.getMyReports);
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

export const uploadReport = createAsyncThunk(
  'patients/uploadReport',
  async (formData, { rejectWithValue }) => {
    try {
      const patientId = formData.get('patient_id');
      const endpoint = patientId ? `${ENDPOINTS.patients.uploadReport}/${patientId}` : ENDPOINTS.patients.uploadReport;
      return await apiClient.post(endpoint, formData);
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

export const deleteMyReport = createAsyncThunk(
  'patients/deleteReport',
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.del(ENDPOINTS.patients.deleteMyReport(id));
      return id;
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

// Admin/Doctor access to patient reports
export const fetchPatientReports = createAsyncThunk(
  'patients/fetchPatientReports',
  async (patientId, { rejectWithValue }) => {
    try {
      return await apiClient.get(ENDPOINTS.patients.getPatientReports(patientId));
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

export const deletePatientReport = createAsyncThunk(
  'patients/deletePatientReport',
  async ({ patientId, reportId }, { rejectWithValue }) => {
    try {
      await apiClient.del(ENDPOINTS.patients.deletePatientReport(patientId, reportId));
      return { patientId, reportId };
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

export const fetchDoctorAvailability = createAsyncThunk(
  'patients/fetchDoctorAvailability',
  async (doctorId, { rejectWithValue }) => {
    try {
      return await apiClient.get(ENDPOINTS.patients.getDoctorAvailability(doctorId));
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const patientSlice = createSlice({
  name: 'patients',
  initialState: {
    list: [],
    selected: null,
    reports: [],
    availability: [],
    total: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedPatient: (state) => { state.selected = null; },
    clearPatientError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    // ... basic patient CRUD ... (keeping existing logic implicit)
    builder
      .addCase(fetchPatients.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchPatients.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.list = payload.data ?? payload;
        s.total = payload.total ?? (Array.isArray(payload) ? payload.length : 0);
      })
      .addCase(fetchPatients.rejected, (s, { payload }) => {
        s.loading = false;
        s.error = payload?.message || 'Failed to load patients';
      });

    builder
      .addCase(fetchPatientById.fulfilled, (s, { payload }) => {
        s.selected = payload.data ?? payload;
      });

    builder
      .addCase(addPatient.fulfilled, (s, { payload }) => {
        const newPatient = payload.data ?? payload;
        s.list.push(newPatient);
      });

    builder
      .addCase(updatePatient.fulfilled, (s, { payload }) => {
        const updated = payload.updatedPatient ?? payload;
        const uid = updated.user_id || updated.id;
        const idx = s.list.findIndex(p => (p.user_id || p.id) === uid);
        if (idx !== -1) s.list[idx] = updated;
        if ((s.selected?.user_id || s.selected?.id) === uid) s.selected = updated;
      });

    builder
      .addCase(deletePatient.fulfilled, (s, { payload }) => {
        s.list = s.list.filter(p => (p.user_id || p.id) !== payload);
      });

    // Reports Management
    builder
      .addCase(fetchMyReports.pending, (s) => { s.loading = true; })
      .addCase(fetchMyReports.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.reports = payload.data || payload;
      })
      .addCase(fetchMyReports.rejected, (s, { payload }) => {
        s.loading = false;
        s.error = payload?.message || 'Failed to load reports';
      })
      .addCase(fetchPatientReports.pending, (s) => { s.loading = true; })
      .addCase(fetchPatientReports.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.reports = payload.data || payload;
      })
      .addCase(fetchPatientReports.rejected, (s, { payload }) => {
        s.loading = false;
        s.error = payload?.message || 'Failed to load patient reports';
      });

    builder
      .addCase(uploadReport.pending, (s) => { s.loading = true; })
      .addCase(uploadReport.fulfilled, (s, { payload }) => {
        s.loading = false;
        const newReport = payload.data || payload;
        s.reports.unshift(newReport);
      })
      .addCase(uploadReport.rejected, (s) => { s.loading = false; });

    builder
      .addCase(deleteMyReport.fulfilled, (s, { payload }) => {
        s.reports = s.reports.filter(r => (r.id !== payload && r.report_id !== payload));
      })
      .addCase(deletePatientReport.fulfilled, (s, { payload }) => {
        s.reports = s.reports.filter(r => (r.id !== payload.reportId && r.report_id !== payload.reportId));
      });

    builder
      .addCase(fetchDoctorAvailability.pending, (s) => { s.loading = true; })
      .addCase(fetchDoctorAvailability.fulfilled, (s, { payload }) => {
        s.loading = false;
        console.log("Doctor Availability", payload.data || payload);
        s.availability = payload.data || payload;
      })
      .addCase(fetchDoctorAvailability.rejected, (s, { payload }) => {
        s.loading = false;
        s.error = payload?.message || 'Failed to fetch doctor availability';
      });
  }
});

export const { clearSelectedPatient, clearPatientError } = patientSlice.actions;

// Selectors
export const selectPatients = (state) => state.patients.list;
export const selectSelectedPatient = (state) => state.patients.selected;
export const selectMyReports = (state) => state.patients.reports;
export const selectDoctorAvailability = (state) => state.patients.availability;
export const selectPatientsLoading = (state) => state.patients.loading;
export const selectPatientsError = (state) => state.patients.error;

export default patientSlice.reducer;
