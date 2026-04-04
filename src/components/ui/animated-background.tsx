import React from "react";

const particles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  size: (i % 3) + 1,
  left: (i * 5.26) % 100,
  top: (i * 7.89) % 100,
  delay: (i * 0.3) % 8,
  duration: (i % 6) + 8,
}));

const orbs = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  size: (i % 2) * 100 + 150,
  left: (i * 16.67) % 100,
  top: (i * 20) % 100,
  delay: i * 2,
  duration: (i % 3) + 15,
}));

function useMounted() {
  return React.useSyncExternalStore(
    () => () => {}, // no-op subscribe
    () => true, // client snapshot
    () => false, // server snapshot
  );
}

export function AnimatedBackground() {
  const mounted = useMounted();

  if (!mounted) return null;

  return (
    <div className="animated-bg">
      {/* Animated Grid */}
      <div className="grid-pattern" />

      {/* Floating Particles */}
      <div className="floating-particles">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="particle"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Gradient Orbs */}
      <div className="gradient-orbs">
        {orbs.map(orb => (
          <div
            key={orb.id}
            className="orb"
            style={{
              width: `${orb.size}px`,
              height: `${orb.size}px`,
              left: `${orb.left}%`,
              top: `${orb.top}%`,
              animationDelay: `${orb.delay}s`,
              animationDuration: `${orb.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Animated Lines */}
      <div className="animated-lines">
        <div className="line line-1" />
        <div className="line line-2" />
        <div className="line line-3" />
      </div>
    </div>
  );
}
