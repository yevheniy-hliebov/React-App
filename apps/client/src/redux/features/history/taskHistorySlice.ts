import { createSlice } from '@reduxjs/toolkit';
import { HistoryState } from './types';
import { fetchTasksHistory } from './api';

const initialState: HistoryState = {
  history: [],
  loading: false,
  error: null,
};

const taskHistorySlice = createSlice({
  name: 'taskHistory',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasksHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasksHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.history = action.payload || [];
      })
      .addCase(fetchTasksHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default taskHistorySlice.reducer;
