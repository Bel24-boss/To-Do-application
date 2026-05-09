# Momentum To-Do Application

A full-stack competency project built with a FastAPI backend and a React + TypeScript frontend.

## What it includes

- Secure user registration with hashed passwords
- Login with bearer-token authentication
- Protected route verification through `GET /protected`
- Request and error logging to `backend/app.log`
- CORS enabled for `http://localhost:3000`
- Authenticated to-do creation, listing, updating, and deletion
- Responsive, polished UI with loading states and inline error handling

## Tech stack

- Backend: Python, FastAPI, SQLAlchemy, JWT, Passlib
- Frontend: React, TypeScript, Vite, Axios

## Run locally

### Backend

```bash
cd backend
python -m pip install -r requirements.txt
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:3000` and the backend runs at `http://localhost:8000`.

## Core API

- `POST /register`
- `POST /login`
- `GET /protected`
- `GET /todos`
- `POST /todos`
- `PUT /todos/{todo_id}`
- `DELETE /todos/{todo_id}`

## Notes

- The backend supports a `DATABASE_URL` environment variable for swapping the default SQLite database with a remote database connection when needed.
- The frontend automatically includes the bearer token on protected requests and clears the session on `401 Unauthorized` responses.
