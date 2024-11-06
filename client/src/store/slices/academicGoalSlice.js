import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:4000/api/v1/academic-goals';

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    config.withCredentials = true;
  }
  return config;
});

export const fetchAcademicGoals = createAsyncThunk(
  'academicGoals/fetchAll',
  async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error('Token not found');

    const response = await axios.get(`${API_URL}`);

    return response.data.data;
  }
);

export const createAcademicGoal = createAsyncThunk(
  'academicGoals/create',
  async (goalData) => {
    const response = await axios.post(`${API_URL}`, goalData, {
      withCredentials: true,
    });
    return response.data.data;
  }
);

export const markGoalComplete = createAsyncThunk(
  'academicGoals/complete',
  async (goalId) => {
    const response = await axios.patch(
      `${API_URL}/${goalId}/complete`,
      {},
      {
        withCredentials: true,
      }
    );
    return response.data.data;
  }
);

export const deleteAcademicGoal = createAsyncThunk(
  'academicGoals/delete',
  async (goalId) => {
    await axios.delete(`${API_URL}/${goalId}`, {
      withCredentials: true,
    });
    return goalId;
  }
);

const academicGoalSlice = createSlice({
  name: 'academicGoals',
  initialState: {
    goals: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAcademicGoals.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAcademicGoals.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.goals = action.payload.goals || [];
      })
      .addCase(fetchAcademicGoals.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createAcademicGoal.fulfilled, (state, action) => {
        state.goals.push(action.payload);
      })
      .addCase(markGoalComplete.fulfilled, (state, action) => {
        const goalIndex = state.goals.findIndex(
          (goal) => goal.id === action.payload.id
        );
        if (goalIndex !== -1) {
          state.goals[goalIndex].completed = !state.goals[goalIndex].completed;
        }
      })
      .addCase(deleteAcademicGoal.fulfilled, (state, action) => {
        state.goals = state.goals.filter((goal) => goal.id !== action.payload);
      });
  },
});

export default academicGoalSlice.reducer;
