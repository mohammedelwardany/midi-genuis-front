import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';
import { ENDPOINTS } from '../../api/endpoints';

// ─── Async Thunks ─────────────────────────────────────────────────────────────

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await apiClient.post(ENDPOINTS.auth.login, credentials);
      // Persist token
      localStorage.setItem('auth_token', data.token);
      return data; // { token, user: { id, name, email, role } }
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await apiClient.post(ENDPOINTS.auth.logout, {});
    } catch {
      // Silent — we log out locally regardless
    } finally {
      localStorage.removeItem('auth_token');
    }
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

// ─── Slice ────────────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user:    null,          // { id, name, email, role }
    token:   localStorage.getItem('auth_token') || null,
    role:    null,          // 'patient' | 'doctor' | 'admin'
    loading: false,
    error:   null,
  },
  reducers: {
    clearError: (state) => { state.error = null; },
    setUser:    (state, action) => { state.user = action.payload; },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending,   (s) => { s.loading = true;  s.error = null; })
      .addCase(loginUser.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.token   = payload.token;
        s.user    = payload.user;
        s.role    = payload.user?.role;
      })
      .addCase(loginUser.rejected,  (s, { payload }) => {
        s.loading = false;
        s.error   = payload?.message || 'Login failed';
      });

    // Logout
    builder.addCase(logoutUser.fulfilled, (s) => {
      s.user  = null;
      s.token = null;
      s.role  = null;
    });

    // Register
    builder
      .addCase(registerUser.pending,   (s) => { s.loading = true;  s.error = null; })
      .addCase(registerUser.fulfilled, (s) => { s.loading = false; })
      .addCase(registerUser.rejected,  (s, { payload }) => {
        s.loading = false;
        s.error   = payload?.message || 'Registration failed';
      });
  },
});

export const { clearError, setUser } = authSlice.actions;

// Selectors
export const selectCurrentUser  = (state) => state.auth.user;
export const selectUserRole     = (state) => state.auth.role;
export const selectAuthLoading  = (state) => state.auth.loading;
export const selectAuthError    = (state) => state.auth.error;
export const selectIsLoggedIn   = (state) => !!state.auth.token;

export default authSlice.reducer;
