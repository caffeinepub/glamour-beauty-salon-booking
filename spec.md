# Glamour Beauty Salon Booking System

## Current State
The workspace contains a soccer academy database app with Players, Coaches, Teams, TrainingSessions, and Matches pages. This needs to be completely replaced with a beauty salon booking system.

## Requested Changes (Diff)

### Add
- Public landing page with hero, services menu, stylists profiles, and quick booking form
- Services catalog (haircut, coloring, manicure, pedicure, facial, massage, etc.) with name, description, duration, price
- Staff/stylist profiles with name, specialization, bio, availability
- Appointment booking: client picks service, stylist, date/time, provides name/email/phone
- Admin dashboard: view all bookings, manage services, manage staff
- Booking status management: pending, confirmed, cancelled, completed
- Authorization with role-based access (admin vs public)

### Modify
- Replace all existing backend logic and frontend pages

### Remove
- All soccer academy pages (Players, Coaches, Teams, TrainingSessions, Matches)
- All soccer-related data models

## Implementation Plan
1. Generate new Motoko backend with: Services, Staff, Appointments actors/data models
2. Wire authorization component for admin access
3. Build frontend: public landing page + admin dashboard
4. Services: list, add, edit, delete (admin)
5. Staff: profiles visible publicly, managed by admin
6. Appointments: public booking form, admin view with status updates
