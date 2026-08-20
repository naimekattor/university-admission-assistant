'use client';

import React, { useState } from 'react';
import { Play, RotateCcw, Zap, Compass, Activity } from 'lucide-react';

interface Props {
  visualType: string;
  visualConfig?: any;
}

export function VisualLessonRenderer({ visualType, visualConfig }: Props) {
  const [velocity, setVelocity] = useState(visualConfig?.initialVelocity || 15);
  const [angle, setAngle] = useState(45);
  const [isPlaying, setIsPlaying] = useState(false);

  if (visualType === 'none') return null;

  const g = 9.8;
  const rad = (angle * Math.PI) / 180;
  const range = Math.round((Math.pow(velocity, 2) * Math.sin(2 * rad)) / g);
  const maxHeight = Math.round((Math.pow(velocity * Math.sin(rad), 2)) / (2 * g));

  return (
    <div className="my-6 bg-slate-900 border border-amber-500/30 rounded-xl p-5 text-slate-100 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
          <Zap className="w-4 h-4" />
          <span>Interactive Concept Visualizer: Physics Kinematics & Vector Trajectory</span>
        </div>
        <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-medium">
          2D Interactive Diagram
        </span>
      </div>

      {/* SVG Canvas for Vector / Trajectory Simulation */}
      <div className="relative w-full h-56 bg-slate-950 rounded-lg border border-slate-800 overflow-hidden flex items-end justify-start p-4">
        <svg className="w-full h-full overflow-visible">
          {/* Axis Grid */}
          <line x1="20" y1="180" x2="380" y2="180" stroke="#475569" strokeWidth="1.5" />
          <line x1="20" y1="20" x2="20" y2="180" stroke="#475569" strokeWidth="1.5" />

          {/* Parabolic Trajectory Curve */}
          <path
            d={`M 20 180 Q ${20 + range * 2} ${180 - maxHeight * 4} ${20 + Math.min(350, range * 4)} 180`}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="3"
            strokeDasharray={isPlaying ? 'none' : '4 4'}
          />

          {/* Projectile Ball */}
          <circle
            cx={20 + Math.min(340, range * 2)}
            cy={180 - Math.min(150, maxHeight * 2)}
            r="6"
            fill="#10b981"
            className="transition-all duration-300"
          />

          {/* Initial Velocity Vector Arrow */}
          <line
            x1="20"
            y1="180"
            x2={20 + velocity * Math.cos(rad) * 2}
            y2={180 - velocity * Math.sin(rad) * 2}
            stroke="#3b82f6"
            strokeWidth="2.5"
            markerEnd="url(#arrow)"
          />
        </svg>

        <div className="absolute top-3 right-3 text-right bg-slate-900/80 p-2 rounded border border-slate-800 text-xs space-y-1">
          <div className="text-slate-300">Max Height ($H$): <span className="font-mono text-emerald-400 font-bold">{maxHeight} m</span></div>
          <div className="text-slate-300">Total Range ($R$): <span className="font-mono text-amber-400 font-bold">{range} m</span></div>
        </div>
      </div>

      {/* Interactive Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/60 p-3 rounded-lg border border-slate-800 text-xs">
        <div>
          <label className="flex justify-between text-slate-300 mb-1">
            <span>Initial Velocity ($v_0$):</span>
            <span className="font-mono text-amber-400">{velocity} m/s</span>
          </label>
          <input
            type="range"
            min="5"
            max="30"
            value={velocity}
            onChange={(e) => setVelocity(Number(e.target.value))}
            className="w-full accent-amber-500"
          />
        </div>

        <div>
          <label className="flex justify-between text-slate-300 mb-1">
            <span>Launch Angle ($\\theta$):</span>
            <span className="font-mono text-amber-400">{angle}°</span>
          </label>
          <input
            type="range"
            min="15"
            max="75"
            value={angle}
            onChange={(e) => setAngle(Number(e.target.value))}
            className="w-full accent-amber-500"
          />
        </div>
      </div>
    </div>
  );
}
