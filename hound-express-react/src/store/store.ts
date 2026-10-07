import { configureStore } from '@reduxjs/toolkit';
import guidesReducer from './guidesSlice';

export const store = configureStore({
  reducer: {
    guides: guidesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;