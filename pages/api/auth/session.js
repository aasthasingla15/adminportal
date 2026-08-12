export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(455).json({ message: 'Method Not Allowed' });
  }

  const session = req.cookies.admin_session;

  if (session === 'authenticated-session-token-xyz') {
    return res.status(200).json({ authenticated: true });
  }

  return res.status(200).json({ authenticated: false });
}
