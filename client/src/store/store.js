import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import scheduleReducer from './slices/scheduleSlice';
import academicGoalReducer from './slices/academicGoalSlice';
import assignmentReducer from './slices/assignmentSlice';
import studyGroupReducer from './slices/studyGroupSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    schedule: scheduleReducer,
    academicGoals: academicGoalReducer,
    assignments: assignmentReducer,
    studyGroups: studyGroupReducer,
  },
});
