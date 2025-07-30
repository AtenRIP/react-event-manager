import { useState, useEffect, type FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as Label from '@radix-ui/react-label';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchEvents } from '../features/events/eventsThunk';
import { updateEvent, addEvent } from '../features/events/eventsSlice';
import { buildSeatsMap, type Event } from '../helpers/eventHelper';
import SeatsMap from '../components/SeatsMap';
import { DEFAULT_SEAT_ROWS, DEFAULT_SEATS_TOTAL } from '../helpers/constants.ts';

function EventEditPage() {
  const { id } = useParams<{ id: string }>();
  const isAdd = !id;

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const status = useAppSelector((s) => s.events.status);
  const event = useAppSelector((s) =>
    isAdd ? undefined : s.events.items.find((e) => e.id === Number(id))
  );

  useEffect(() => {
    if (!isAdd && !event && status === 'idle') {
      dispatch(fetchEvents());
    }
  }, [event, status, dispatch, isAdd]);

  const emptyEvent: Event = {
    id: Date.now(),
    title: '',
    venue: '',
    city: '',
    starts: new Date().toISOString(),
    seatsTotal: DEFAULT_SEATS_TOTAL,
    seatsPerRow: Math.ceil(DEFAULT_SEATS_TOTAL / DEFAULT_SEAT_ROWS),
    seatRows: DEFAULT_SEAT_ROWS,
    seatsMap: buildSeatsMap(DEFAULT_SEATS_TOTAL, DEFAULT_SEAT_ROWS),
  };

  const [form, setForm] = useState<Event | null>(isAdd ? emptyEvent : event || null);

  useEffect(() => {
    if (event) setForm(event);
  }, [event]);

  if (!form) {
    return <div className="p-6 max-w-5xl mx-auto">Načítavam podujatie…</div>;
  }

  const handleChange =
    (field: keyof Event) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm({ ...form, [field]: e.target.value });
    };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form) return;
    if (isAdd) {
      dispatch(addEvent(form));
    } else {
      dispatch(updateEvent(form));
    }
    navigate('/events');
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <form
        onSubmit={handleSubmit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            // prevent form submit when hitting enter while in input
            // instead just lose focus so that SeatMap may refresh if needed
            e.preventDefault();
            (e.target as HTMLElement).blur();
          }
        }}
      >
        <div className="border rounded-lg shadow-sm p-6 grid gap-6 lg:grid-cols-[300px_1fr]">
          <div className="space-y-4">
            <h1 className="text-2xl font-semibold">
              {isAdd ? 'Pridať podujatie' : `Upraviť podujatie ${form.id}`}
            </h1>

            <div className="space-y-1">
              <Label.Root htmlFor="title" className="font-medium">
                Názov
              </Label.Root>
              <input
                id="title"
                value={form.title}
                onChange={handleChange('title')}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div className="space-y-1">
              <Label.Root htmlFor="venue" className="font-medium">
                Miesto
              </Label.Root>
              <input
                id="venue"
                value={form.venue}
                onChange={handleChange('venue')}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div className="space-y-1">
              <Label.Root htmlFor="city" className="font-medium">
                Mesto
              </Label.Root>
              <input
                id="city"
                value={form.city}
                onChange={handleChange('city')}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div className="space-y-1">
              <Label.Root htmlFor="starts" className="font-medium">
                Začiatok
              </Label.Root>
              <input
                id="starts"
                type="datetime-local"
                value={form.starts.slice(0, 16)}
                onChange={(e) => setForm({ ...form, starts: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div className="flex gap-4 mb-4">
              <div className="flex-1 space-y-1">
                <Label.Root htmlFor="seatsTotal" className="font-medium">
                  Počet miest
                </Label.Root>
                <input
                  id="seatsTotal"
                  type="number"
                  min={0}
                  value={form.seatsTotal}
                  onChange={(e) => setForm({ ...form, seatsTotal: Number(e.target.value) })}
                  onBlur={(e) =>
                    setForm({
                      ...form,
                      seatsMap: buildSeatsMap(Number(e.target.value), form.seatRows),
                      seatsPerRow: Math.ceil(Number(e.target.value) / form.seatRows),
                    })
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div className="flex-1 space-y-1">
                <Label.Root htmlFor="seatRows" className="font-medium">
                  Počet radov
                </Label.Root>
                <input
                  id="seatRows"
                  type="number"
                  min={1}
                  value={form.seatRows}
                  onChange={(e) => setForm({ ...form, seatRows: Number(e.target.value) })}
                  onBlur={(e) =>
                    setForm({
                      ...form,
                      seatsMap: buildSeatsMap(form.seatsTotal, Number(e.target.value)),
                      seatsPerRow: Math.ceil(form.seatsTotal / Number(e.target.value)),
                    })
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>

            <div className="flex-1 space-y-1">
              <Label.Root htmlFor="seatsPerRow" className="font-medium">
                Miesta v rade
              </Label.Root>
              <input
                id="seatsPerRow"
                type="number"
                value={form.seatsPerRow}
                readOnly
                className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>

            <button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white rounded">
              Uložiť
            </button>
          </div>

          <SeatsMap
            seatsTotal={form.seatsTotal}
            seatsPerRow={form.seatsPerRow}
            map={form.seatsMap}
            onChange={(nextMap, total, perRow) =>
              setForm({
                ...form,
                seatsMap: nextMap,
                seatsTotal: total,
                seatsPerRow: perRow,
              })
            }
          />
        </div>
      </form>
    </div>
  );
}

export default EventEditPage;
