import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';
import { ENDPOINTS } from '../../api/endpoints';

export const initiatePayment = createAsyncThunk(
  'payments/initiate',
  async (payload, { rejectWithValue }) => {
    try {
      return await apiClient.post(ENDPOINTS.payments.initiate, payload);
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

export const uploadReceipt = createAsyncThunk(
  'payments/uploadReceipt',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      return await apiClient.post(ENDPOINTS.payments.uploadReceipt(id), formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

export const reviewPayment = createAsyncThunk(
  'payments/review',
  async (payload, { rejectWithValue }) => {
    try {
      return await apiClient.post(ENDPOINTS.payments.review, payload);
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

export const fetchAllPayments = createAsyncThunk(
  'payments/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await apiClient.get(ENDPOINTS.payments.getAllPayments);
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

export const fetchMyPayments = createAsyncThunk(
  'payments/fetchMy',
  async (_, { rejectWithValue }) => {
    try {
      return await apiClient.get(ENDPOINTS.payments.getMyPayments);
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

export const fetchPaymentById = createAsyncThunk(
  'payments/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      // Robustly replace backslashes if present
      const cleanId = String(id).replace(/\\/g, '/');
      return await apiClient.get(cleanId.startsWith('/') ? cleanId : ENDPOINTS.payments.getPaymentById(cleanId));
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

const paymentSlice = createSlice({
  name: 'payments',
  initialState: {
    list: [],
    selected: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearPaymentError: (state) => { state.error = null; },
    setSelectedPayment: (state, action) => { state.selected = action.payload; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initiatePayment.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(initiatePayment.fulfilled, (state) => { state.loading = false; })
      .addCase(initiatePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to initiate payment';
      })
      .addCase(uploadReceipt.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(uploadReceipt.fulfilled, (state) => { state.loading = false; })
      .addCase(uploadReceipt.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to upload receipt';
      })
      .addCase(reviewPayment.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(reviewPayment.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload?.data || action.payload;
        if (updated) {
          const updatedId = updated.payment_id || updated.id;
          if (updatedId) {
            const idx = state.list.findIndex(p => (p.payment_id || p.id) === updatedId);
            if (idx !== -1) {
              state.list[idx] = updated;
            }
            if (state.selected && (state.selected.payment_id || state.selected.id) === updatedId) {
              state.selected = updated;
            }
          }
        }
      })
      .addCase(reviewPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to review payment';
      })
      .addCase(fetchAllPayments.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchAllPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload?.data || action.payload || [];
      })
      .addCase(fetchAllPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch payments';
      })
      .addCase(fetchMyPayments.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchMyPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload?.data || action.payload || [];
      })
      .addCase(fetchMyPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch your payments';
      })
      .addCase(fetchPaymentById.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchPaymentById.fulfilled, (state, action) => {
        state.loading = false;
        state.selected = action.payload?.data || action.payload || null;
      })
      .addCase(fetchPaymentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch payment details';
      });
  }
});

export const { clearPaymentError, setSelectedPayment } = paymentSlice.actions;

export const selectAllPayments = (state) => state.payments.list;
export const selectSelectedPayment = (state) => state.payments.selected;
export const selectPaymentsLoading = (state) => state.payments.loading;
export const selectPaymentsError = (state) => state.payments.error;

export default paymentSlice.reducer;
