import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Event } from '../../types/event';
import { loadFromLocalStorage, saveToLocalStorage } from '../../utils/localStorage';

interface EventsState {
  events: Event[];
  balanceInicial: number;
  currentEvent: Event | null;
  loading: boolean;
  error: string | null;
}

const initialState: EventsState = {
  events: [],
  balanceInicial: 0,
  currentEvent: null,
  loading: false,
  error: null,
};

// Async thunks
export const loadEvents = createAsyncThunk(
  'events/loadEvents',
  async () => {
    const data = loadFromLocalStorage();
    return data;
  }
);

export const saveEvents = createAsyncThunk(
  'events/saveEvents',
  async (_, { getState }) => {
    const state = getState() as { events: EventsState };
    saveToLocalStorage(state.events.events, state.events.balanceInicial);
    return state.events.events;
  }
);

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setBalanceInicial: (state, action: PayloadAction<number>) => {
      state.balanceInicial = action.payload;
    },
    addEvent: (state, action: PayloadAction<Event>) => {
      state.events.push(action.payload);
    },
    updateEvent: (state, action: PayloadAction<Event>) => {
      const index = state.events.findIndex(event => event.id === action.payload.id);
      if (index !== -1) {
        state.events[index] = action.payload;
      }
    },
    deleteEvent: (state, action: PayloadAction<string>) => {
      state.events = state.events.filter(event => event.id !== action.payload);
    },
    setCurrentEvent: (state, action: PayloadAction<Event | null>) => {
      state.currentEvent = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadEvents.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload.events;
        state.balanceInicial = action.payload.balanceInicial;
      })
      .addCase(loadEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error loading events';
      })
      .addCase(saveEvents.fulfilled, (state) => {
        // Events saved successfully
      });
  },
});

export const {
  setBalanceInicial,
  addEvent,
  updateEvent,
  deleteEvent,
  setCurrentEvent,
  clearError,
} = eventsSlice.actions;

export default eventsSlice.reducer;