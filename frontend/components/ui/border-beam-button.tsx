'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface BorderBeamButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export function BorderBeamButton({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: BorderBeamButtonProps) {
  const beamRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!beamRef.current) return;

    // Create a continuous border beam animation
    const tl = gsap.timeline({ repeat: -1 });

    tl.to(
      beamRef.current,
      {
        backgroundPosition: '200% center',
        duration: 3,
        ease: 'none',
      },
      0
    );
  }, []);

  const variantClasses = {
    primary:
      'bg-gradient-to-r from-[#FF5500] to-[#E64D00] hover:from-[#E64D00] hover:to-[#D44000] text-white shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40',
    secondary:
      'bg-orange-50 hover:bg-orange-100 text-[#FF5500] border-2 border-orange-200',
    outline: 'border-2 border-[#FF5500] text-[#FF5500] hover:bg-orange-50',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      ref={buttonRef}
      className={`relative overflow-hidden rounded-lg font-semibold transition-all duration-300 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      <div
        ref={beamRef}
        className="absolute inset-0 opacity-0 hover:opacity-10 bg-gradient-to-r from-transparent via-white to-transparent"
        style={{
          backgroundSize: '200% 100%',
          backgroundPosition: '0% center',
        }}
      />
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
}
