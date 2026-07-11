import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';
import { ENDPOINTS } from '../../api/endpoints';

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async ({ page = 1, pageSize = 10 } = {}, { rejectWithValue }) => {
    try {
      return await apiClient.get(ENDPOINTS.notifications.list, { params: { page, page_size: pageSize } });
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

export const fetchUnreadCount = createAsyncThunk(
  'notifications/fetchUnreadCount',
  async (_, { rejectWithValue }) => {
    try {
      return await apiClient.get(ENDPOINTS.notifications.unreadCount);
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

export const markNotificationRead = createAsyncThunk(
  'notifications/markNotificationRead',
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.put(ENDPOINTS.notifications.markRead(id));
      return { id };
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

export const markAllNotificationsRead = createAsyncThunk(
  'notifications/markAllNotificationsRead',
  async (_, { rejectWithValue }) => {
    try {
      await apiClient.put(ENDPOINTS.notifications.markAllRead);
      return {};
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    items: [],
    total: 0,
    unreadCount: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearNotificationError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchNotifications.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.items = payload.notifications;
        s.total = payload.total;
      })
      .addCase(fetchNotifications.rejected, (s, { payload }) => {
        s.loading = false;
        s.error = payload?.message || 'Failed to load notifications';
      });

    builder
      .addCase(fetchUnreadCount.fulfilled, (s, { payload }) => {
        s.unreadCount = payload.count;
      });

    builder
      .addCase(markNotificationRead.fulfilled, (s, { payload }) => {
        const item = s.items.find((n) => n.id === payload.id);
        if (item && !item.is_read) {
          item.is_read = true;
          s.unreadCount = Math.max(0, s.unreadCount - 1);
        }
      });

    builder
      .addCase(markAllNotificationsRead.fulfilled, (s) => {
        s.items.forEach((n) => { n.is_read = true; });
        s.unreadCount = 0;
      });
  },
});

export const { clearNotificationError } = notificationSlice.actions;

// Selectors
export const selectNotifications = (state) => state.notifications.items;
export const selectNotificationsTotal = (state) => state.notifications.total;
export const selectUnreadCount = (state) => state.notifications.unreadCount;
export const selectNotificationsLoading = (state) => state.notifications.loading;
export const selectNotificationsError = (state) => state.notifications.error;

export default notificationSlice.reducer;
