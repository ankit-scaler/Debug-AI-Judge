import { USERS } from './db.js';

/** Simplified vs. the real lab's salted-hash sessions -- this is a sandbox, not
 *  a security surface, and auth was never one of this question's three bugs. */
const tokenToUserId = new Map();

export function login(email, password) {
  const user = USERS.find((u) => u.email === email && u.password === password);
  if (!user) return null;
  const token = `token-${user.id}`;
  tokenToUserId.set(token, user.id);
  return { token, userId: user.id, user: { id: user.id, email: user.email, name: user.name } };
}

export function userIdForToken(token) {
  return tokenToUserId.get(token) ?? null;
}

export function userForToken(token) {
  const userId = userIdForToken(token);
  if (userId === null) return null;
  const user = USERS.find((u) => u.id === userId);
  return user ? { id: user.id, email: user.email, name: user.name } : null;
}

export function logout(token) {
  tokenToUserId.delete(token);
}
