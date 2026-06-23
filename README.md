# Taskly

A full-stack task management app. Dark, minimal, fast.

## Stack

- **Backend** — Node.js + Express, REST API, in-memory store (swap for any DB)
- **Frontend** — React 18 + Vite, custom hooks, no external UI library

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/tasks | List tasks (supports `?status=` and `?project=`) |
| GET | /api/tasks/:id | Single task |
| POST | /api/tasks | Create task |
| PATCH | /api/tasks/:id | Update task fields |
| DELETE | /api/tasks/:id | Delete task |
| GET | /api/projects | List projects |
| POST | /api/projects | Create project |
| GET | /api/stats | Summary counts |

## Running locally

You need two terminals.

**Terminal 1 — API (port 4000)**
```bash
cd backend
npm install
node server.js
```

**Terminal 2 — Frontend (port 3000)**
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`.

## Connecting a real database

The in-memory `tasks` array in `backend/server.js` is the only thing to replace. Swap it for Prisma, Mongoose, or a raw pg client — the route handlers stay the same.

## Project structure

```
taskly/
├── backend/
│   └── server.js          Express REST API
└── frontend/
    └── src/
        ├── api/client.js   Fetch wrapper
        ├── hooks/          useTasks, useStats
        ├── components/     Navbar, Sidebar, TaskTable, TaskModal, Toast
        └── App.jsx         Root with state + routing logic
```
