import { createSlice } from '@reduxjs/toolkit';
import { PrioritiesState } from './types';
import { fetchPriorities } from './api';

const initialState: PrioritiesState = {
  priorities: [],
  loading: false,
  error: null,
};

const prioritiesSlice = createSlice({
  name: 'priorities',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPriorities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPriorities.fulfilled, (state, action) => {
        state.loading = false;
        state.priorities = action.payload || [];
      })
      .addCase(fetchPriorities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default prioritiesSlice.reducer;
