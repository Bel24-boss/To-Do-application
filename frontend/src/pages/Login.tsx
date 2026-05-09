import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, LockKeyhole, Mail } from 'lucide-react';

import api, { getApiErrorMessage } from '../api';
import AuthShell from '../components/AuthShell';
import Notice from '../components/Notice';
import Spinner from '../components/Spinner';
import type { AuthResponse, LoginLocationState } from '../types';
import useAuth from '../useAuth';

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = (location.state as LoginLocationState | null) ?? null;

  const [email, setEmail] = useState(locationState?.email ?? '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post<AuthResponse>('/login', { email, password });
      login(response.data.access_token);
      navigate('/', { replace: true });
    } catch (error: unknown) {
      setError(getApiErrorMessage(error, 'Invalid credentials. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Secure Sign In"
      title="Your planning system, without the clutter."
      subtitle="Log in to manage tasks, verify your token-backed session, and keep momentum from any device."
    >
      <div className="auth-content">
        <div>
          <p className="section-label">Welcome back</p>
          <h2>Sign in to Momentum</h2>
          <p className="section-copy">
            Use your registered email and password to reach the protected dashboard.
          </p>
        </div>

        {locationState?.registered ? (
          <Notice tone="success">
            Account created successfully. You can sign in right away.
          </Notice>
        ) : null}

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
                autoComplete="current-password"
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

          <button className="button button-primary" disabled={loading} type="submit">
            {loading ? <Spinner label="Signing you in" /> : <span>Enter dashboard</span>}
            {!loading ? <ArrowRight size={18} /> : null}
          </button>
        </form>

        <p className="auth-switch">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </AuthShell>
  );
}
