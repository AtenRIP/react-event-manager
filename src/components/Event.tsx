import type { Event } from '../helpers/eventHelper';
import { formatDate } from '../helpers/formatDate';
import { Link } from 'react-router-dom';

interface EventProps {
  evt: Event;
}

export default function Event({ evt }: EventProps) {
  return (
    <div className="border rounded-lg p-4 shadow-sm space-y-1">
      <h2 className="text-lg font-semibold">{evt.title}</h2>

      <div className="text-sm text-gray-600">{evt.venue}</div>
      <div className="text-sm text-gray-500">{evt.address}</div>

      <div className="text-sm">{formatDate(evt.starts)}</div>

      <div className="pt-2">
        <Link to={`/events/${evt.id}/edit`} className="text-blue-600 underline text-sm">
          Upraviť
        </Link>
      </div>
    </div>
  );
}
