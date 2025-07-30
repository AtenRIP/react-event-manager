import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type SortKey = 'title' | 'venue' | 'starts';

export interface FiltersState {
  sortBy: SortKey;
  sortDir: 'asc' | 'desc';
  categoryLabel: string | null;
  /** free‑text search against title *or* venue */
  search: string;
}

const initialState: FiltersState = {
  sortBy: 'starts',
  sortDir: 'asc',
  categoryLabel: null,
  search: '',
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSort: (state, action: PayloadAction<{ sortBy: SortKey; sortDir?: 'asc' | 'desc' }>) => {
      state.sortBy = action.payload.sortBy;
      if (action.payload.sortDir) {
        state.sortDir = action.payload.sortDir;
      }
    },

    toggleSortDir: (state) => {
      state.sortDir = state.sortDir === 'asc' ? 'desc' : 'asc';
    },

    setCategoryLabel: (state, action: PayloadAction<string | null>) => {
      state.categoryLabel = action.payload;
    },

    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },

    resetFilters: () => initialState,
  },
});

export const { setSort, toggleSortDir, setCategoryLabel, setSearch, resetFilters } =
  filtersSlice.actions;

export default filtersSlice.reducer;
