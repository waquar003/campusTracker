import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:4000/api/v1/user';

export const register = createAsyncThunk(
  'auth/register',
  async ({ name, email, password }) => {
    console.log(name);

    const response = await axios.post(`${API_URL}/register`, {
      name,
      email,
      password,
    });
    console.log(response.data);

    return response.data.data;
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }) => {
    const response = await axios.post(
      `${API_URL}/login`,
      {
        email,
        password,
      },
      {
        withCredentials: true,
      }
    );
    localStorage.setItem('accessToken', response.data.data.accessToken);
    localStorage.setItem('isAuthenticated', true);
    return response.data.data.user;
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await axios.post(
    `${API_URL}/logout`,
    {},
    {
      withCredentials: true,
    }
  );
  localStorage.removeItem('accessToken');
});

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (userData) => {
    const response = await axios.patch(`${API_URL}/update-profile`, userData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data.data;
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
