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
      // apiClient.post takes URL, data, config. We must set headers for form-data
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

const paymentSlice = createSlice({
  name: 'payments',
  initialState: {
    loading: false,
    error: null,
  },
  reducers: {
    clearPaymentError: (state) => { state.error = null; },
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
      .addCase(reviewPayment.fulfilled, (state) => { state.loading = false; })
      .addCase(reviewPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to review payment';
      });
  }
});

export const { clearPaymentError } = paymentSlice.actions;

export const selectPaymentsLoading = (state) => state.payments.loading;
export const selectPaymentsError = (state) => state.payments.error;

export default paymentSlice.reducer;
