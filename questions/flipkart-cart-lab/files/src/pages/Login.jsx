import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNav } from '../context/NavContext.jsx';

export function Login() {
  const { login } = useAuth();
  const { navigate } = useNav();
  const [email, setEmail] = useState('asha@example.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('catalog');
    } catch {
      setError('Invalid email or password');
    }
  }

  return (
    <form className="card form" onSubmit={submit}>
      <h2>Login</h2>
      <label>
        Email
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label>
        Password
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      {error && <p className="error">{error}</p>}
      <button className="btn primary">Login</button>
      <p className="muted">Demo users: asha@example.com / ravi@example.com, password: password123</p>
    </form>
  );
}
