# Interview Platform

Live Demo: https://hirelive.onrender.com

Full-stack interview practice platform with:
- Authenticated users (Clerk)
- Live coding session lifecycle (create, join, end)
- Stream-based chat/video integrations
- MongoDB persistence
- Event-driven user sync with Inngest

## Tech Stack
- Frontend: React, Vite, React Router, React Query, Tailwind CSS, DaisyUI, Clerk
- Backend: Node.js, Express, Mongoose, Clerk Express middleware, Inngest
- Realtime/Comms: Stream Chat + Stream Video SDK
- Database: MongoDB

## Monorepo Structure
```text
interview_platform/
  backend/   # Express API + DB + auth + session/chat endpoints
  frontend/  # React app
```

## Features
- Clerk sign-in/sign-out and protected routes
- User sync from Clerk webhooks/events into MongoDB (via Inngest functions)
- Session APIs:
  - create session
  - list active sessions
  - list recent sessions
  - join session
  - end session
- Stream token endpoint for authenticated chat/video usage

## Environment Variables

Create `backend/.env`:

```env
PORT=3000
NODE_ENV=development
DB_URL=your_mongodb_connection_string
CLIENT_URL=http://localhost:5173

# Inngest
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key

# Stream
STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret

# Clerk (required by @clerk/express)
CLERK_SECRET_KEY=your_clerk_secret_key
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

## Installation

From project root:

```bash
npm install
npm install --prefix backend
npm install --prefix frontend
```

## Run Locally

Start backend:

```bash
npm run dev --prefix backend
```

Start frontend (new terminal):

```bash
npm run dev --prefix frontend
```

Frontend runs on `http://localhost:5173` and backend on `http://localhost:3000` by default.

## API Overview

Base URL: `/api`

- `GET /health`
- `GET /chat/token` (protected)
- `POST /sessions` (protected)
- `GET /sessions/active` (protected)
- `GET /sessions/my-recent` (protected)
- `GET /sessions/:id` (protected)
- `POST /sessions/:id/join` (protected)
- `POST /sessions/:id/end` (protected)
- `POST /inngest` (Inngest handler)

## Production Build

From root:

```bash
npm run build
npm run start
```

`npm run build` installs backend/frontend dependencies and builds the frontend bundle.  
`npm run start` starts the backend server, which serves `frontend/dist` when `NODE_ENV=production`.

## Notes
- This project is actively evolving; some UI pages are intentionally minimal while backend/session features are being expanded.
