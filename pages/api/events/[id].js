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
        await dbConnect();
        const event = await Event.findById(id);
        if (!event) {
          return res.status(200).json({ success: false, offlineFallback: true, message: 'Event not found in DB' });
        }
        res.status(200).json({ success: true, data: event });
      } catch (error) {
        console.error('Database connection failed in GET [id], triggering offlineFallback:', error);
        res.status(200).json({ success: false, offlineFallback: true, message: error.message });
      }
      break;

    case 'PUT':
      if (!isAuthorized) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }
      try {
        await dbConnect();
        if (req.body.featured === true) {
          await Event.updateMany({ _id: { $ne: id } }, { featured: false });
        }
        const event = await Event.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true
        });
        if (!event) {
          return res.status(200).json({ success: false, offlineFallback: true, message: 'Event not found in DB' });
        }
        res.status(200).json({ success: true, data: event });
      } catch (error) {
        console.error('Database connection failed in PUT [id], triggering offlineFallback:', error);
        res.status(200).json({ success: false, offlineFallback: true, message: error.message });
      }
      break;

    case 'DELETE':
      if (!isAuthorized) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }
      try {
        await dbConnect();
        const deletedEvent = await Event.deleteOne({ _id: id });
        if (!deletedEvent.deletedCount) {
          return res.status(200).json({ success: false, offlineFallback: true, message: 'Event not found in DB' });
        }
        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        console.error('Database connection failed in DELETE [id], triggering offlineFallback:', error);
        res.status(200).json({ success: false, offlineFallback: true, message: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(455).end(`Method ${method} Not Allowed`);
      break;
  }
}
