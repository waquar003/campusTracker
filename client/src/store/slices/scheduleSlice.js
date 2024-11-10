import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:4000/api/v1/schedule';

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchSchedules = createAsyncThunk(
  'schedule/fetchSchedules',
  async (date, { rejectWithValue }) => {
    try {
      console.log('Fetching schedules for date:', date);
      const response = await axios.get(`${API_URL}?date=${date}`, {
        withCredentials: true,
      });
      console.log('Schedule response:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching schedules:', error);
      return rejectWithValue(
        error.response?.data || 'Failed to fetch schedules'
      );
    }
  }
);

export const createSchedule = createAsyncThunk(
  'schedule/createSchedule',
  async (eventData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/events`, eventData, {
        withCredentials: true,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || 'Failed to create schedule'
      );
    }
  }
);

export const updateSchedule = createAsyncThunk(
  'schedule/updateSchedule',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      console.log('Updating schedule with:', { id, data });
      const response = await axios.put(`${API_URL}/events/${id}`, data, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Update response:', response.data); // Debug log
      return response.data.data;
    } catch (error) {
      console.error('Update error:', error); // Debug log
      return rejectWithValue(
        error.response?.data || 'Failed to update schedule'
      );
    }
  }
);

export const deleteSchedule = createAsyncThunk(
  'schedule/deleteSchedule',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/events/${id}`, {
        withCredentials: true,
      });
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || 'Failed to delete schedule'
      );
    }
  }
);

const scheduleSlice = createSlice({
  name: 'schedule',
  initialState: {
    schedules: [],
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
      .addCase(fetchSchedules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSchedules.fulfilled, (state, action) => {
        state.loading = false;
        console.log('Schedules', action.payload);

        state.schedules = action.payload;
        state.error = null;
        state.lastFetchedDate = new Date().toISOString();
      })
      .addCase(fetchSchedules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch schedules';
      })
      .addCase(createSchedule.pending, (state) => {
        state.error = null;
      })
      .addCase(createSchedule.fulfilled, (state, action) => {
        state.schedules.push(action.payload);
        state.error = null;
      })
      .addCase(createSchedule.rejected, (state, action) => {
        state.error = action.payload || 'Failed to create schedule';
      })
      .addCase(updateSchedule.pending, (state) => {
        state.error = null;
      })
      .addCase(updateSchedule.fulfilled, (state, action) => {
        const index = state.schedules.findIndex(
          (schedule) => schedule.id === action.payload.id
        );
        if (index !== -1) {
          state.schedules[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateSchedule.rejected, (state, action) => {
        state.error = action.payload || 'Failed to update schedule';
      })
      .addCase(deleteSchedule.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteSchedule.fulfilled, (state, action) => {
        state.schedules = state.schedules.filter(
          (schedule) => schedule.id !== action.payload
        );
        state.error = null;
      })
      .addCase(deleteSchedule.rejected, (state, action) => {
        state.error = action.payload || 'Failed to delete schedule';
      });
  },
});

export const { clearError } = scheduleSlice.actions;
export default scheduleSlice.reducer;
