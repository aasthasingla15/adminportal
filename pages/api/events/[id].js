import dbConnect from '../../../lib/mongodb';
import Event from '../../../models/Event';

// Configure body parser limit for image updates (base64)
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb'
    }
  }
};

export default async function handler(req, res) {
  const {
    query: { id },
    method
  } = req;

  // Route protection for write operations
  const session = req.cookies.admin_session;
  const isAuthorized = session === 'authenticated-session-token-xyz';

  switch (method) {
    case 'GET':
      try {
        // Aggressive caching for public API
        res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=7200, stale-while-revalidate=86400');
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('ETag', `"${id}"`);
        
        // Return 304 if resource hasn't changed
        if (req.headers['if-none-match'] === `"${id}"`) {
          return res.status(304).end();
        }

        await dbConnect();
        const includeBanner = !(req.query.includeBanner === '0' || req.query.includeBanner === 'false');
        let event;
        
        if (includeBanner) {
          event = await Event.findById(id);
        } else {
          event = await Event.findById(id).select('-bannerImage').lean();
        }
        
        if (!event) {
          return res.status(404).json({ success: false, message: 'Event not found.' });
        }
        
        return res.status(200).json({ success: true, data: event });
      } catch (error) {
        console.error(`GET /api/events/${id} — DB error:`, error.message);
        res.setHeader('Cache-Control', 'public, max-age=30');
        return res.status(500).json({
          success: false,
          message: 'Unable to load event. Please try again.'
        });
      }

    case 'PUT':
      if (!isAuthorized) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }
      try {
        await dbConnect();

        // If marking this event featured, unset all others first
        if (req.body.featured === true) {
          await Event.updateMany({ _id: { $ne: id } }, { featured: false });
        }

        const event = await Event.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true
        });

        if (!event) {
          return res.status(404).json({ success: false, message: 'Event not found.' });
        }

        return res.status(200).json({ success: true, data: event });
      } catch (error) {
        console.error(`PUT /api/events/${id} — DB error:`, error.message);
        if (error.name === 'ValidationError') {
          const messages = Object.values(error.errors).map(e => e.message).join(', ');
          return res.status(400).json({ success: false, message: messages });
        }
        return res.status(500).json({
          success: false,
          message: 'Unable to update event. Please try again.'
        });
      }

    case 'DELETE':
      if (!isAuthorized) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }
      try {
        await dbConnect();
        const deletedEvent = await Event.findByIdAndDelete(id);
        if (!deletedEvent) {
          return res.status(404).json({ success: false, message: 'Event not found.' });
        }
        return res.status(200).json({ success: true, data: {} });
      } catch (error) {
        console.error(`DELETE /api/events/${id} — DB error:`, error.message);
        return res.status(500).json({
          success: false,
          message: 'Unable to delete event. Please try again.'
        });
      }

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
