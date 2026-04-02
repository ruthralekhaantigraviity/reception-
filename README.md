# Hotel Shubha Sai — Receptionist Dashboard

A professional hotel management system for receptionists, built with a clean Frontend/Backend separation.

---

## 📁 Project Structure

```
Recep dash/
├── frontend/               # Vite + React Application
│   ├── src/
│   │   ├── components/     # All UI components (Modals, Sidebar, Header, etc.)
│   │   ├── App.jsx         # Main application entry
│   │   ├── main.jsx        # React root render
│   │   └── index.css       # Global styles & theme variables
│   ├── public/             # Static assets (logo, favicon)
│   ├── letterhead.html     # Standalone A4 letterhead template
│   └── package.json        # Frontend dependencies (React, Vite, lucide-react)
│
├── backend/                # Node.js + Express API Server
│   ├── server.js           # Main Express server with API routes (placeholder)
│   └── package.json        # Backend dependencies (express, cors, dotenv)
│
└── README.md               # This file
```

---

## 🚀 Getting Started

### Run the Frontend
```bash
cd frontend
npm install
npm run dev
```
Opens at: **http://localhost:5173**

### Run the Backend
```bash
cd backend
npm install
npm run dev
```
Opens at: **http://localhost:5000**

---

## 🏨 Features

- **Room Dashboard** — View and manage all room statuses in real-time
- **Booking System** — Multi-step booking with guest ID collection and pricing
- **Checkout Workflow** — Damage checks, payment collection, and receipt generation
- **Room History** — Full booking history per room with customer details
- **Maintenance Tracker** — Log and resolve technical issues
- **Notification System** — Live urgent checkout alerts
- **Settings** — Theme toggle (Dark/Light), system reset
- **Official Branding** — Receipts and letterheads with Hotel Shubha Sai logo
