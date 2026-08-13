import dbConnect from '../../lib/mongodb';
import Event from '../../models/Event';
import mongoose from 'mongoose';

export default async function handler(req, res) {
  try {
    // Connect to MongoDB (uses process.env.MONGODB_URI)
    await dbConnect();

    // Use the Event model to inspect the collection
    const eventCount = await Event.countDocuments();
    const dbName = mongoose.connection && mongoose.connection.name ? mongoose.connection.name : null;
    const collectionName = Event.collection && Event.collection.name ? Event.collection.name : 'events';

    return res.status(200).json({
      success: true,
      database: dbName,
      collection: collectionName,
      eventCount
    });
  } catch (err) {
    console.error('/api/test-db error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
