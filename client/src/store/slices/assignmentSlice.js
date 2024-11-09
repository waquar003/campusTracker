import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:4000/api/v1/assignments';

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchAssignments = createAsyncThunk(
  'assignment/fetchAssignments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL, { withCredentials: true });

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || 'Failed to fetch assignments'
      );
    }
  }
);

export const createAssignment = createAsyncThunk(
  'assignment/createAssignment',
  async (assignmentData, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, assignmentData, {
        withCredentials: true,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || 'Failed to create assignment'
      );
    }
  }
);

export const updateAssignment = createAsyncThunk(
  'assignment/updateAssignment',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_URL}/${data.id}`, data, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || 'Failed to update assignment'
      );
    }
  }
);

export const deleteAssignment = createAsyncThunk(
  'assignment/deleteAssignment',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        withCredentials: true,
      });
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || 'Failed to delete assignment'
      );
    }
  }
);

const assignmentSlice = createSlice({
  name: 'assignment',
  initialState: {
    assignments: [],
    loading: false,
    error: null,
    lastFetchedDate: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssignments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignments.fulfilled, (state, action) => {
        // console.log(action.payload)
        state.loading = false;
        state.assignments = action.payload;
        state.error = null;
      })
      .addCase(fetchAssignments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch assignments';
      })
      .addCase(createAssignment.pending, (state) => {
        state.error = null;
      })
      .addCase(createAssignment.fulfilled, (state, action) => {
        state.assignments.push(action.payload);
        state.error = null;
      })
      .addCase(createAssignment.rejected, (state, action) => {
        state.error = action.payload || 'Failed to create assignment';
      })
      .addCase(updateAssignment.pending, (state) => {
        state.error = null;
      })
      .addCase(updateAssignment.fulfilled, (state, action) => {
        const index = state.assignments.findIndex(
          (assignment) => assignment.id === action.payload.id
        );
        if (index !== -1) {
          state.assignments[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateAssignment.rejected, (state, action) => {
        state.error = action.payload || 'Failed to update assignment';
      })
      .addCase(deleteAssignment.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteAssignment.fulfilled, (state, action) => {
        state.assignments = state.assignments.filter(
          (assignment) => assignment.id !== action.payload
        );
        state.error = null;
      })
      .addCase(deleteAssignment.rejected, (state, action) => {
        state.error = action.payload || 'Failed to delete assignment';
      });
  },
});

export const { clearError } = assignmentSlice.actions;
export default assignmentSlice.reducer;
