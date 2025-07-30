import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchEvents } from '../features/events/eventsThunk';
import Event from '../components/Event';

function EventsPage() {
  const dispatch = useAppDispatch();
  const events = useAppSelector((s) => s.events.items);
  const status = useAppSelector((s) => s.events.status);
  const filters = useAppSelector((s) => s.filters);

  const filteredEvents = useMemo(() => {
    let list = [...events];

    if (filters.categoryLabel) {
      const cat = filters.categoryLabel.toLowerCase();
      list = list.filter((ev) => (ev.categoryLabel ?? '').toLowerCase() === cat);
    }

    if (filters.search.trim()) {
      const term = filters.search.toLowerCase();
      list = list.filter(
        (ev) => ev.title.toLowerCase().includes(term) || ev.venue.toLowerCase().includes(term)
      );
    }

    const dir = filters.sortDir === 'asc' ? 1 : -1;
    list.sort((a, b) => {
      const ak = a[filters.sortBy] ?? '';
      const bk = b[filters.sortBy] ?? '';
      if (ak < bk) return -1 * dir;
      if (ak > bk) return 1 * dir;
      return 0;
    });

    return list;
  }, [events, filters]);

  useEffect(() => {
    if (status === 'idle' || status === undefined) {
      dispatch(fetchEvents());
    }
  }, [status, dispatch]);

  if (status === 'loading' || status === undefined) {
    return <div className="p-8 text-lg">Načítavam podujatia…</div>;
  }
  if (status === 'failed') {
    return <div className="p-8 text-red-600">Nepodarilo sa načítať podujatia.</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Nadchádzajúce podujatia</h1>
      {filteredEvents.map((evt) => (
        <Event key={evt.id} evt={evt} />
      ))}
    </div>
  );
}

export default EventsPage;
