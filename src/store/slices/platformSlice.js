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

export const deleteClinicAdmin = createAsyncThunk(
  'platform/deleteClinicAdmin',
  async (adminId, { rejectWithValue }) => {
    try {
      await apiClient.del(ENDPOINTS.platform.deleteClinicAdmin(adminId));
      return { adminId };
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

export const resetAdminPassword = createAsyncThunk(
  'platform/resetAdminPassword',
  async (adminId, { rejectWithValue }) => {
    try {
      return await apiClient.put(ENDPOINTS.platform.resetAdminPassword(adminId));
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

export const updateClinicBranding = createAsyncThunk(
  'platform/updateClinicBranding',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await apiClient.put(ENDPOINTS.platform.updateClinicBranding(id), data);
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

export const uploadClinicLogo = createAsyncThunk(
  'platform/uploadClinicLogo',
  async ({ id, file }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('logo', file);
      return await apiClient.post(ENDPOINTS.platform.uploadClinicLogo(id), formData);
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

export const fetchPlatformAdmins = createAsyncThunk(
  'platform/fetchPlatformAdmins',
  async (_, { rejectWithValue }) => {
    try {
      return await apiClient.get(ENDPOINTS.platform.platformAdmins);
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

export const createPlatformAdmin = createAsyncThunk(
  'platform/createPlatformAdmin',
  async (adminData, { rejectWithValue }) => {
    try {
      return await apiClient.post(ENDPOINTS.platform.platformAdmins, adminData);
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

export const updatePlatformAdminStatus = createAsyncThunk(
  'platform/updatePlatformAdminStatus',
  async ({ id, active }, { rejectWithValue }) => {
    try {
      return await apiClient.put(ENDPOINTS.platform.platformAdminStatus(id), { active });
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

export const changeOwnPassword = createAsyncThunk(
  'platform/changeOwnPassword',
  async ({ current_password, new_password }, { rejectWithValue }) => {
    try {
      return await apiClient.put(ENDPOINTS.platform.changeOwnPassword, { current_password, new_password });
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

export const fetchAuditLogs = createAsyncThunk(
  'platform/fetchAuditLogs',
  async ({ clinicId, page = 1, pageSize = 20 } = {}, { rejectWithValue }) => {
    try {
      const params = { page, page_size: pageSize, ...(clinicId ? { clinic_id: clinicId } : {}) };
      return await apiClient.get(ENDPOINTS.platform.auditLogs, { params });
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

export const fetchSubscriptionPlans = createAsyncThunk(
  'platform/fetchSubscriptionPlans',
  async (_, { rejectWithValue }) => {
    try {
      return await apiClient.get(ENDPOINTS.platform.subscriptionPlans);
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

export const createSubscriptionPlan = createAsyncThunk(
  'platform/createSubscriptionPlan',
  async (planData, { rejectWithValue }) => {
    try {
      return await apiClient.post(ENDPOINTS.platform.subscriptionPlans, planData);
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

export const updateSubscriptionPlan = createAsyncThunk(
  'platform/updateSubscriptionPlan',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await apiClient.put(ENDPOINTS.platform.subscriptionPlanById(id), data);
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

export const updateSubscriptionPlanStatus = createAsyncThunk(
  'platform/updateSubscriptionPlanStatus',
  async ({ id, active }, { rejectWithValue }) => {
    try {
      return await apiClient.put(ENDPOINTS.platform.subscriptionPlanStatus(id), { active });
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
    platformAdmins: [],
    auditLogs: [],
    auditLogsTotal: 0,
    auditLogsPage: 1,
    auditLogsPageSize: 20,
    auditLogsTotalPages: 1,
    subscriptionPlans: [],
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
      .addCase(deleteClinicAdmin.fulfilled, (s, { payload }) => {
        if (s.selectedClinic) {
          s.selectedClinic.admins = (s.selectedClinic.admins || []).filter((a) => a.id !== payload.adminId);
        }
      })
      .addCase(deleteClinicAdmin.rejected, (s, { payload }) => {
        s.error = payload?.message || 'Failed to delete clinic admin';
      });

    builder
      .addCase(updateSubscription.fulfilled, (s, { payload }) => {
        if (s.selectedClinic) {
          s.selectedClinic = {
            ...s.selectedClinic,
            plan_id: payload.subscription.plan_id,
            plan_name: payload.subscription.plan_name,
            max_doctors: payload.subscription.max_doctors,
            max_patients: payload.subscription.max_patients,
            max_monthly_appointments: payload.subscription.max_monthly_appointments,
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
        if (s.selectedClinic) s.selectedClinic = { ...s.selectedClinic, subscription_status: payload.clinic.subscription_status };
        const idx = s.clinics.findIndex((c) => c.id === payload.clinic.id);
        if (idx !== -1) s.clinics[idx] = { ...s.clinics[idx], subscription_status: payload.clinic.subscription_status };
      })
      .addCase(updateClinicStatus.rejected, (s, { payload }) => {
        s.error = payload?.message || 'Failed to update clinic status';
      });

    builder
      .addCase(updateClinicBranding.fulfilled, (s, { payload }) => {
        if (s.selectedClinic) s.selectedClinic = { ...s.selectedClinic, branding: payload.clinic.branding };
      })
      .addCase(updateClinicBranding.rejected, (s, { payload }) => {
        s.error = payload?.message || 'Failed to update clinic branding';
      });

    builder
      .addCase(uploadClinicLogo.fulfilled, (s, { payload }) => {
        if (s.selectedClinic) s.selectedClinic = { ...s.selectedClinic, branding: payload.clinic.branding };
      })
      .addCase(uploadClinicLogo.rejected, (s, { payload }) => {
        s.error = payload?.message || 'Failed to upload clinic logo';
      });

    builder
      .addCase(fetchPlatformAdmins.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchPlatformAdmins.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.platformAdmins = payload;
      })
      .addCase(fetchPlatformAdmins.rejected, (s, { payload }) => {
        s.loading = false;
        s.error = payload?.message || 'Failed to load platform admins';
      });

    builder
      .addCase(createPlatformAdmin.fulfilled, (s, { payload }) => {
        s.platformAdmins.unshift(payload.admin);
      })
      .addCase(createPlatformAdmin.rejected, (s, { payload }) => {
        s.error = payload?.message || 'Failed to create platform admin';
      });

    builder
      .addCase(updatePlatformAdminStatus.fulfilled, (s, { payload }) => {
        const idx = s.platformAdmins.findIndex((a) => a.id === payload.admin.id);
        if (idx !== -1) s.platformAdmins[idx] = { ...s.platformAdmins[idx], active: payload.admin.active };
      })
      .addCase(updatePlatformAdminStatus.rejected, (s, { payload }) => {
        s.error = payload?.message || 'Failed to update platform admin status';
      });

    builder
      .addCase(fetchAuditLogs.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchAuditLogs.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.auditLogs = payload.logs;
        s.auditLogsTotal = payload.total;
        s.auditLogsPage = payload.page;
        s.auditLogsPageSize = payload.pageSize;
        s.auditLogsTotalPages = payload.totalPages;
      })
      .addCase(fetchAuditLogs.rejected, (s, { payload }) => {
        s.loading = false;
        s.error = payload?.message || 'Failed to load audit logs';
      });

    builder
      .addCase(fetchSubscriptionPlans.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchSubscriptionPlans.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.subscriptionPlans = payload;
      })
      .addCase(fetchSubscriptionPlans.rejected, (s, { payload }) => {
        s.loading = false;
        s.error = payload?.message || 'Failed to load subscription plans';
      });

    builder
      .addCase(createSubscriptionPlan.fulfilled, (s, { payload }) => {
        s.subscriptionPlans.unshift(payload.plan);
      })
      .addCase(createSubscriptionPlan.rejected, (s, { payload }) => {
        s.error = payload?.message || 'Failed to create subscription plan';
      });

    builder
      .addCase(updateSubscriptionPlan.fulfilled, (s, { payload }) => {
        const idx = s.subscriptionPlans.findIndex((p) => p.id === payload.plan.id);
        if (idx !== -1) s.subscriptionPlans[idx] = payload.plan;
      })
      .addCase(updateSubscriptionPlan.rejected, (s, { payload }) => {
        s.error = payload?.message || 'Failed to update subscription plan';
      });

    builder
      .addCase(updateSubscriptionPlanStatus.fulfilled, (s, { payload }) => {
        const idx = s.subscriptionPlans.findIndex((p) => p.id === payload.plan.id);
        if (idx !== -1) s.subscriptionPlans[idx] = payload.plan;
      })
      .addCase(updateSubscriptionPlanStatus.rejected, (s, { payload }) => {
        s.error = payload?.message || 'Failed to update subscription plan status';
      });
  },
});

export const { clearPlatformError, clearSelectedClinic } = platformSlice.actions;

// Selectors
export const selectPlatformMetrics = (state) => state.platform.metrics;
export const selectClinics = (state) => state.platform.clinics;
export const selectSelectedClinic = (state) => state.platform.selectedClinic;
export const selectPlatformAdmins = (state) => state.platform.platformAdmins;
export const selectAuditLogs = (state) => state.platform.auditLogs;
export const selectAuditLogsTotal = (state) => state.platform.auditLogsTotal;
export const selectAuditLogsPage = (state) => state.platform.auditLogsPage;
export const selectAuditLogsPageSize = (state) => state.platform.auditLogsPageSize;
export const selectAuditLogsTotalPages = (state) => state.platform.auditLogsTotalPages;
export const selectSubscriptionPlans = (state) => state.platform.subscriptionPlans;
export const selectPlatformLoading = (state) => state.platform.loading;
export const selectPlatformError = (state) => state.platform.error;

export default platformSlice.reducer;
