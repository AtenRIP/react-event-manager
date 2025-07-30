import { XMLParser } from 'fast-xml-parser';
import { DEFAULT_SEAT_ROWS, DEFAULT_SEATS_TOTAL } from './constants.ts';

interface RawEvent {
  ID: string;
  nazov: { html: string };
  link_pict: string;
  ID_typ_podujatia: string;
  typ_podujatia: string;
  zaciatok: string;
  hladisko: string;
  adresa?: string;
  mesto: string;
  popis: { html: string };
  ceny: string;
  linka: string;
  koniec_rez: string;
  promoterName: string;
  evtLocLat?: string;
  evtLocLon?: string;
}

export interface Seat {
  taken: boolean;
  deleted: boolean;
}
export interface Event {
  id: number;
  title: string;
  categoryId?: number;
  categoryLabel?: string;
  picture?: string;
  starts: string;
  venue: string;
  address?: string;
  city?: string;
  priceInfo?: string;
  ticketUrl?: string;
  descriptionHTML?: string;
  promoter?: string;
  location?: { lat: number; lon: number };
  // unmapped values
  seatsTotal: number;
  seatsPerRow: number;
  seatRows: number;
  seatsMap: Seat[][];
}
export async function loadEvents(): Promise<Event[]> {
  const xml = await fetch('/partnerall.xml').then((r) => r.text());

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '',
    cdataPropName: 'html',
    parseTagValue: true,
    trimValues: true,
  });

  const parsed = parser.parse(xml);

  // support several possible root tags (<Root>, <partnerall>, etc.)
  const rawEventsNode: RawEvent | RawEvent[] | undefined =
    parsed.event ?? // <event> ... </event>
    parsed.Root?.event ?? // <Root><event>…</event></Root>
    parsed.partnerall?.event ?? // <partnerall><event>…</event></partnerall>
    parsed.events?.event; // <events><event>…</event></events>

  if (!rawEventsNode) {
    throw new Error('V XML sa nenašli žiadne uzly <event>.');
  }

  // normalise to an array
  const rawEvents = Array.isArray(rawEventsNode) ? rawEventsNode : [rawEventsNode];

  // map/clean each record
  return rawEvents.map(toEvent);
}

function toEvent(e: RawEvent): Event {
  return {
    id: Number(e.ID),
    title: stripHtml(e.nazov.html),
    categoryId: Number(e.ID_typ_podujatia),
    categoryLabel: e.typ_podujatia,
    picture: e.link_pict,
    starts: e.zaciatok,
    venue: e.hladisko,
    address: e.adresa ?? '',
    city: e.mesto.trim(),
    priceInfo: e.ceny,
    ticketUrl: e.linka,
    descriptionHTML: e.popis.html,
    promoter: e.promoterName,
    location: e.evtLocLat ? { lat: Number(e.evtLocLat), lon: Number(e.evtLocLon) } : undefined,
    // umapped data
    seatsTotal: DEFAULT_SEATS_TOTAL,
    seatsPerRow: Math.ceil(DEFAULT_SEATS_TOTAL / DEFAULT_SEAT_ROWS),
    seatRows: DEFAULT_SEAT_ROWS,
    seatsMap: buildSeatsMap(DEFAULT_SEATS_TOTAL, DEFAULT_SEAT_ROWS),
  };
}

function stripHtml(html: string): string {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || '';
}

export function buildSeatsMap(seatsTotal: number, seatRows: number): Seat[][] {
  // guard against bad inputs
  if (seatsTotal <= 0 || seatRows <= 0) {
    return [];
  }

  const base = Math.floor(seatsTotal / seatRows);
  const remainder = seatsTotal % seatRows;
  const map: Seat[][] = [];

  for (let r = 0; r < seatRows; r++) {
    const seatsInThisRow = base + (r < remainder ? 1 : 0);
    const row: Seat[] = [];
    for (let c = 0; c < seatsInThisRow; c++) {
      row.push({ taken: false, deleted: false });
    }
    map.push(row);
  }

  return map;
}
