# Step-by-Step Setup Guide

This guide walks you through getting **TMDB API key** and **Aiven MySQL** connection details, then configuring the Netflix Clone app.

---

## Part 1: Get TMDB API Key

The app uses [The Movie Database (TMDB)](https://www.themoviedb.org/) to show movie posters and data. You need a free API key.

### Step 1: Create a TMDB account

1. Open your browser and go to: **https://www.themoviedb.org/signup**
2. Fill in:
   - **Username** (choose one)
   - **Password** (at least 8 characters)
   - **Email address**
3. Click **Sign Up**.
4. Check your email and click the verification link if TMDB sends one.

### Step 2: Log in to TMDB

1. Go to: **https://www.themoviedb.org/login**
2. Enter your **Username** and **Password**.
3. Click **Login**.

### Step 3: Request an API key

1. Go to: **https://www.themoviedb.org/settings/api**
   - Or: Click your **profile icon** (top right) → **Settings** → **API** in the left menu.
2. Under **API**, click **Request an API Key** (or **Create** if you see that).
3. Choose **Developer** (personal use).
4. Accept the **Terms of Use** and **API Terms of Use**.
5. Fill in the form:
   - **Application Name**: e.g. `Netflix Clone`
   - **Application URL**: e.g. `http://localhost:5173` (or leave default)
   - **Application Summary**: e.g. `Learning project to display movies`
6. Click **Submit**.

### Step 4: Copy your API Key (v3 Auth)

1. On the same **API** settings page, find the section **API Key (v3 auth)**.
2. Copy the **API Key** value (long string like `a1b2c3d4e5f6...`).
3. **Paste it somewhere safe** — you will put it in `backend/.env` in Part 3.

You do **not** need the "API Read Access Token" for this app; the **API Key (v3 auth)** is enough.

---

## Part 2: Get Aiven MySQL Connection Details

The app stores user accounts (registration/login) in a MySQL database. Aiven offers a **free** MySQL service.

### Step 1: Create an Aiven account

1. Go to: **https://console.aiven.io/signup**
2. Sign up with **Email** or **Google/GitHub**.
3. Verify your email if required and log in to: **https://console.aiven.io/**

### Step 2: Create a MySQL service

1. In the Aiven Console, click **+ Create service** (or **New service**).
2. Choose **MySQL**.
3. Select a **Cloud provider** and **Region** (e.g. Google Cloud, region closest to you).
4. Choose the **Free** plan (if available) or the cheapest plan.
5. Give the service a **Service name**, e.g. `netflix-clone-db`.
6. Click **Create service**.
7. Wait until the service status is **Running** (may take a few minutes).

### Step 3: Create a database inside the service

1. In the left sidebar, click your **MySQL service** name.
2. Click **Databases** in the left menu.
3. Click **Add database**.
4. Enter a name, e.g. **`netflix_clone`** (use underscores, no spaces).
5. Click **Add** (or **Create**).
6. The new database will appear in the list. Remember this name — it is your **DB_NAME**.

### Step 4: Get connection details

1. Stay on your MySQL service page.
2. Open the **Overview** tab (or **Connection information**).
3. Find the **Connection information** or **Service URI** section.
4. You will see (names may vary slightly):
   - **Host** → use as `DB_HOST`
   - **Port** → use as `DB_PORT` (often `12345` or similar, not 3306)
   - **User** → use as `DB_USER` (often `avnadmin`)
   - **Password** → use as `DB_PASSWORD` (click **Show** to reveal; copy it)
   - **Database** → use the one you created, e.g. `netflix_clone` as `DB_NAME`

5. Copy each value. You will paste them into `backend/.env` in the next part.

**Optional:** Aiven may offer an **SSL** mode and a **CA certificate**. This app uses a basic connection; if you get SSL errors, check the Aiven docs for "Connect without SSL" or use the provided certificate path in advanced setups.

---

## Part 3: Configure the Netflix Clone App

### Step 1: Backend environment (`.env`)

1. Open the project folder: `NetflixClone/backend/`
2. If there is no `.env` file, copy `.env.example` and rename the copy to `.env`:
   - Windows (PowerShell): `Copy-Item .env.example .env`
   - Or create a new file named `.env` in the `backend` folder.
3. Open `backend/.env` in a text editor and set:

```env
PORT=5000
CLIENT_ORIGIN=http://localhost:5173

# Paste your Aiven MySQL details from Part 2, Step 4:
DB_HOST=paste_host_here
DB_USER=paste_user_here
DB_PASSWORD=paste_password_here
DB_NAME=netflix_clone
DB_PORT=paste_port_here

# Paste your TMDB API Key from Part 1, Step 4:
TMDB_API_KEY=paste_your_tmdb_api_key_here

# Any long random string (e.g. use a password generator):
JWT_SECRET=your_very_secure_random_string_here
```

4. Save the file. Do **not** commit `.env` to Git (it should be in `.gitignore`).

### Step 2: Frontend environment (optional)

1. Open `NetflixClone/frontend/`
2. If there is no `.env` file, copy `frontend/.env.example` to `frontend/.env`.
3. Set at least:
   - `VITE_API_BASE_URL=http://localhost:5000`  
   So the frontend talks to your backend.  
   Leave `VITE_TMDB_API_KEY` as is unless you add client-side TMDB calls later.

### Step 3: Install dependencies

Open a terminal (PowerShell or Command Prompt).

**Backend:**

```bash
cd C:\Users\WIN10\Desktop\NetflixClone\backend
npm install
```

**Frontend:**

```bash
cd C:\Users\WIN10\Desktop\NetflixClone\frontend
npm install
```

### Step 4: Run the app

**Terminal 1 – Backend (port 5000):**

```bash
cd C:\Users\WIN10\Desktop\NetflixClone\backend
npm run dev
```

Wait until you see something like: `Server running on port 5000` and `Database initialized successfully.`

**Terminal 2 – Frontend (port 5173):**

```bash
cd C:\Users\WIN10\Desktop\NetflixClone\frontend
npm run dev
```

When Vite is ready, it will show: `Local: http://localhost:5173/`

### Step 5: Use the app in the browser

1. Open **http://localhost:5173** in your browser.
2. Click **Sign up now** and register with:
   - User ID, name, email, phone, password.
3. After successful registration you will be redirected to **Sign In**.
4. Sign in with your **User ID** and **password**.
5. You should be redirected to the **Netflix-style home page** with movies from TMDB.

---

## Quick reference: Where to paste what

| What you got        | Where it goes in `backend/.env` |
|---------------------|---------------------------------|
| TMDB API Key (v3)   | `TMDB_API_KEY=...`              |
| Aiven Host          | `DB_HOST=...`                  |
| Aiven Port          | `DB_PORT=...`                  |
| Aiven User          | `DB_USER=...`                  |
| Aiven Password      | `DB_PASSWORD=...`              |
| Database name       | `DB_NAME=...` (e.g. netflix_clone) |

---

## Troubleshooting

- **"Database configuration is missing"**  
  Check that `backend/.env` has all of: `DB_HOST`, `DB_USER`, `DB_NAME`, `DB_PASSWORD`, `DB_PORT`.

- **"Failed to fetch movies" / blank movie rows**  
  Check that `TMDB_API_KEY` in `backend/.env` is correct and has no extra spaces.

- **MySQL connection refused / timeout**  
  - Ensure the Aiven MySQL service is **Running**.  
  - Use the **exact** Host and Port from Aiven (port is often not 3306).  
  - If your network blocks outbound MySQL, try another network or check firewall.

- **"Users table" or "table doesn't exist"**  
  The backend creates the `users` table automatically on startup. Restart the backend after fixing `DB_*` values.

- **CORS errors in browser**  
  Ensure `CLIENT_ORIGIN=http://localhost:5173` in `backend/.env` and that you open the app at `http://localhost:5173`.

For more details, see the main [README.md](README.md).
