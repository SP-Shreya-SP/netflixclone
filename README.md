# Netflix Clone 🎬

A full-stack Netflix-style movie web application with user authentication, MySQL database integration, and TMDB movie data. Built with React, Node.js, Express, and MySQL.

current version is modified into such a way that it can be easily deployed using vercel.

![Netflix Clone](https://img.shields.io/badge/Netflix-Clone-red) ![React](https://img.shields.io/badge/React-18.3-blue) ![Node.js](https://img.shields.io/badge/Node.js-18+-green) ![MySQL](https://img.shields.io/badge/MySQL-Aiven-orange)

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** and **npm**
- **TMDB API Key** (free) - [Get it here](https://www.themoviedb.org/settings/api)
- **Aiven MySQL** (free) - [Sign up here](https://console.aiven.io/signup)

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/netflixclone.git
   cd netflixclone
   ```

2. **Follow the detailed setup guide**
   - See **[SETUP.md](SETUP.md)** for step-by-step instructions to get TMDB API key and Aiven MySQL credentials

3. **Configure environment variables**
   ```bash
   # Backend
   cd backend
   copy .env.example .env
   # Edit backend/.env with your TMDB API key and Aiven MySQL credentials
   
   # Frontend
   cd ../frontend
   copy .env.example .env
   # Edit frontend/.env (VITE_API_BASE_URL should be http://localhost:5000)
   ```

4. **Install dependencies**
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ../frontend
   npm install
   ```

5. **Run the application**
   ```bash
   # Terminal 1 - Backend (port 5000)
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend (port 5173)
   cd frontend
   npm run dev
   ```

6. **Open your browser**
   - Navigate to **http://localhost:5173**
   - Register a new account → Login → Enjoy the Netflix-style movie experience!

---

## 📋 Project Structure

The project is split into two parts:

- **backend**: Node.js/Express REST API with MySQL, bcrypt password hashing, and TMDB proxy.
- **frontend**: React (Vite) single-page app with routes for `/login`, `/register`, and `/home`.

> 🔒 **Security**: Passwords are **never** stored in plain text and all secrets are configured via environment variables.

---

## Features

- **User registration** (`/api/register`)
  - Fields: `userId`, `name`, `email`, `phone`, `password`
  - Validates required fields and email format
  - Hashes password with `bcrypt` before storing
  - Ensures `userId` and `email` are unique
  - Returns structured JSON response
- **User login** (`/api/login`)
  - Fields: `userId`, `password`
  - Verifies credentials using `bcrypt.compare`
  - On success returns user data and a JWT token
  - On failure returns appropriate error messages
- **MySQL integration**
  - Uses environment variables for all DB credentials
  - Automatically creates `users` table on server startup if missing
- **TMDB integration**
  - Backend proxy for TMDB using `TMDB_API_KEY` from environment
  - Endpoints:
    - `/api/movies/trending`
    - `/api/movies/popular`
    - `/api/movies/top_rated`
- **Frontend**
  - React + Vite SPA
  - Routes:
    - `/` → redirects to `/login`
    - `/login` → user login
    - `/register` → user registration
    - `/home` → Netflix-style landing page (requires login)
  - Stores login result (user + token) in `localStorage` under `nc_user`
  - Netflix-like UI:
    - Hero banner with backdrop, title, overview and buttons
    - Horizontal scrollable rows for Trending, Popular, and Top Rated
    - Hover scale animation for posters
    - Fixed top navbar and responsive layout

---

## Prerequisites

- Node.js 18+ and npm
- **TMDB API key** (free) — [Step-by-step: SETUP.md#part-1-get-tmdb-api-key](SETUP.md#part-1-get-tmdb-api-key)
- **Aiven MySQL** (free) — [Step-by-step: SETUP.md#part-2-get-aiven-mysql-connection-details](SETUP.md#part-2-get-aiven-mysql-connection-details)

**→ For detailed steps (TMDB + Aiven + env config), see [SETUP.md](SETUP.md).**

---

## Backend Setup

1. **Install dependencies**

   ```bash
   cd backend
   npm install
   ```

2. **Create environment file**

   Copy `.env.example` to `.env` and fill in your values:

   ```bash
   copy .env.example .env
   ```

   Then edit `backend/.env` and set:

   - `PORT` – backend port (default `5000`)
   - `CLIENT_ORIGIN` – frontend origin (e.g. `http://localhost:5173`)
   - `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT` – from Aiven (see [SETUP.md](SETUP.md))
   - `TMDB_API_KEY` – from TMDB (see [SETUP.md](SETUP.md))
   - `JWT_SECRET` – any long random string

   The server will auto-create the **users** table in your Aiven database if it does not exist.

3. **Run the backend in development**

   ```bash
   cd backend
   npm run dev
   ```

   The API will start (by default) on `http://localhost:5000`.

4. **Production start**

   ```bash
   cd backend
   npm start
   ```

   Make sure `NODE_ENV=production` and `.env` are correctly configured on your server/hosting.

---

## Frontend Setup

1. **Install dependencies**

   ```bash
   cd frontend
   npm install
   ```

2. **Create environment file**

   Copy `.env.example` to `.env` and adjust as needed:

   ```bash
   cp .env.example .env
   ```

   - `VITE_API_BASE_URL` – base URL of the backend (e.g. `http://localhost:5000` in development).

3. **Run the frontend in development**

   ```bash
   cd frontend
   npm run dev
   ```

   Vite will start the app on `http://localhost:5173` by default.

4. **Build for production**

   ```bash
   cd frontend
   npm run build
   npm run preview   # optional local preview
   ```

---

## API Overview

All responses follow the structure:

```json
{
  "success": true,
  "message": "Descriptive message",
  "data": { }
}
```

### POST `/api/register`

**Request body:**

```json
{
  "userId": "john123",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "password": "secret123"
}
```

**Success response:**

```json
{
  "success": true,
  "message": "Registration successful.",
  "data": null
}
```

### POST `/api/login`

**Request body:**

```json
{
  "userId": "john123",
  "password": "secret123"
}
```

**Success response:**

```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "user": {
      "id": 1,
      "userId": "john123",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "1234567890"
    },
    "token": "jwt_token_here_or_null_if_not_configured"
  }
}
```

### GET `/api/movies/trending`

Returns TMDB trending movies proxied from the backend:

```json
{
  "success": true,
  "message": "Movies fetched successfully.",
  "data": {
    "page": 1,
    "results": [ /* TMDB movie objects */ ]
  }
}
```

Similarly for:

- `/api/movies/popular`
- `/api/movies/top_rated`

---

## Database Schema

On startup, the backend ensures the following table exists:

```sql
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(50) NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Security Notes

- Passwords are hashed with `bcrypt` before storage and verified with `bcrypt.compare`.
- Database credentials, TMDB API key, and JWT secret are read from environment variables, not hard-coded.
- Input is sanitized and validated (required fields, email format, minimum password length).
- The backend includes global error handling to avoid leaking internal stack traces to clients.

---

## Running End-to-End (Development)

1. Follow [SETUP.md](SETUP.md) to get TMDB API key and Aiven MySQL details, then set `backend/.env` and `frontend/.env`.
2. In one terminal:

   ```bash
   cd backend
   npm run dev
   ```

3. In another terminal:

   ```bash
   cd frontend
   npm run dev
   ```

4. Open the app in your browser at `http://localhost:5173`:
   - Register a new user on `/register`.
   - You will be redirected to `/login` after successful registration.
   - Log in and you will be redirected to `/home`, where TMDB movie rows load.

---

## Deployment Notes

- Backend and frontend can be deployed independently (e.g., backend on a Node-capable host, frontend as static assets on a CDN).
- Set all environment variables via your hosting provider (never commit secrets).
- In production, ensure:
  - `NODE_ENV=production` for backend.
  - Strong `JWT_SECRET`.
  - Restricted database user with least privileges.

