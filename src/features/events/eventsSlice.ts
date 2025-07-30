import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { fetchEvents } from './eventsThunk';
import type { Event } from '../../helpers/eventHelper';

interface EventsState {
  items: Event[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: EventsState = {
  items: [],
  status: 'idle',
  error: null,
};

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    addEvent: (state, action: PayloadAction<Event>) => {
      state.items.push(action.payload);
    },
    updateEvent: (state, action: PayloadAction<Partial<Event> & { id: number }>) => {
      const idx = state.items.findIndex((e) => e.id === action.payload.id);
      if (idx !== -1) {
        state.items[idx] = { ...state.items[idx], ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, { payload }) => {
        state.status = 'succeeded';
        state.items = payload ?? [];
      })
      .addCase(fetchEvents.rejected, (state, { error }) => {
        state.status = 'failed';
        state.error = error.message ?? 'Neznáma chyba';
      });
  },
});

export const { addEvent, updateEvent } = eventsSlice.actions;
export default eventsSlice.reducer;
