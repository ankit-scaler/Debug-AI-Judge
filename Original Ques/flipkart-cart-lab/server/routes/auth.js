import { Router } from 'express';
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { requireAuth } from '../middleware.js';

export function authRoutes(db) {
  const r = Router();

  r.post('/login', (req, res) => {
    const { email, password } = req.body || {};
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email || '');
    if (!user) return res.status(401).json({ error: 'INVALID_CREDENTIALS' });
    const given = scryptSync(String(password || ''), user.password_salt, 32);
    const ok = timingSafeEqual(given, Buffer.from(user.password_hash, 'hex'));
    if (!ok) return res.status(401).json({ error: 'INVALID_CREDENTIALS' });
    const token = randomBytes(24).toString('hex');
    db.prepare('INSERT INTO sessions (token, user_id) VALUES (?, ?)').run(token, user.id);
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  });

  r.get('/me', requireAuth(db), (req, res) => res.json({ user: req.user }));

  r.post('/logout', requireAuth(db), (req, res) => {
    const token = (req.get('authorization') || '').replace(/^Bearer\s+/i, '');
    db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
    res.json({ ok: true });
  });

  return r;
}
