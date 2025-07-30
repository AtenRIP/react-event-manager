import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import type { Event } from '../helpers/eventHelper';
import type { Seat } from '../helpers/eventHelper';

export interface SeatsMapProps {
  seatsTotal: Event['seatsTotal'];
  seatsPerRow: Event['seatsPerRow'];
  map: Event['seatsMap'];
  onChange?: (next: Seat[][], seatsTotal: number, seatsPerRow: number) => void;
  title?: string;
}

export default function SeatsMap({
  map,
  seatsTotal,
  seatsPerRow,
  onChange,
  title = 'Miesta',
}: SeatsMapProps) {
  const patchSeat = (row: number, col: number, patch: Partial<Seat>) => {
    const next = map.map((r, ri) =>
      r.map((s, ci) => (ri === row && ci === col ? { ...s, ...patch } : s))
    ) as Seat[][];
    onChange?.(next, seatsTotal, seatsPerRow);
  };

  return (
    <div className="min-w-0">
      <h3 className="text-sm font-medium mb-2">{title}</h3>

      <div className="overflow-x-auto bg-gray-100 rounded p-2">
        <div
          className="grid gap-1"
          style={{ gridTemplateColumns: `repeat(${seatsPerRow}, minmax(16px, 1fr))` }}
        >
          {map.flatMap((row, rIdx) =>
            row.map((seat, cIdx) => {
              const key = `${rIdx}-${cIdx}`;
              if (seat.deleted) {
                return <div key={key} />;
              }
              return (
                <DropdownMenu.Root key={key}>
                  <DropdownMenu.Trigger asChild>
                    <button
                      className={`aspect-square w-full rounded ${
                        seat.taken ? 'bg-red-500' : 'bg-green-500'
                      }`}
                      title={seat.taken ? 'Obsadené' : 'Voľné'}
                    />
                  </DropdownMenu.Trigger>

                  <DropdownMenu.Content
                    className="bg-white border rounded shadow-md p-1"
                    sideOffset={4}
                  >
                    <DropdownMenu.Item
                      className="px-2 py-1 text-sm cursor-pointer hover:bg-gray-100 rounded"
                      onSelect={() => patchSeat(rIdx, cIdx, { taken: !seat.taken })}
                    >
                      {seat.taken ? 'Označiť voľné' : 'Označiť obsadené'}
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      className="px-2 py-1 text-sm text-red-600 cursor-pointer hover:bg-red-50 rounded"
                      onSelect={() => patchSeat(rIdx, cIdx, { deleted: true })}
                    >
                      Zmazať miesto
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
