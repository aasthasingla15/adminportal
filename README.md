# MSC Events — Admin Portal

Simple instructions to run this project, the assumptions made during development, and the features implemented.

---

## Quick Setup

1. Clone the repository:

```bash
git clone https://github.com/aasthasingla15/adminportal.git
cd adminportal
npm install
```

2. Create environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` and set at minimum:

- `MONGODB_URI` — your MongoDB connection string
- `ADMIN_USERNAME` and `ADMIN_PASSWORD` — admin credentials

3. Run locally:

```bash
npm run dev
```

Open http://localhost:3000

4. Build for production:

```bash
npm run build
npm start
```

---

## Assumptions (simple wording)

- MongoDB is the only source of truth for event data.
- Admin authentication is session-cookie based (HTTP-only cookie named `admin_session`).
- Banner images may be stored as base64 or remote URLs; list API avoids returning large image blobs.
- Deployment target is Vercel or similar serverless host with access to the MongoDB instance.

---

## Features Implemented (easy wording)

- Public pages: Home, Events list, Event details, About, Contact.
- Admin Portal: Login, Dashboard, Create/Edit/Delete events.
- Events are stored and retrieved from MongoDB via Next.js API routes.
- Image upload supported (Cloudinary optional); event detail pages show full banners.
- Event list optimized: the listing API returns only small fields (no large image blobs), and event card images lazy-load.
- Client-side search and category filtering operate on the loaded event list (no extra API calls per keystroke).
- External registration links open in a new tab (safe attributes applied).
- Admin routes protected; public pages do not require authentication.

---

## How things are organized (short)

- `pages/` — Next.js pages and API routes.
- `components/` — React components used by pages.
- `lib/` — helpers (MongoDB connection, etc.).
- `models/` — Mongoose schemas.

---

## Notes & Next Steps (optional)

- For best performance, store thumbnails or use a cloud image service (Cloudinary) and return thumbnail URLs in the events list.
- To include event cards in the initial HTML for SEO, consider server-side rendering the events list (getServerSideProps). Currently the listing fetches client-side and shows skeletons while loading.

---

If you'd like, I can: add thumbnails (Cloudinary), convert the events list to SSR, or run a production timing report.

---

## Overview

This repository contains a single Next.js application with two distinct experiences:

- Public website: home, events listing, and event detail pages.
- Protected Admin Portal: login, dashboard, and event management (create/edit/delete).

MongoDB is the single source of truth for events. All event reads and writes go through the Next.js API routes.

---

## Features

### Public Website
- Home page with featured/upcoming events
- Events listing (`/events`) showing upcoming events
- Event details page (`/events/[id]`)
- External registration links open in a new tab
- Responsive design for desktop/tablet/mobile

### Admin Portal
- Admin login at `/admin/login` (session cookie-based)
- Protected admin routes (dashboard and events pages)
- Dashboard overview with stats and recent events
- View, create, edit, and delete events
- Image/banner upload with optional Cloudinary support (base64 fallback)
- Responsive admin interface

### Database & API
- MongoDB via Mongoose
- Next.js API routes for CRUD operations:
   - `GET /api/events`
   - `POST /api/events` (admin only)
   - `GET /api/events/[id]`
   - `PUT /api/events/[id]` (admin only)
   - `DELETE /api/events/[id]` (admin only)

---

## Technology Stack

Inspect `package.json` — the project uses:

- Next.js
- React
- MongoDB (Mongoose)
- Lucide React (icons)

No additional UI frameworks (Tailwind, Chakra, etc.) are required.

---

## Project Structure

Top-level folders/files of interest:

```
pages/
   index.js
   events/
      index.js
      [id].js
   admin/
      login.js
      index.js
      events/
         create.js
         index.js
         edit/[id].js
   api/
      events
         index.js
         [id].js
components/
lib/
models/
public/
README.md
package.json
```

---

## Routes

Public routes:

- `/`
- `/events`
- `/events/[id]`
- `/about`
- `/contact`

Admin routes (protected):

- `/admin/login`
- `/admin`
- `/admin/events`
- `/admin/events/create`
- `/admin/events/edit/[id]`

API routes:

- `/api/events`
- `/api/events/[id]`

---

## Event Schema

The Mongoose model `models/Event.js` defines the event document with these fields:

- `title` (String, required)
- `description` (String, required)
- `date` (String, format YYYY-MM-DD, required)
- `time` (String, required)
- `venue` (String, required)
- `category` (String, enum)
- `bannerImage` (String, base64 or HTTPS URL)
- `registrationLink` (String)
- `status` (String, enum: Upcoming/Completed/Draft)
- `featured` (Boolean)

---

## Environment Variables

Required variables (placeholders):

```
MONGODB_URI=your_mongodb_connection_string
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_admin_password

# Optional (Cloudinary unsigned uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=
```

Do NOT commit real credentials to the repository.

---

## Local Development

1. Clone the repo:

```bash
git clone https://github.com/aasthasingla15/adminportal.git
cd adminportal
npm install
```

2. Create `.env.local` from `.env.example` and set `MONGODB_URI` and admin credentials.

3. Run the dev server:

```bash
npm run dev
```

Open `http://localhost:3000`.

---

## Build & Deploy

Build locally:

```bash
npm run build
```

Deploy to Vercel by connecting the GitHub repository and setting `MONGODB_URI` in Vercel environment variables. Ensure MongoDB Atlas network access allows Vercel IPs or set access appropriately.

---

## Authentication

Admin authentication uses an HTTP-only cookie (`admin_session`) set after a successful login. The server-side API routes check this cookie before allowing create/update/delete operations.

