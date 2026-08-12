export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(455).json({ message: 'Method Not Allowed' });
  }

  // Clear cookie by setting Max-Age to 0
  res.setHeader(
    'Set-Cookie',
    'admin_session=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax'
  );
  return res.status(200).json({ success: true, message: 'Logged out successfully' });
}
