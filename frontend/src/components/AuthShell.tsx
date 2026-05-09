import type { ReactNode } from 'react';

interface AuthShellProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
}

const highlights = [
  'JWT-backed session verification',
  'Protected routes with resilient error handling',
  'Focused workflow for shipping real work',
];

export default function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
}: AuthShellProps) {
  return (
    <div className="app-shell auth-shell">
      <div className="backdrop-orb backdrop-orb-left" />
      <div className="backdrop-orb backdrop-orb-right" />
      <div className="auth-layout">
        <section className="hero-panel">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="hero-copy">{subtitle}</p>
          <div className="hero-grid">
            <article className="hero-card">
              <span className="hero-metric">24/7</span>
              <p>Access your task board across any authenticated session.</p>
            </article>
            <article className="hero-card">
              <span className="hero-metric">100%</span>
              <p>Protected API requests include the bearer token automatically.</p>
            </article>
          </div>
          <ul className="feature-list">
            {highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="panel auth-card">{children}</section>
      </div>
    </div>
  );
}
