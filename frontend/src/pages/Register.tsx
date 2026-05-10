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
      eyebrow="Launch Access"
      title="Open a new route into your task universe."
      subtitle="Create your operator account, secure your credentials, and unlock a luxury orbital workspace."
    >
      <div className="auth-content">
        <div className="auth-header-block">
          <p className="section-label">Initiate launch</p>
          <h2>Create your account</h2>
          <p className="section-copy">
            Your credentials are sealed securely and your session token powers protected navigation.
          </p>
        </div>

        <div className="auth-support-grid">
          <article className="auth-support-card">
            <strong>Secure credential storage</strong>
            <p>Your password is hashed before it ever reaches the dashboard flow.</p>
          </article>
          <article className="auth-support-card">
            <strong>Fast guided onboarding</strong>
            <p>Register once, then move straight into the login path with no confusion.</p>
          </article>
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
            {loading ? <Spinner label="Preparing launch" /> : <span>Activate account</span>}
            {!loading ? <ArrowRight size={18} /> : null}
          </button>
        </form>

        <p className="auth-switch">
          Already registered? <Link to="/login">Sign in</Link>
        </p>

        <p className="auth-footnote">The visuals evolve, while the competency-task behavior stays intact.</p>
      </div>
    </AuthShell>
  );
}
