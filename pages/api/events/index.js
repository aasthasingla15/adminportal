import dbConnect from '../../../lib/mongodb';
import Event from '../../../models/Event';

// Configure body parser limit for image uploads (base64)
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb'
    }
  }
};

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        await dbConnect();
        // Return only the fields needed for the Events listing to avoid sending large base64 images
        const events = await Event.find({}, {
          title: 1,
          description: 1,
          date: 1,
          time: 1,
          venue: 1,
          category: 1,
          bannerImage: 1,
          registrationLink: 1,
          status: 1,
          featured: 1
        }).sort({ date: 1 }).lean();

        return res.status(200).json({ success: true, data: events });
      } catch (error) {
        console.error('GET /api/events — DB error:', error.message);
        return res.status(500).json({
          success: false,
          message: 'Unable to load events. Please try again.'
        });
      }

    case 'POST':
      // Authenticate admin session
      const session = req.cookies.admin_session;
      if (session !== 'authenticated-session-token-xyz') {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      try {
        await dbConnect();

        const { title, description, date, time, venue, category, bannerImage, registrationLink, status, featured } = req.body;

        // Server-side validation
        if (!title || !title.trim()) {
          return res.status(400).json({ success: false, message: 'Event Title is required.' });
        }
        if (!description || !description.trim()) {
          return res.status(400).json({ success: false, message: 'Event Description is required.' });
        }
        if (!date || !date.trim()) {
          return res.status(400).json({ success: false, message: 'Event Date is required.' });
        }
        if (!time || !time.trim()) {
          return res.status(400).json({ success: false, message: 'Event Time is required.' });
        }
        if (!venue || !venue.trim()) {
          return res.status(400).json({ success: false, message: 'Event Venue is required.' });
        }
        if (!category) {
          return res.status(400).json({ success: false, message: 'Event Category is required.' });
        }
        if (!bannerImage) {
          return res.status(400).json({ success: false, message: 'Banner image is required.' });
        }
        if (!registrationLink || !registrationLink.trim()) {
          return res.status(400).json({ success: false, message: 'Registration Link is required.' });
        }

        // If featured, unset all others first
        if (featured === true) {
          await Event.updateMany({}, { featured: false });
        }

        const event = await Event.create(req.body);
        return res.status(201).json({ success: true, data: event });
      } catch (error) {
        console.error('POST /api/events — DB error:', error.message);
        if (error.name === 'ValidationError') {
          const messages = Object.values(error.errors).map(e => e.message).join(', ');
          return res.status(400).json({ success: false, message: messages });
        }
        return res.status(500).json({
          success: false,
          message: 'Unable to create event. Please try again.'
        });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
