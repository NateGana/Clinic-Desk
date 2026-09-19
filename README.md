# ClinicDesk

A clean, professional clinic appointment management system built for demonstration and portfolio purposes. ClinicDesk helps a small clinic manage patients, doctors, and appointments from one simple dashboard.

> **Note:** This is a demonstration/project system only. It is **not** a real medical records platform and should not be used to store actual patient health information.

## Description

ClinicDesk gives clinic front-desk staff a single place to register patients, manage doctor profiles and schedules, and book, edit, or cancel appointments. It's built entirely with client-side web technologies, so it runs instantly in any browser with no setup.

## Main Features

- **Dashboard** — total patients, today's appointments, upcoming appointments, completed visits, and doctors available today
- **Patient management** — add, edit, delete, and search patients by name or ID
- **Doctor management** — add, edit, and delete doctor profiles with specialization, schedule, and availability status
- **Appointment scheduling** — add, edit, and cancel appointments; automatic conflict detection prevents double-booking a doctor at the same date and time
- **Filtering** — filter appointments by doctor, status, or a specific date
- **Status tracking** — appointments move through Scheduled, Confirmed, Completed, and Cancelled states with color-coded badges
- **Polished UX** — modal forms, confirmation dialogs, toast notifications, and empty states throughout

## Technologies Used

- HTML5
- CSS3 (custom properties, CSS Grid & Flexbox, no framework)
- Vanilla JavaScript (ES6+)
- Browser `localStorage` for persistence
- Google Fonts (Inter) via CDN — functions normally if the font fails to load
- Inline SVG icons (no icon library)

No backend, server, database, or build tools are required.

## How to Run

1. Download or clone this repository.
2. Open `index.html` directly in any modern web browser.
3. No installation or build step is required.

Sample doctors, patients, and appointments (including several scheduled for "today") are generated automatically on first load. All changes are saved to `localStorage` and persist across refreshes.

## Project Structure

```
clinicdesk/
├── index.html      # Application markup and modal templates
├── style.css       # Styling, layout, and responsive rules
├── script.js       # State management, rendering, and event logic
└── README.md       # This file
```

## Key Functionality

| Area | What it does |
|---|---|
| Dashboard | Recomputes today's/upcoming/completed appointment counts live from stored data, using the current date |
| Appointments | Full CRUD with a same-doctor, same-time conflict check before saving |
| Patients | Full CRUD with instant search; patient IDs auto-increment (`PT-0001`, `PT-0002`, …) |
| Doctors | Full CRUD; a doctor with active (non-completed, non-cancelled) appointments can't be deleted |

## Screenshots

> _Add screenshots of your running application here._

- `screenshots/dashboard.png` — Dashboard overview
- `screenshots/appointments.png` — Appointment table with filters
- `screenshots/patients.png` — Patient records
- `screenshots/doctors.png` — Doctor profile cards

## Future Improvements

- Calendar/week-view for appointments instead of a flat table
- SMS/email appointment reminders (would require a backend service)
- Visit notes and prescription history (with proper access controls)
- Doctor-specific working-hour validation when booking
- Patient self-service booking portal
