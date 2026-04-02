import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({ origin: 'http://localhost:5173' })); // Vite dev server
app.use(express.json());

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Hotel Glitz API is running.' });
});

// ─── Rooms ────────────────────────────────────────────────────────────────────
// GET /api/rooms   — list all rooms
// POST /api/rooms  — create a room
// PUT /api/rooms/:id — update room status
// DELETE /api/rooms/:id — remove a room

app.get('/api/rooms', (req, res) => {
  // TODO: Replace with a real database query
  res.json({ rooms: [] });
});

// ─── Bookings ─────────────────────────────────────────────────────────────────
// POST /api/bookings   — create a new booking
// GET  /api/bookings   — list all bookings
// PATCH /api/bookings/:id/checkout — mark a booking as checked out

app.get('/api/bookings', (req, res) => {
  // TODO: Replace with a real database query
  res.json({ bookings: [] });
});

// ─── Notifications ────────────────────────────────────────────────────────────
// GET /api/notifications — list active urgent alerts

app.get('/api/notifications', (req, res) => {
  // TODO: Replace with real-time checkout alert logic
  res.json({ notifications: [] });
});

// ─── Server Start ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Hotel Glitz API running on http://localhost:${PORT}`);
});
