# MSC Events Portal — Admin Management System

Complete event management platform for discovering, browsing, and managing events with an admin dashboard for CRUD operations (Create, Read, Update, Delete).

---

## 🚀 Quick Start Guide

### Installation & Setup

1. **Clone the repository:**
```bash
git clone https://github.com/aasthasingla15/adminportal.git
cd adminportal
npm install
```

2. **Create environment file:**
```bash
cp .env.example .env.local
```

Edit `.env.local` and add:
```
MONGODB_URI=your_mongodb_connection_string_here
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_admin_password
```

3. **Run locally:**
```bash
npm run dev
```
Visit **http://localhost:3000** in your browser

4. **Build for production:**
```bash
npm run build
npm start
```

---

## 👥 Beginner's Guide: How to Use the Website

### 📱 **Public Website (For Everyone)**

#### 1. **Home Page** (`/`)
- **Featured Event Section**: Showcases the highlighted event of the month with a banner image
- **Upcoming Events**: Browse all upcoming events in a grid layout
- **Event Categories**: Explore different types of events (Workshops, Hackathons, Bootcamps, etc.)
- **Dark/Light Theme**: Toggle between dark and light mode using the theme button in the navbar

#### 2. **Browsing Events** (`/events`)
- **Event List**: View all upcoming events sorted by date
- **Event Card**: Each card shows:
  - Event title
  - Event banner image
  - Category badge with color coding
  - Date, time, and location
  - Quick view option
- **Click on Event Card**: Opens the detailed event page

#### 3. **Event Details Page** (`/events/[id]`)
- **Full Event Information**:
  - Large banner image at the top
  - Event title and category
  - Complete description and details
  - Date, time, venue, and category info in a sticky sidebar (on desktop)
  - Registration link button
- **Back Button**: Click to go back to previous page
- **Register Now**: External link to registration form (opens in new tab)

#### 4. **About Page** (`/about`)
- Information about the Microsoft Student Chapter
- Club mission and vision
- Contact information

#### 5. **Contact Page** (`/contact`)
- Send messages to the admin team
- Get support and feedback

#### 6. **Navigation Bar**
- **Logo/Brand**: Click to go to home page
- **Navigation Links**: Home, About, Contact
- **Admin Portal**: Direct link to admin dashboard (top right)
- **Theme Toggle**: Switch between dark and light modes

---

## 🔐 Admin Portal — CRUD Operations Guide

### **Where to Find the Admin Portal?**
- **URL**: `http://localhost:3000/admin/login` (or click "ADMIN" button in navbar)
- **Location**: Top right corner of the website navbar

### **Admin Features Location Map**

#### **📋 Dashboard** (`/admin`)
- Overview of system statistics
- Quick links to all admin functions
- View total events, registrations, and more

#### **🔑 Admin Login** (`/admin/login`)
1. Enter your **Admin Username**
2. Enter your **Admin Password**
3. Click **"Sign In"**
4. You'll be redirected to the admin dashboard
5. Session lasts for the duration of your activity (HTTP-only cookie)

---

### **1️⃣ CREATE Events** (`/admin/events/create`)

**Steps to Add a New Event:**

1. Click **"Events"** in admin sidebar → **"Create Event"**
2. Fill in the form fields:
   - **Event Title**: Name of the event (e.g., "Web Development Workshop")
   - **Description**: Detailed description of what the event is about
   - **Category**: Select from dropdown (Workshop, Hackathon, Bootcamp, Competition, Talk, Seminar, Cultural, Sports, Conference, Other)
   - **Date**: When the event will take place (YYYY-MM-DD format)
   - **Time**: Event start time (e.g., 10:00 AM)
   - **Venue**: Physical location or "Online" if virtual
   - **Banner Image**: Upload event poster/image (base64 or URL)
   - **Registration Link**: External link to registration form
   - **Status**: Select "Upcoming", "Ongoing", or "Completed"
   - **Featured**: Check this box to make it the featured event on homepage
3. Click **"Create Event"** button
4. Success message will appear, and you'll be redirected to the events list

---

### **2️⃣ READ / VIEW Events** (`/admin/events`)

**Browse All Events:**

1. Click **"Events"** in admin sidebar
2. See a table/list of all events with columns:
   - Event Title
   - Category
   - Date
   - Status
   - Actions (View, Edit, Delete)
3. Click **"View"** button to see full event details
4. Or click event title to open details page

**Search & Filter:**
- Use search bar to find events by title
- Filter by status (Upcoming, Ongoing, Completed)
- Filter by category

---

### **3️⃣ UPDATE Events** (`/admin/events/edit/[id]`)

**Edit an Existing Event:**

1. Go to **"Events"** → Find event in list
2. Click **"Edit"** button next to the event
3. Modify any field you want to change:
   - Update title, description, date, time, venue
   - Change category or status
   - Upload a new banner image
   - Update registration link
   - Toggle featured status
