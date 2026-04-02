# TaskFlow — Task Management App

A full-stack task management application built with Node.js/Express (backend) and React/Vite (frontend). Users can register, log in, and manage personal task lists in a secure multi-user environment.

---

## Tech Stack

**Backend:** Node.js, Express, MongoDB (Mongoose), JWT, bcryptjs, express-validator  
**Frontend:** React (Vite), React Router, Axios, CSS (no UI framework)

---

## Prerequisites

- Node.js v18+
- npm v9+
- MongoDB (local installation or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/taskflow.git
cd taskflow
```

### 2. Set up the backend

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and fill in your values:

```
MONGODB_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=your_long_random_secret_here
JWT_EXPIRE=7d
PORT=5000
CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev       # development (nodemon)
# or
npm start         # production
```

The API will be running at `http://localhost:5000`.

### 3. Set up the frontend

Open a new terminal:

```bash
cd frontend
npm install
cp .env.example .env
```

The default `.env` points to `http://localhost:5000/api` which is correct for local development. Start the frontend:

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Project Structure

```
taskflow/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js   # register, login, logout
│   │   │   └── taskController.js   # CRUD operations
│   │   ├── middleware/
│   │   │   ├── auth.js             # JWT verification + blacklist check
│   │   │   └── validate.js         # express-validator error handler
│   │   ├── models/
│   │   │   ├── User.js             # User schema (bcrypt pre-save hook)
│   │   │   └── Task.js             # Task schema
│   │   ├── routes/
│   │   │   ├── auth.js             # /api/auth/*
│   │   │   └── tasks.js            # /api/tasks/*
│   │   ├── utils/
│   │   │   ├── generateToken.js    # JWT signing helper
│   │   │   └── tokenBlacklist.js   # In-memory logout invalidation
│   │   ├── validators/
│   │   │   ├── authValidator.js
│   │   │   └── taskValidator.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── AuthProvider.jsx     # Auth state + context provider
    │   │   ├── TaskForm.jsx         # Create / edit task form
    │   │   ├── TaskItem.jsx         # Single task card
    │   │   └── TaskList.jsx         # Task list with empty/loading states
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── hooks/
    │   │   └── useAuth.js
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   └── Dashboard.jsx        # Main task management view
    │   ├── services/
    │   │   └── api.js               # Axios instance + all API calls
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── .env.example
    └── package.json
```

---

## API Reference

All task endpoints require an `Authorization: Bearer <token>` header.  
All responses are JSON with a `success` boolean field.

### Auth

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login, returns JWT |
| POST | `/api/auth/logout` | Private | Invalidate current token |

**Register / Login request body:**
```json
{ "email": "user@example.com", "password": "yourpassword" }
```

**Register / Login response:**
```json
{
  "success": true,
  "data": {
    "_id": "664abc...",
    "email": "user@example.com",
    "token": "eyJhbGci..."
  }
}
```

---

### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks for the logged-in user |
| GET | `/api/tasks?status=todo&priority=high` | Filter by status and/or priority |
| GET | `/api/tasks/:id` | Get a single task |
| POST | `/api/tasks` | Create a new task |
| PUT | `/api/tasks/:id` | Full update |
| PATCH | `/api/tasks/:id` | Partial update |
| DELETE | `/api/tasks/:id` | Delete a task |

**Task fields:**

| Field | Type | Values | Required |
|-------|------|--------|----------|
| title | String | max 100 chars | ✅ |
| description | String | max 500 chars | ❌ |
| dueDate | Date | ISO date string | ❌ |
| priority | String | `low`, `medium`, `high` | ❌ (default: `medium`) |
| status | String | `todo`, `in-progress`, `done` | ❌ (default: `todo`) |

**GET /api/tasks response:**
```json
{
  "success": true,
  "count": 2,
  "data": [ { "_id": "...", "title": "...", "status": "todo", ... } ]
}
```

**POST/PUT/PATCH response:**
```json
{
  "success": true,
  "data": { "_id": "...", "title": "...", "status": "todo", ... }
}
```

---

## Security Notes

- Passwords are hashed with **bcryptjs** (10 salt rounds) before storage
- JWTs are signed with `HS256` and expire after the configured `JWT_EXPIRE` duration
- Logout invalidates the token server-side via an in-memory blacklist
- All task queries are scoped to `req.user._id` — cross-user data access is not possible
- Input validation on all endpoints via `express-validator`
- No secrets are hardcoded — all config via environment variables

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/taskflow` |
| `JWT_SECRET` | Secret key for signing JWTs | `a_long_random_string` |
| `JWT_EXPIRE` | Token expiry duration | `7d` |
| `PORT` | Port for the Express server | `5000` |
| `CLIENT_URL` | Frontend origin for CORS | `http://localhost:5173` |

### Frontend (`frontend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |
