/**
 * eventStorage.js — DEPRECATED
 *
 * This file previously contained localStorage-based event storage and
 * mock fallback events. All of that logic has been removed.
 *
 * MongoDB is now the SINGLE source of truth for all events.
 * Use the API routes instead:
 *   GET    /api/events          — fetch all events
 *   POST   /api/events          — create event (admin only)
 *   GET    /api/events/[id]     — fetch single event
 *   PUT    /api/events/[id]     — update event (admin only)
 *   DELETE /api/events/[id]     — delete event (admin only)
 *
 * Do NOT re-add localStorage or mock event fallbacks here.
 */