4. Click **"Update Event"** button
5. Success message appears, changes are saved to database

**Quick Edit Tips:**
- All fields can be updated independently
- Changing "Featured" to true automatically removes featured status from other events
- Date/time changes don't affect existing registrations

---

### **4️⃣ DELETE Events** (`/admin/events`)

**Remove an Event:**

1. Go to **"Events"** → Find event in list
2. Click **"Delete"** button next to the event
3. Confirm deletion when prompted (no undo available)
4. Event is removed from database and website
5. Any registrations linked to this event are also removed

**Delete Warning:**
⚠️ This action cannot be undone. Make sure the event is no longer needed.

---

## 🎯 Other Admin Features

### **📊 Analytics** (`/admin/analytics`)
- View event statistics and trends
- See registration numbers
- Track popular event categories
- View attendance data

### **📅 Calendar** (`/admin/calendar`)
- Visual calendar view of all events
- See events by month
- Quick event details on hover
- Click date to create new event

### **👥 Registrations** (`/admin/registrations`)
- View all event registrations
- See registered user details
- Export registration data
- Send bulk messages to attendees

### **📂 Categories** (`/admin/categories`)
- Manage event categories
- Create custom categories
- Edit existing categories
- Set category colors and icons

### **⚙️ Settings** (`/admin/settings`)
- Configure website settings
- Update site title and description
- Manage admin account
- Set theme preferences
- Configure notification emails

---

## 🛡️ Technical Architecture

### **Database**
- **MongoDB**: Stores all event data
- **Collections**: Events, Users, Registrations, Categories
- Connection string in `.env.local`

### **Authentication**
- HTTP-only cookie-based sessions (named `admin_session`)
- Protected API endpoints verify admin credentials
- Automatic logout after inactivity

### **API Endpoints**
```
GET    /api/events              — Get all events
GET    /api/events/[id]         — Get single event
POST   /api/events              — Create event (admin only)
PUT    /api/events/[id]         — Update event (admin only)
DELETE /api/events/[id]         — Delete event (admin only)

POST   /api/auth/login          — Admin login
GET    /api/auth/session        — Check session
POST   /api/auth/logout         — Admin logout
```

### **Performance Optimizations**
- Server-side rendering (SSR) for home page
- Response caching (1 hour for event endpoints)
- Optimized image loading with responsive sizes
- Request deduplication for event details
- Mobile-responsive design with CSS media queries

---

## 📋 Key Features Checklist

### **Public Features** ✅
- [x] View all upcoming events
- [x] Search and filter events by category
- [x] View detailed event information
- [x] Register for events via external links
- [x] Dark/light theme toggle
- [x] Fully responsive mobile design
- [x] Fast loading (1-2 seconds for event details)

### **Admin Features** ✅
- [x] **Create** new events with all details
- [x] **Read** view all events and details
- [x] **Update** existing event information
- [x] **Delete** events from database
- [x] Mark events as featured
- [x] Filter by status and category
- [x] Track registrations
- [x] View analytics and statistics
- [x] Manage categories
- [x] Configure settings

---

## 🌍 Deployment

### **Deploy on Vercel (Recommended)**
```bash
# Login to Vercel
npm i -g vercel
vercel

# Configure environment variables in Vercel dashboard
# Add MONGODB_URI, ADMIN_USERNAME, ADMIN_PASSWORD

# Deploy
vercel --prod
```

### **Deploy on Other Platforms**
Ensure your host has:
- Node.js 14+ support
- Access to MongoDB
- Environment variable configuration support

---

## 📊 Assumptions & Architecture

- **MongoDB** is the single source of truth for all event data
- **Admin authentication** uses HTTP-only cookies (secure against XSS)
- **Banner images** can be base64-encoded or remote URLs
- **List API** excludes large image blobs for faster loading
- **Session timeout** prevents unauthorized access
- **API caching** reduces database load and improves response times

---

## 🐛 Troubleshooting

### **"Unable to load event" error**
- Check MongoDB connection string in `.env.local`
- Verify event ID is correct
- Check database has event data

### **Admin login fails**
- Verify username and password in `.env.local`
- Check cookies are enabled in browser
- Clear browser cache and try again

### **Images not displaying**
- Check image URL is accessible
- For base64 images, verify data format
- Try re-uploading image in admin panel

### **Slow event loading**
- Clear browser cache
- Check MongoDB query performance
- Verify network connection speed

---

## 📞 Support & Contact

For issues or questions:
- Email: contact@mscevents.com
- GitHub Issues: [github.com/aasthasingla15/adminportal/issues](https://github.com/aasthasingla15/adminportal/issues)
- Contact Form: Available on `/contact` page
- GitHub Repository: [github.com/aasthasingla15/adminportal](https://github.com/aasthasingla15/adminportal)

---

## 📄 License

This project is licensed under MIT License.

---

**Last Updated**: 2026-08-14  
**Version**: 1.0.0
