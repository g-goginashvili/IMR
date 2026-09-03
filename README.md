# IMR — Internal Meeting Rooms

Company's internal meeting room booking system web application for room viewing and scheduling purposes. Solution is a front-end application built with React + TypeScript (currently without the backend).

**Live demo:** _<https://imr-project.vercel.app>_

---

## Running locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production bundle in dist/
```

---

## Features

| Page | What it does |
| --- | --- |
| **Dashboard** | Number of rooms available currently, bookings today, meetings in progress, rooms under maintenance, a live list of ongoing meetings, and room utilisation for the ongoing week. Information is refreshed every minute. |
| **Rooms** | Grid view of cards containing detailed information on rooms. The page is filterable by room type, capacity, floor, and a "hide under maintenance". |
| **Schedule** | A schedule grid view with a day and a week scope (with 07:00–21:00 working hours). Day scoped view depicts either current or specifically chosen day (one column per operational room) and the week-scoped one shows a week around the current or the chosen day (one column per weekday for a chosen room). Draws a "now" line and gives possibility to fully interact with bookings. |
| **Bookings** | Grid view of cards containing detailed information on booking. The page is filterable by room, status, and date range. Create booking, view details, edit upcoming, and cancel functionality present. |

---

## Additional libraries and frameworks

| Choice | Why |
| --- | --- |
| **MUI (Material UI) v9** | Quick and easy accessibility to the components: modals, drawers, forms, and a responsive breakpoint system out of the box. |
| **React Router v8** | Routing and `useSearchParams` for URL-driven state. |
| **Formik + Yup** | Form state and schema validation for the bookings. |

---

## Architecture

```
src/
├── api/          rooms-api.ts, bookings-api.ts
├── utility/      http-client.ts, time-formatting.ts, booking-rules.ts
├── hooks/        use-resource.ts, use-rooms.ts, use-bookings.ts, use-booking-actions.ts
├── components/   reusable UI: main-layout, filter-drawer, booking-modal
├── modules/      one folder per page: dashboard, rooms, schedule, bookings, navigation-drawer
└── router/
public/fake-api/  rooms.json, bookings.json (seed data, served like a static API)
```

### Data layer and persistence

The UI does not couple JSON files directly. `src/api/*` provides functions mimicking the shape a real API (`getRooms`, `getBookings`, `createBooking`, `updateBooking`, `cancelBooking`), all async and returning typed promises.

- `http-client.ts` is a `fetch` wrapper with `get/post/put/delete`, JSON headers, an optional bearer token, and `AbortSignal` support. It currently targets `/fake-api/*` for seed data.
- `getBookings` copies the seed data from the fetched JSON into `localStorage` on first run, and serves afterwards from there. Writes hit `localStorage` only.
- Since the rooms currently are read-only `getRooms` just fetches the JSON.

`localStorage` is keeping data consistent across sessions, acting as a substitute for the absent backend. It is stored under the key `bookingsData`.
This setup makes it possible to swap in a real API layer later — an HTTP client wrapper is already in place.

### Controller hooks

Current setup with split between `*.tsx` view and a `use-*-controller.ts` hook makes the JSX readable and the hooks reusables.

### URL state

Filters and schedule position states are managed with the query string:

- Rooms: `?type=conference,boardroom&capacity=8&floor=2&hideMaintenance=true`
- Bookings: `?room=<id>&status=confirmed&from=2026-09-01&to=2026-09-07`
- Schedule: `?view=week&date=2026-09-03&room=<id>`

`useSearchParams` gives number of advantages over the `useState` for this case, namely:

1. **Shareable and bookmarkable.** "Look at Cedar's schedule next week" is a link, not a set of instructions.
2. **Survives refresh and back/forward.** Filters are the kind of state a user expects the browser to remember.
3. **One source of truth.** The `FilterDrawer` writes to the URL and the page controller reads from it, so there's no prop-drilling or syncing between the drawer and the list. Adding a new filter to a page means adding one entry to a `filterFields` array.

### Forms

The booking modal operates and manages form state with **Formik** and **Yup** schema.
Overlapping days are currently validated inside the Yup schema with a .test(), which is fine for now. Once the backend API layer is implemented, this check should be moved out of the schema — the conflict would instead be reported by the backend response, e.g. surfaced as a toast.

### Responsive design

- Navigation collapses from a permanent left drawer to a top app bar with a temporary drawer below 645px.
- The filter drawer anchors right on desktop and bottom on phones.
- Card grids column count follows width.
- The schedule grid scrolls horizontally inside its own container with sticky headers and a sticky time gutter, so the page never scrolls sideways.
- Header actions wrap; the day/week toggle and date navigation go full-width on small screens.

### Seed data

12 rooms across 4 floors and 4 types (single, conference, boardroom, training) with varied amenities, 2 under maintenance.

150 bookings from 10 organisers, spread over 18 days (3–20 September 2026) and covering all 10 operational rooms — none fall in the two rooms under maintenance. 11 of them are cancelled, so the status filter and the disabled edit/cancel actions have something to act on. No two active bookings overlap in the same room, matching the rule the booking form enforces. Meeting lengths and times of day vary, which gives the dashboard's utilisation bars and the schedule grid a realistic spread.

---
