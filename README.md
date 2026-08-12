# 🎓 MSC Events Portal — Admin Dashboard

> A full-stack event management system built with **Next.js**, **MongoDB**, and **Vercel-ready deployment**. Administrators can create, manage, and delete events through a secure dashboard; the public sees them dynamically on the Events page with **Register Now** buttons linking to external registration URLs.

---

## 🌐 Live Demo

| Page | URL |
|---|---|
| 🏠 Public Home | `/` |
| 📅 Public Events | `/events` |
| 🔐 Admin Login | `/admin/login` |
| 🎛️ Admin Dashboard | `/admin` |
| ➕ Create Event | `/admin/events/create` |

**Demo Credentials:**
```
Username : admin
Password : adminpassword123
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14 (Pages Router + API Routes) |
| **Runtime** | Node.js (via Next.js API Routes) |
| **Database** | MongoDB with Mongoose ODM |
| **Styling** | Vanilla CSS (CSS Variables, CSS Modules, JSX inline styles) |
| **Icons** | Lucide React |
| **Deployment** | Vercel |

---

## ✅ Functional Requirements Checklist

### 1. Authentication
- [x] Admin login page at `/admin/login`
- [x] HTTP-only session cookie (secure, `SameSite=Lax`)
- [x] Protected admin routes — unauthenticated users redirected to login
- [x] Logout functionality clears the session cookie
- [x] Credential hint displayed on login page for demo purposes

### 2. Admin Dashboard
- [x] View all events with search, status filter, and category filter
- [x] Add a new event (`/admin/events/create`)
- [x] Edit an existing event (`/admin/events/edit/[id]`)
- [x] Delete an event with confirmation modal
- [x] Dashboard overview with stats: Total Events, Upcoming, Categories, Published
- [x] Recent events table on dashboard overview

### 3. Event Fields
Each event stores: **Title**, **Description**, **Date**, **Time**, **Venue**, **Category**, **Banner Image**, **Registration Link**, **Status**, **Featured flag**

### 4. Public Events Page
- [x] Fetches events from MongoDB via API Route
- [x] Displays all upcoming events in a responsive grid
- [x] Shows event title, description, date/time, venue, and category badge
- [x] **Register Now button** on every card — opens registration link in a new tab
- [x] Details page at `/events/[id]` with full event info
- [x] Falls back to localStorage cache when MongoDB is offline

### 5. Database (MongoDB + Mongoose)
- [x] Full CRUD via Next.js API Routes
- [x] Automatic unfeaturing hook — only one featured event at a time
- [x] `offlineFallback` flag in API responses when DB is unreachable

### 6. Responsive Design
- [x] Fully responsive: mobile, tablet, desktop
- [x] Hamburger navigation drawer on mobile
- [x] Admin sidebar collapses to a drawer on small viewports
- [x] Cards stack to single-column on mobile
- [x] Forms adapt to single-column layout on mobile

---

## 🌟 Bonus Features Implemented

| Feature | Status |
|---|---|
| Event search | ✅ |
| Category filters | ✅ |
| Form validation | ✅ |
| Loading indicators / Skeleton cards | ✅ |
| Toast notifications | ✅ |
| Pagination (8 per page) | ✅ |
| Dark mode toggle (Sun/Moon) | ✅ |
| Image upload (Base64 + Cloudinary support) | ✅ |
| Featured event spotlight on homepage | ✅ |
| localStorage offline fallback sync | ✅ |

---

## 🗄️ MongoDB Schema

```javascript
// models/Event.js
{
  title:            String,   // required, max 100 chars
  description:      String,   // required
  date:             String,   // format: YYYY-MM-DD
  time:             String,   // format: HH:MM AM/PM
  venue:            String,   // required
  category:         String,   // enum: Workshop | Hackathon | Bootcamp | Competition | Talk | Seminar | Cultural | Sports | Conference | Other
  bannerImage:      String,   // Base64 data URI or Cloudinary HTTPS URL
  registrationLink: String,   // valid external URL
  status:           String,   // enum: Upcoming | Completed | Draft (default: Upcoming)
  featured:         Boolean,  // default: false — only one event featured at a time
  createdAt:        Date,     // auto
  updatedAt:        Date,     // auto
}
```

---

## 🔌 API Routes

| Method | Route | Description | Auth Required |
|---|---|---|---|
| GET | `/api/events` | List all events (sorted by date) | No |
| POST | `/api/events` | Create new event | Yes |
| GET | `/api/events/[id]` | Get single event | No |
| PUT | `/api/events/[id]` | Update event | Yes |
| DELETE | `/api/events/[id]` | Delete event | Yes |
| POST | `/api/auth/login` | Admin login | No |
| POST | `/api/auth/logout` | Admin logout | No |
| GET | `/api/auth/session` | Check session status | No |

---

## 📁 Project Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Step 1 — Clone & Install

```bash
git clone https://github.com/aasthasingla15/adminportal.git
cd adminportal
npm install
```

### Step 2 — Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# MongoDB connection string
MONGODB_URI=mongodb://127.0.0.1:27017/msc_events

# Admin credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=adminpassword123

# Optional: Cloudinary image uploads (leave blank to use Base64 fallback)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=
```

### Step 3 — Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🚀 Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import your GitHub repo
3. Add **Environment Variables** in Vercel project settings:
   - `MONGODB_URI` → your MongoDB Atlas connection string
   - `ADMIN_USERNAME` → `admin`
   - `ADMIN_PASSWORD` → `adminpassword123`
4. Click **Deploy** — live in ~2 minutes

> **Note:** Use [MongoDB Atlas](https://cloud.mongodb.com) (free tier) for the `MONGODB_URI` on Vercel, as local MongoDB won't be accessible.

---

## 💡 Design Decisions & Assumptions

| Decision | Rationale |
|---|---|
| **Dummy credentials** | Problem statement explicitly allows dummy credentials for authentication |
| **HTTP-Only cookie session** | More secure than localStorage tokens; prevents XSS attacks |
| **Base64 image fallback** | Ensures image uploads work without mandatory Cloudinary configuration |
| **localStorage offline sync** | Allows the public events page to show events even if MongoDB is temporarily unreachable |
| **One featured event** | Backend enforces a single featured event via an auto-unfeaturing hook |
| **Pages Router (not App Router)** | More stable for the existing codebase; API Routes work identically |
| **CSS-in-JS (styled-jsx)** | Avoids TailwindCSS dependency while keeping component-scoped styles |
| **`offlineFallback` API flag** | Allows the client to distinguish "DB offline" from "genuine error" |

---

## 📱 Responsive Breakpoints

| Breakpoint | Layout Change |
|---|---|
| `> 1024px` | 4-column event grid, full sidebar |
| `768px – 1024px` | 2-column event grid, full sidebar |
| `< 768px` | 1-column grid, hamburger nav, stacked forms |

---

## 🔐 Security Notes

- Admin session stored in **HTTP-only** cookie (`admin_session`) — inaccessible to JavaScript
- All admin API routes check for a valid session cookie before processing
- Unauthenticated requests to `/admin/*` pages redirect to `/admin/login`
- Credentials configurable via environment variables (not hardcoded)



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
