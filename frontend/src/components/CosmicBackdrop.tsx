import type { CSSProperties } from 'react';

interface CosmicBackdropProps {
  variant?: 'auth' | 'dashboard';
}

const stars = [
  { x: 5, y: 16, size: 2.3, delay: 0.4, duration: 5.8 },
  { x: 11, y: 74, size: 1.4, delay: 1.4, duration: 6.8 },
  { x: 17, y: 36, size: 1.8, delay: 2.1, duration: 6.2 },
  { x: 23, y: 11, size: 2.5, delay: 0.8, duration: 7.2 },
  { x: 29, y: 82, size: 1.3, delay: 1.8, duration: 5.2 },
  { x: 34, y: 57, size: 1.6, delay: 0.2, duration: 6.5 },
  { x: 41, y: 20, size: 2.2, delay: 1.1, duration: 7.1 },
  { x: 47, y: 70, size: 1.4, delay: 2.4, duration: 6.9 },
  { x: 52, y: 41, size: 2.4, delay: 0.7, duration: 5.9 },
  { x: 58, y: 7, size: 1.4, delay: 1.6, duration: 7.1 },
  { x: 64, y: 63, size: 2.1, delay: 0.5, duration: 5.4 },
  { x: 71, y: 29, size: 1.3, delay: 1.3, duration: 6.7 },
  { x: 78, y: 86, size: 2, delay: 2.2, duration: 5.8 },
  { x: 84, y: 49, size: 2.6, delay: 0.9, duration: 7.4 },
  { x: 90, y: 15, size: 1.7, delay: 1.7, duration: 6.1 },
  { x: 95, y: 61, size: 2.1, delay: 0.3, duration: 6.4 },
];

const particles = [
  { x: 8, y: 24, width: 140, delay: 0.2, duration: 11 },
  { x: 24, y: 68, width: 180, delay: 1.4, duration: 14 },
  { x: 42, y: 12, width: 150, delay: 2.2, duration: 13 },
  { x: 57, y: 60, width: 200, delay: 0.6, duration: 15 },
  { x: 74, y: 30, width: 120, delay: 1.9, duration: 12 },
  { x: 88, y: 76, width: 160, delay: 0.8, duration: 16 },
];

const meteors = [
  { x: 12, y: 8, width: 180, delay: 0.4, duration: 18, angle: -18 },
  { x: 66, y: 14, width: 210, delay: 3.2, duration: 22, angle: -24 },
];

function toVarStyle(values: Record<string, string | number>): CSSProperties {
  return values as CSSProperties;
}

export default function CosmicBackdrop({ variant = 'dashboard' }: CosmicBackdropProps) {
  return (
    <div className={`cosmic-backdrop cosmic-backdrop-${variant}`} aria-hidden="true">
      <div className="space-noise" />
      <div className="nebula-cloud nebula-cloud-a" />
      <div className="nebula-cloud nebula-cloud-b" />
      <div className="nebula-cloud nebula-cloud-c" />
      <div className="aurora-band aurora-band-a" />
      <div className="aurora-band aurora-band-b" />
      <div className="planet-glow" />
      <div className="planet-body" />
      <div className="galaxy-grid" />

      <div className="orbit-cluster">
        <span className="orbit-line orbit-line-one" />
        <span className="orbit-line orbit-line-two" />
        <span className="orbit-line orbit-line-three" />
      </div>

      <div className="satellite-frame">
        <span className="satellite-body" />
        <span className="satellite-wing satellite-wing-left" />
        <span className="satellite-wing satellite-wing-right" />
        <span className="satellite-signal satellite-signal-one" />
        <span className="satellite-signal satellite-signal-two" />
      </div>

      <div className="star-layer">
        {stars.map((star) => (
          <span
            key={`${star.x}-${star.y}`}
            className="star"
            style={toVarStyle({
              '--x': `${star.x}%`,
              '--y': `${star.y}%`,
              '--size': `${star.size}px`,
              '--delay': `${star.delay}s`,
              '--duration': `${star.duration}s`,
            })}
          />
        ))}
      </div>

      <div className="particle-layer">
        {particles.map((particle) => (
          <span
            key={`${particle.x}-${particle.y}`}
            className="beam-trace"
            style={toVarStyle({
              '--x': `${particle.x}%`,
              '--y': `${particle.y}%`,
              '--width': `${particle.width}px`,
              '--delay': `${particle.delay}s`,
              '--duration': `${particle.duration}s`,
            })}
          />
        ))}
      </div>

      <div className="meteor-layer">
        {meteors.map((meteor) => (
          <span
            key={`${meteor.x}-${meteor.y}`}
            className="meteor-streak"
            style={toVarStyle({
              '--x': `${meteor.x}%`,
              '--y': `${meteor.y}%`,
              '--width': `${meteor.width}px`,
              '--delay': `${meteor.delay}s`,
              '--duration': `${meteor.duration}s`,
              '--angle': `${meteor.angle}deg`,
            })}
          />
        ))}
      </div>

      <div className="cosmic-vignette" />
    </div>
  );
}
