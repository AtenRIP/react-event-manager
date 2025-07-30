import { createAsyncThunk } from '@reduxjs/toolkit';
import { loadEvents } from '../../helpers/eventHelper';

export const fetchEvents = createAsyncThunk('events/fetch', async () => {
  try {
    return await loadEvents();
  } catch (e) {
    console.error(e);
  }
});
