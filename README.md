# MSC Events Portal - Premium Cinematic Event CMS

A premium, modern event management platform and administrative CMS. This application features a dual-theme layout that satisfies both light-mode editorial designs and dark cinematic glassmorphism visual directions, powered by the provided background video.

---

## 🌟 Key Features & Implementation Details

1. **Dual-Theme Design (Visual Masterpiece)**:
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

6. **Image Uploads (Base64 Data URIs)**:
   - Drag-and-drop file interface converting images to Base64 strings. This enables local execution without external storage hosts (AWS S3 or Cloudinary).
   - Raised body parser size limits to `10MB` for reliable asset processing.

7. **Public Search, Categories, & Pagination**:
   - Real-time search query checking against event titles, descriptions, and venues.
   - Horizontal category filter buttons matching the editorial aesthetic.
   - Responsive page navigation controls (8 items per page) to support large numbers of events smoothly.
   - "Register Now" buttons opening the event's external link in a new browser tab.

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
