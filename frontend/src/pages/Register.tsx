import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ArrowRight, LockKeyhole, Mail, UserRoundPlus } from 'lucide-react';

import api, { getApiErrorMessage } from '../api';
import AuthShell from '../components/AuthShell';
import Notice from '../components/Notice';
import Spinner from '../components/Spinner';
import useAuth from '../useAuth';

export default function Register() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      await api.post('/register', { email, password });
      navigate('/login', { replace: true, state: { email, registered: true } });
    } catch (error: unknown) {
      setError(getApiErrorMessage(error, 'Registration failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Create Account"
      title="Build a calmer, sharper way to manage work."
      subtitle="Register once, store credentials securely, and unlock a protected workspace built for disciplined execution."
    >
      <div className="auth-content">
        <div>
          <p className="section-label">Get started</p>
          <h2>Create your account</h2>
          <p className="section-copy">
            Your credentials are hashed securely and your session token unlocks protected routes.
          </p>
        </div>

        {error ? <Notice tone="error">{error}</Notice> : null}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Email address</span>
            <div className="field-control">
              <Mail size={18} />
              <input
                autoComplete="email"
                className="text-input"
                disabled={loading}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                type="email"
                value={email}
              />
            </div>
          </label>

          <label className="field">
            <span>Password</span>
            <div className="field-control">
              <LockKeyhole size={18} />
              <input
                autoComplete="new-password"
                className="text-input"
                disabled={loading}
                minLength={8}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 8 characters"
                required
                type="password"
                value={password}
              />
            </div>
          </label>

          <label className="field">
            <span>Confirm password</span>
            <div className="field-control">
              <UserRoundPlus size={18} />
              <input
                autoComplete="new-password"
                className="text-input"
                disabled={loading}
                minLength={8}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Repeat your password"
                required
                type="password"
                value={confirmPassword}
              />
            </div>
          </label>

          <button className="button button-primary" disabled={loading} type="submit">
            {loading ? <Spinner label="Creating account" /> : <span>Register securely</span>}
            {!loading ? <ArrowRight size={18} /> : null}
          </button>
        </form>

        <p className="auth-switch">
          Already registered? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </AuthShell>
  );
}
