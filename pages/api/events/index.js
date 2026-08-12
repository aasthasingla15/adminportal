import fs from 'fs';
import path from 'path';
import dbConnect from '../../../lib/mongodb';
import Event from '../../../models/Event';

// Auto-migrate the video asset from root to public/videos/hero.mp4
try {
  const rootVideoPath = path.join(process.cwd(), 'WhatsApp Video 2026-08-11 at 18.00.44.mp4');
  const targetDir = path.join(process.cwd(), 'public', 'videos');
  const targetVideoPath = path.join(targetDir, 'hero.mp4');
  
  if (fs.existsSync(rootVideoPath)) {
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    fs.copyFileSync(rootVideoPath, targetVideoPath);
    console.log('Video asset successfully deployed to public/videos/hero.mp4');
  }
} catch (err) {
  console.error('Failed to deploy video asset:', err);
}

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

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const events = await Event.find({}).sort({ date: 1 });
        res.status(200).json({ success: true, data: events });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    case 'POST':
      // Authenticate admin session
      const session = req.cookies.admin_session;
      if (session !== 'authenticated-session-token-xyz') {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      try {
        const event = await Event.create(req.body);
        res.status(201).json({ success: true, data: event });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(455).end(`Method ${method} Not Allowed`);
      break;
  }
}
