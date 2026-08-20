'use client';

import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { useRef } from 'react';

type SpotlightCardProps = {
  className?: string;
  children: React.ReactNode;
};

export function SpotlightCard({ className = '', children }: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const spotlight = useMotionTemplate`radial-gradient(circle at ${x}px ${y}px, rgba(148,163,184,0.42), rgba(255,255,255,0.06) 20%, rgba(255,255,255,0.82) 52%)`;

  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left);
    y.set(event.clientY - rect.top);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={{ backgroundImage: spotlight }}
      className={`group relative overflow-hidden rounded-[1.6rem] border border-[#d9d3cc] bg-white/75 backdrop-blur-xl ${className}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.8),transparent_52%)] opacity-90" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
