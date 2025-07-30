import { useState } from 'react';
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import EventsPage from './pages/events';
import EventEditPage from './pages/eventEdit';
import EventFilter from './components/EventFilter.tsx';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <div className="flex min-h-screen">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-56 bg-gray-50 shadow p-6 transform transition-transform
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    lg:static lg:translate-x-0 lg:block`}
      >
        <h1 className="text-xl font-semibold mb-6">Správca podujatí</h1>
        <div
          className={`lg:hidden absolute -right-4 top-5 w-9 h-9 p-0.5 flex items-center justify-center
                       rounded bg-gray-50 ${!sidebarOpen && 'hidden'}`}
        >
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden absolute w-8 h-8
                       border rounded bg-white"
            title="Zavrieť menu"
          >
            &laquo;
          </button>
        </div>
        <nav className="space-y-4">
          <Link
            to="/events"
            className="block text-blue-600 underline"
            onClick={() => setSidebarOpen(false)}
          >
            Podujatia
          </Link>
          <Link
            to="/events/add"
            className="block text-blue-600 underline"
            onClick={() => setSidebarOpen(false)}
          >
            Pridať podujatie
          </Link>
        </nav>

        {pathname === '/events' && (
          <div className="mt-6 bg-white rounded-lg p-4 shadow">
            <EventFilter />
          </div>
        )}
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="flex-1 p-6 max-h-screen overflow-y-auto">
        <button
          className="lg:hidden mb-4 px-4 py-2 border rounded"
          onClick={() => setSidebarOpen(true)}
        >
          ☰ Menu
        </button>
        <Routes>
          <Route path="/" element={<Navigate to="/events" replace />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id/edit" element={<EventEditPage />} />
          <Route path="/events/add" element={<EventEditPage />} />
          <Route path="*" element={<div>Nenájdené</div>} />
        </Routes>
      </main>
    </div>
  );
}
