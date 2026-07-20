'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  borderBeam?: boolean;
}

export function AnimatedCard({
  children,
  className = '',
  delay = 0,
  borderBeam = true,
}: AnimatedCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const beamRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;

    // Entrance animation with GSAP
    gsap.fromTo(
      cardRef.current,
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: delay,
        ease: 'power2.out',
      }
    );

    // Border beam animation
    if (borderBeam && beamRef.current) {
      const tl = gsap.timeline({ repeat: -1 });
      tl.to(
        beamRef.current,
        {
          backgroundPosition: '200% center',
          duration: 4,
          ease: 'none',
        },
        0
      );
    }
  }, [delay, borderBeam]);

  return (
    <div ref={cardRef} className={`relative overflow-hidden ${className}`}>
      {borderBeam && (
        <div
          ref={beamRef}
          className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/50 to-green-500/0 pointer-events-none"
          style={{
            backgroundSize: '200% 100%',
            backgroundPosition: '0% center',
            opacity: 0,
            animation: 'border-beam 3s infinite',
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
