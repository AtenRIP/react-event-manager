# Správce akcí/podujatí (React + Vite)

Jednoduchá SPA aplikace pro správu kulturních a sportovních akcí.

---

## Poznámky od autora

Doba tvorby aplikace byla necelých 6 hodin. Tvořil jsem ji od nuly, nepoužíval jsem žádný boilerplate. Zdrojové XML se parsuje přímo v kódu, nechtěl jsem si ulehčovat práci konverzí do JSON před použitím v projektu. Vzhled je velmi minimalisický, nechtěl jsem pálit čas nastavováním palet v tailwindu a používal jsem jen základní styly. Z volitelných featur jsem implementoval pouze filtrování a řazení. Mobilní verze se od desktopové liší v mechanice sidebaru, a v zalamování uvnitř editačního formuláře. Responzivita je tím pádem celkem minimalistická, ale podle mne to vystačí.

### Čím bych pokračoval

Pokud bych chtěl investovat více času a dostat aplikaci dostat ještě o trochu dál, určitě bych převedl většinu základních HTML prvků na Radix UI komponenty. Zároveň bych i stránky aplikace více komponentizoval (například položky menu v sidebaru a formulář na editační stránce). No a hodně by asi udělaly zmiňované custom styly. 

## Použité technologie

| Technologie / Knihovna    | Účel                                         |
|---------------------------|----------------------------------------------|
| **React 18 + TypeScript** | UI a logika aplikace                         |
| **Vite**                  | Dev server a build pipeline                  |
| **Tailwind CSS v4**       | Utility‑first styly                          |
| **Radix UI Primitives**   | Přístupné komponenty (Select, DropdownMenu…) |
| **Redux Toolkit**         | Stavová logika (`events` a `filters` slice)  |
| **fast‑xml‑parser**       | Parsování vstupního *partnerall.xml*         |
| **Prettier**              | Automatické formátování zdrojových kódů      |

---

## Skripty npm

| Příkaz            | Popis                                                |
|-------------------|------------------------------------------------------|
| `npm run dev`     | Spustí lokální dev server (<http://localhost:5173/>) |
| `npm run build`   | Vytvoří produkční bundle do složky `dist/`           |
| `npm run preview` | Ověří produkční build na lokálním serveru            |
| `npm run format`  | Spustí Prettier nad zdrojáky ve `src/`               |

---

## Rychlý start

```bash
git clone git@github.com:AtenRIP/react-event-manager.git event-manager
cd event-manager
npm install
npm run dev
```

Aplikace se otevře na **http://localhost:5173/**.  

---

## Struktura projektu

```
src/
 ├─ components/      // znovupoužitelné UI prvky
 ├─ features/        // Redux slices a thunky
 ├─ pages/           // stránkové komponenty
 ├─ helpers/         // pomocné funkce (loader XML, formátování dat)
 ├─ App.tsx          // hlavní layout aplikace a definice routeru
 └─ main.tsx         // vstupní bod aplikace
```

---
