import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';
import { ENDPOINTS } from '../../api/endpoints';
import { updateMe } from './patientSlice';

// ─── Async Thunks ─────────────────────────────────────────────────────────────

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await apiClient.post(ENDPOINTS.auth.login, credentials);
      // Persist token and user data
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
      }
      if (data.userData) {
        localStorage.setItem('user_data', JSON.stringify(data.userData));
      }
      return data; // { token, userData: { user_id, name_en, name_ar, email, role, ... } }
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      return await apiClient.post(ENDPOINTS.auth.register, userData);
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

// Platform admin "support login" as a specific clinic's admin. Stashes the
// platform admin's own session in sessionStorage so returnFromImpersonation
// can restore it later.
export const impersonateClinicAdmin = createAsyncThunk(
  'auth/impersonate',
  async ({ clinicId, adminId, clinicName }, { rejectWithValue }) => {
    try {
      const data = await apiClient.post(
        ENDPOINTS.platform.impersonate(clinicId),
        adminId ? { admin_id: adminId } : {}
      );

      const currentToken = localStorage.getItem('auth_token');
      const currentUser = localStorage.getItem('user_data');
      if (currentToken) sessionStorage.setItem('platform_return_token', currentToken);
      if (currentUser) sessionStorage.setItem('platform_return_user', currentUser);
      sessionStorage.setItem('platform_return_clinic_name', clinicName || '');

      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user_data', JSON.stringify(data.userData));
      return data;
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

// Restores the platform admin's own session after an impersonation session.
export const returnFromImpersonation = createAsyncThunk(
  'auth/returnFromImpersonation',
  async (_, { rejectWithValue }) => {
    const token = sessionStorage.getItem('platform_return_token');
    const userStr = sessionStorage.getItem('platform_return_user');
    if (!token || !userStr) {
      return rejectWithValue({ message: 'No platform session to return to' });
    }
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user_data', userStr);
    sessionStorage.removeItem('platform_return_token');
    sessionStorage.removeItem('platform_return_user');
    sessionStorage.removeItem('platform_return_clinic_name');
    return { token, userData: JSON.parse(userStr) };
  }
);

// Self-service completion of a platform-admin-forced password reset. The
// user is already authenticated (they logged in with the temp password) -
// this just replaces it and clears the must_reset_password flag.
export const completePasswordReset = createAsyncThunk(
  'auth/completePasswordReset',
  async (newPassword, { rejectWithValue }) => {
    try {
      return await apiClient.put(ENDPOINTS.auth.completePasswordReset, { new_password: newPassword });
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const storedUser = localStorage.getItem('user_data');
const parsedUser = storedUser ? JSON.parse(storedUser) : null;

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: parsedUser,          // { user_id, name_en, name_ar, email, role, ... }
    token: localStorage.getItem('auth_token') || null,
    role: parsedUser?.role || null,  // 'patient' | 'doctor' | 'admin'
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => { state.error = null; },
    setUser: (state, action) => { state.user = action.payload; },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(loginUser.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.token = payload.token;
        s.user = payload.userData;
        s.role = payload.userData?.role;
      })
      .addCase(loginUser.rejected, (s, { payload }) => {
        s.loading = false;
        s.error = payload?.message || 'Login failed';
      });

    // Logout
    builder.addCase(logoutUser.fulfilled, (s) => {
      s.user = null;
      s.token = null;
      s.role = null;
    });

    // Impersonation start/end - same shape as login
    builder
      .addCase(impersonateClinicAdmin.fulfilled, (s, { payload }) => {
        s.token = payload.token;
        s.user = payload.userData;
        s.role = payload.userData?.role;
      })
      .addCase(returnFromImpersonation.fulfilled, (s, { payload }) => {
        s.token = payload.token;
        s.user = payload.userData;
        s.role = payload.userData?.role;
      });

    // Register
    builder
      .addCase(registerUser.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(registerUser.fulfilled, (s) => { s.loading = false; })
      .addCase(registerUser.rejected, (s, { payload }) => {
        s.loading = false;
        s.error = payload?.message || 'Registration failed';
      });

    // Forced password reset completed - clear the flag locally so the app
    // stops redirecting to the reset-required screen.
    builder.addCase(completePasswordReset.fulfilled, (s) => {
      if (s.user) {
        s.user = { ...s.user, must_reset_password: false };
        localStorage.setItem('user_data', JSON.stringify(s.user));
      }
    });

    // Update Profile (Sync with Patient Update)
    builder.addCase(updateMe.fulfilled, (s, { payload }) => {
      const updatedData = payload.data || payload;
      // Merge updated fields into current user object
      if (s.user) {
        s.user = { ...s.user, ...updatedData };
        // Sync with localStorage
        localStorage.setItem('user_data', JSON.stringify(s.user));
      }
    });
  },
});

export const { clearError, setUser } = authSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectUserRole = (state) => state.auth.role;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectIsLoggedIn = (state) => !!state.auth.token;

export default authSlice.reducer;
