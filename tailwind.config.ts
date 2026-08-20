import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}', './content/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      boxShadow: {
        neon: '0 0 0 1px rgba(34,211,238,0.35), 0 0 40px rgba(34,211,238,0.20)',
        violet: '0 0 0 1px rgba(168,85,247,0.35), 0 0 40px rgba(168,85,247,0.20)',
      },
      colors: {
        obsidian: '#070b14',
        panel: '#0f172a',
        cyanGlow: '#67e8f9',
        violetGlow: '#a78bfa',
      },
      backgroundImage: {
        grid: 'radial-gradient(circle at 1px 1px, rgba(148,163,184,0.15) 1px, transparent 0)',
      },
    },
  },
  plugins: [],
};

export default config;
