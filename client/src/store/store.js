import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import scheduleReducer from './slices/scheduleSlice';
import assignmentReducer from './slices/assignmentSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    schedule: scheduleReducer,
    assignment: assignmentReducer,
  },
});
