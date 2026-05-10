import type { ReactNode } from 'react';

import CosmicBackdrop from './CosmicBackdrop';

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

const telemetry = [
  { value: '256 bit', label: 'Encrypted credential channel' },
  { value: 'Instant', label: 'Protected-route verification' },
  { value: 'Zero drag', label: 'Clean and readable operator flow' },
];

export default function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
}: AuthShellProps) {
  return (
    <div className="app-shell auth-shell">
      <CosmicBackdrop variant="auth" />
      <div className="auth-layout">
        <section className="panel hero-panel hero-panel-cosmic">
          <div className="hero-topline">
            <p className="eyebrow">{eyebrow}</p>
            <span className="signal-chip">Orbital uplink stable</span>
          </div>

          <div className="hero-main-grid">
            <div className="hero-copy-block">
              <h1>{title}</h1>
              <p className="hero-copy">{subtitle}</p>
            </div>

            <div className="planet-console">
              <div className="planet-console-core" />
              <span className="planet-console-ring planet-console-ring-one" />
              <span className="planet-console-ring planet-console-ring-two" />
              <span className="planet-console-ring planet-console-ring-three" />
              <span className="planet-console-node planet-console-node-alpha" />
              <span className="planet-console-node planet-console-node-beta" />
              <span className="planet-console-node planet-console-node-gamma" />
            </div>
          </div>

          <div className="hero-grid">
            <article className="hero-card">
              <span className="hero-card-label">Deep-space access</span>
              <span className="hero-metric">24/7</span>
              <p>Command your task system from any authenticated orbit.</p>
            </article>
            <article className="hero-card">
              <span className="hero-card-label">Protected signal</span>
              <span className="hero-metric">100%</span>
              <p>Bearer-token headers ride with every secure transmission.</p>
            </article>
          </div>

          <div className="hero-bottom-grid">
            <div className="feature-panel">
              <p className="feature-panel-title">Mission architecture</p>
              <ul className="feature-list">
                {highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="telemetry-panel">
              <p className="feature-panel-title">Signal telemetry</p>
              <div className="telemetry-list">
                {telemetry.map((item) => (
                  <article className="telemetry-row" key={item.label}>
                    <strong>{item.value}</strong>
                    <span>{item.label}</span>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="panel auth-card">{children}</section>
      </div>
    </div>
  );
}
