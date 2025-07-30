import { useAppDispatch, useAppSelector } from '../hooks';
import {
  setSort,
  toggleSortDir,
  setSearch,
  resetFilters,
  type SortKey,
} from '../features/filters/filtersSlice';

import * as Select from '@radix-ui/react-select';
import * as Label from '@radix-ui/react-label';

const sortLabel: Record<SortKey, string> = {
  title: 'Názov',
  venue: 'Miesto',
  starts: 'Začiatok',
};

export default function EventFilter() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((s) => s.filters);

  const handleSortChange = (value: SortKey) => {
    dispatch(setSort({ sortBy: value }));
  };

  const handleDirToggle = () => dispatch(toggleSortDir());

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    dispatch(setSearch(e.target.value));

  return (
    <div className="space-y-2">
      <div className="flex items-end gap-1">
        <div className="flex-1">
          <Label.Root className="block mb-1 text-sm font-medium">Zoradiť podľa</Label.Root>
          <Select.Root value={filters.sortBy} onValueChange={handleSortChange}>
            <Select.Trigger className="w-full border rounded px-2 py-1 bg-white text-left text-sm">
              <Select.Value aria-label={sortLabel[filters.sortBy]}>
                {sortLabel[filters.sortBy]}
              </Select.Value>
            </Select.Trigger>
            <Select.Content className="bg-white border rounded shadow">
              <Select.Viewport>
                <Select.Item value="title" className="cursor-pointer px-3 py-1">
                  <Select.ItemText>Názov</Select.ItemText>
                </Select.Item>
                <Select.Item value="venue" className="cursor-pointer px-3 py-1">
                  <Select.ItemText>Miesto</Select.ItemText>
                </Select.Item>
                <Select.Item value="starts" className="cursor-pointer px-3 py-1">
                  <Select.ItemText>Začiatok</Select.ItemText>
                </Select.Item>
              </Select.Viewport>
            </Select.Content>
          </Select.Root>
        </div>

        <button
          type="button"
          onClick={handleDirToggle}
          className="h-8 px-2 rounded border bg-gray-100 text-sm"
          title="Prepnúť smer"
        >
          {filters.sortDir === 'asc' ? '↑' : '↓'}
        </button>
      </div>

      <div>
        <Label.Root className="block text-sm font-medium">Hľadať</Label.Root>
        <p className="text-xs text-gray-500 mb-1">(názov alebo miesto)</p>
        <input
          value={filters.search}
          onChange={handleSearchChange}
          placeholder="Filtrovať…"
          className="w-full border rounded px-2 py-1 text-sm"
        />
      </div>
      <button
        type="button"
        onClick={() => dispatch(resetFilters())}
        className="w-full px-3 py-1 bg-gray-200 rounded text-sm"
      >
        Vymazať filtre
      </button>
    </div>
  );
}