If demo credentials are present in `.env.example`, they can be used for testing; otherwise configure admin credentials in `.env.local`.

---

## Removing Test Data

Temporary test events (created during debugging) have been removed from the production database. If you see test titles like "SYNC TEST EVENT" or "SYNC PUBLIC EVENT", delete them via the Admin Dashboard or the API.

---

## Design Decisions

- Keep public and admin experiences separate within one Next.js application.
- MongoDB is the single source of truth — no runtime localStorage or mock fallbacks are used for event data.
- External registration links open in new tabs; internal navigation uses Next.js `Link` and opens in the same tab.

---

## Contact

For questions, open an issue on the repository or contact the maintainer.




   - **Light Editorial Mode**: Matches the provided mockup screenshot. Features a clean white/lavender background, violet primary accents,rounded cards, subtle shadows, and the **provided video integrated on the right (60%) of the Hero section**.
   - **Cinematic Dark Glass Mode**: Renders the **provided video as a fixed, fullscreen viewport background**. All components, sidebars, forms, and cards transition into semi-transparent glass layouts with dark overlays and `backdrop-filter: blur(20px)` that float above the playing video.
   - Includes a floating Sun/Moon toggle button in the navbar to switch modes smoothly.

2. **Automatic Video Asset Migration**:
   - The application features a self-healing setup script on load. It automatically detects the raw `.mp4` file in the workspace root and moves/copies it to `public/videos/hero.mp4` upon server start, bypassing local permissions blockages.

3. **Admin Portal & Protected Routes**:
   - Secure login route (`/login`) with credential validation and secure HTTP-Only session cookies.
   - Full control dashboard (`/admin`) with server-side authorization blocks. Unauthenticated users are redirected automatically.

4. **Featured Event Integration**:
   - Added a `featured` boolean flag to the event model.
   - Built check-controls inside the creation and editing dashboards.
   - Displayed the marked featured event in a custom prominent side-by-side homepage spotlight banner.

5. **Complete CRUD (Create, Read, Update, Delete)**:
   - Create new events with responsive forms.
   - Choose from categories: **Workshop, Hackathon, Bootcamp, Competition, Talk, Seminar, Cultural, Sports, Conference, Other**.
   - Live-rendering tilt card views inside the admin panel.
   - Delete entries securely with confirmation controls.

6. **Image Uploads (Cloudinary with Base64 Fallback)**:
   - Supports direct unsigned file uploads to Cloudinary. If `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` and `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` are configured in `.env.local`, banners are uploaded directly to Cloudinary and stored as secure HTTPS URLs in MongoDB.
   - If not configured, or if the API call fails, the client automatically falls back to encoding the files as Base64 strings. This guarantees out-of-the-box functionality without mandatory configuration, while supporting a production-ready image storage strategy.

7. **Automatic Unfeaturing Hook**:
   - The backend API (`POST /api/events` and `PUT /api/events/[id]`) automatically updates other entries to set `featured: false` if a new/updated event is flagged as featured. This guarantees only one spotlight event exists at a time.

8. **Dynamic Past Events Exclusion**:
   - The public Homepage Carousel and Events Listing pages compare event date strings with the current date, automatically excluding past events from the "Upcoming Events" listings.

9. **Dashboard Layout Realignment**:
   - Rewrote the Admin overview dashboard (`/admin`) to match the requested wireframe structure, rendering statistics cards (Total, Upcoming, Categories, Published) and a Recent Events list with action button links (View, Edit, Delete).
   - Custom CSS collapses columns and hides auxiliary table cells on small viewports for responsive sizing.

---

## 🛠️ Tech Stack

- **Framework**: Next.js
- **Frontend Logic**: React
- **Icons**: Lucide React
- **Database**: MongoDB (via Mongoose ODM)
- **Styling**: Vanilla CSS (CSS Variables + CSS Modules for maximum performance and visual precision)

---

## 📁 Setup Instructions

### Step 1: Install Dependencies
Open a command prompt or terminal in the project directory and run:
```bash
npm install
```

### Step 2: Configure Environment
Create a `.env.local` file in the project root (you can copy `.env.example`):
```bash
cp .env.example .env.local
```
Ensure you have MongoDB running locally at `mongodb://127.0.0.1:27017` (the default port), or update the `MONGODB_URI` to point to a MongoDB Atlas cluster.

### Step 3: Run Development Server
Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Credentials

Use the following default credentials to log into the Admin Dashboard:
- **Username**: `admin`
- **Password**: `adminpassword123`

To customize these, modify the values inside `.env.local` in the project root.

---

## 🔌 API Routes

- `GET /api/events` - Retrieves all events from the database sorted by date.
- `POST /api/events` - Creates a new event. (Requires Admin session).
- `GET /api/events/[id]` - Retrieves a specific event.
- `PUT /api/events/[id]` - Updates an event. (Requires Admin session).
- `DELETE /api/events/[id]` - Deletes an event. (Requires Admin session).

---

## 🗄️ Database Schema

```javascript
{
  title: String,
  description: String,
  date: String,
  time: String,
  venue: String,
  category: String,
  bannerImage: String, // Stored as Base64 string
  registrationLink: String,
  featured: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 📱 Mobile Responsiveness

- Hamburger navigation drawer on public pages.
- Sidebar collapses into a responsive drawer on the admin dashboard.
- Admin lists adapt from data tables into grid cards on viewports under `768px` to prevent horizontal scrolling.
- Forms, hero grids, and statistics cards transition into single-column layouts for touch-friendly interfaces.
