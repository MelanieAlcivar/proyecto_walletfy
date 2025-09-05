import { configureStore } from '@reduxjs/toolkit';
import eventsReducer from './slices/eventsSlice';
import themeReducer from './slices/themeSlice';
import chatReducer from './slices/chatSlice';

export const store = configureStore({
  reducer: {
    events: eventsReducer,
    theme: themeReducer,
    chat: chatReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;