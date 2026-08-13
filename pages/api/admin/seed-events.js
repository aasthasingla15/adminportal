/**
 * POST /api/admin/seed-events
 *
 * ONE-TIME migration endpoint. Seeds the 4 original demo events into MongoDB
 * so they are visible on the public Events page and the Admin Portal.
 *
 * Protected — requires admin session cookie.
 *
 * Usage: Call this once from Postman, curl, or the browser console after deploying:
 *   fetch('/api/admin/seed-events', { method: 'POST' })
 *     .then(r => r.json()).then(console.log)
 *
 * After seeding, you can disable this route by deleting this file.
 */

import dbConnect from '../../../lib/mongodb';
import Event from '../../../models/Event';

const SEED_EVENTS = [
  {
    title: 'Azure Cloud Dev Summit',
    description: 'Deep dive into cloud native architectures, serverless computing, and hands-on deployment with Microsoft Azure.',
    date: '2026-09-18',
    time: '10:00 AM',
    venue: 'Auditorium 1, IGDTUW',
    category: 'Workshop',
    bannerImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
    registrationLink: 'https://mscigdtuw.vercel.app/',
    status: 'Upcoming',
    featured: true
  },
  {
    title: 'Imagine Cup Hackathon',
    description: 'The premier student technology competition. Build prototypes, solve global challenges, and win mentorship from Microsoft experts.',
    date: '2026-09-22',
    time: '09:00 AM',
    venue: 'Tech Hall, IGDTUW',
    category: 'Hackathon',
    bannerImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80',
    registrationLink: 'https://mscigdtuw.vercel.app/',
    status: 'Upcoming',
    featured: false
  },
  {
    title: 'AI/ML Innovation Bootcamp',
    description: 'Comprehensive bootcamp on modern machine learning techniques, neural networks, and model deployment.',
    date: '2026-09-28',
    time: '11:00 AM',
    venue: 'Lab 3, IGDTUW',
    category: 'Bootcamp',
    bannerImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    registrationLink: 'https://mscigdtuw.vercel.app/',
    status: 'Upcoming',
    featured: false
  },
  {
    title: 'Algorithmic Coding Showdown',
    description: 'Showcase your competitive programming skills in this intense multi-round algorithm sprint.',
    date: '2026-10-05',
    time: '02:00 PM',
    venue: 'CS Department, IGDTUW',
    category: 'Competition',
    bannerImage: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&auto=format&fit=crop&q=80',
    registrationLink: 'https://mscigdtuw.vercel.app/',
    status: 'Upcoming',
    featured: false
  }
];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Require admin session
  const session = req.cookies.admin_session;
  if (session !== 'authenticated-session-token-xyz') {
    return res.status(401).json({ success: false, message: 'Unauthorized. Log in to the Admin Portal first.' });
  }

  try {
    await dbConnect();

    const results = [];
    const skipped = [];

    for (const seedEvent of SEED_EVENTS) {
      // Check if an event with the same title already exists to prevent duplicates
      const existing = await Event.findOne({ title: seedEvent.title });
      if (existing) {
        skipped.push(seedEvent.title);
        continue;
      }
      const created = await Event.create(seedEvent);
      results.push({ id: created._id, title: created.title });
    }

    return res.status(200).json({
      success: true,
      message: `Seeded ${results.length} event(s). Skipped ${skipped.length} duplicate(s).`,
      created: results,
      skipped: skipped
    });
  } catch (error) {
    console.error('Seed events error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to seed events: ' + error.message
    });
  }
}
