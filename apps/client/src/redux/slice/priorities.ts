import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Priority } from '../../types/priority.type';
import { ErrorResponse } from '../../types/error-response.type';

const api = '/api';

export const fetchPriorities = createAsyncThunk('fetchPriorities', async () => {
  const response =  await fetch(`${api}/priorities`);  
  return await response.json();
})

export type PrioritiesState = {
  isLoading: boolean,
  data: Priority[] | null,
  isError: false,
  error: ErrorResponse | null
}

const prioritySlice = createSlice({
  name: 'tasks',
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPriorities.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchPriorities.fulfilled, (state, action) => {
      state.isLoading = false;
      if (action.payload['success'] === true) {
        state.data = action.payload['priorities'];
      } else {
        state.isError = true;
        state.error = action.payload;
      }
    });
    builder.addCase(fetchPriorities.rejected, (state, action) => {
      console.log('Error', action.payload);
      state.isLoading = false;
      state.isError = true;
    })
  }
});

export default prioritySlice.reducer;