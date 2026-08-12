const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'adminpassword123';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(455).json({ message: 'Method Not Allowed' });
  }

  const { username, password } = req.body;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    // Set cookie: admin_session=authenticated-session-token-xyz; Path=/; HttpOnly; Max-Age=86400; SameSite=Lax
    res.setHeader(
      'Set-Cookie',
      'admin_session=authenticated-session-token-xyz; Path=/; HttpOnly; Max-Age=86400; SameSite=Lax'
    );
    return res.status(200).json({ success: true, message: 'Logged in successfully' });
  }

  return res.status(401).json({ success: false, message: 'Invalid username or password' });
}
