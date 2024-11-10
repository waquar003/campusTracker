import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:4000/api/v1/groups';

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    config.withCredentials = true;
  }

  return config;
});

export const createGroup = createAsyncThunk(
  'studyGroups/create',
  async (groupData) => {
    const response = await axios.post(`${API_URL}`, groupData, {
      withCredentials: true,
    });
    console.log(response.data.data);
    return response.data.data;
  }
);

export const fetchGroup = createAsyncThunk('studyGroups/fetch', async () => {
  const response = await axios.get(`${API_URL}`);
  return response.data.data;
});

export const joinGroup = createAsyncThunk(
  'studyGroups/join',
  async (groupId) => {
    const response = await axios.post(
      `${API_URL}/${groupId}/join`,
      {},
      {
        withCredentials: true,
      }
    );
    return response.data.data;
  }
);

const studyGroupSlice = createSlice({
  name: 'studyGroups',
  initialState: {
    groups: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createGroup.fulfilled, (state, action) => {
        // state.groups= action.payload;
      })
      .addCase(fetchGroup.fulfilled, (state, action) => {
        state.groups = action.payload;
      })
      .addCase(joinGroup.fulfilled, (state, action) => {
        state.groups = action.payload;
      });
  },
});

export default studyGroupSlice.reducer;
