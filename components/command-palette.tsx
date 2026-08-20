'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight, Command } from 'lucide-react';
import { useMemo, useState } from 'react';

export type PaletteItem = {
  label: string;
  type: 'Section' | 'Action' | 'Project';
  action: string;
  keywords: string;
};

type CommandPaletteProps = {
  isOpen: boolean;
  navItems: Array<{ label: string; href: string }>;
  quickActions: Array<{ label: string; action: string }>;
  projectItems: Array<{ label: string; type: string; action: string; keywords: string }>;
  onClose: () => void;
  onAction: (action: string) => void;
};

export function CommandPalette({ isOpen, navItems, quickActions, projectItems, onClose, onAction }: CommandPaletteProps) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const lower = query.toLowerCase();
    const list: PaletteItem[] = [
      ...navItems.map((item) => ({ label: item.label, type: 'Section' as const, action: `goto:${item.href}`, keywords: item.label.toLowerCase() })),
      ...quickActions.map((item) => ({ label: item.label, type: 'Action' as const, action: item.action, keywords: item.label.toLowerCase() })),
      ...projectItems.map((project) => ({ label: project.label, type: project.type as 'Project', action: project.action, keywords: project.keywords })),
    ];

    if (!lower.trim()) return list.slice(0, 8);
    return list.filter((item) => item.keywords.includes(lower)).slice(0, 8);
  }, [navItems, projectItems, query, quickActions]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center bg-[#f5f2ec]/65 p-6 pt-20 backdrop-blur-xl"
        >
          <motion.div
            initial={{ opacity: 0, y: -24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            className="w-full max-w-2xl rounded-[1.9rem] border border-[#d9d1c7] bg-white/65 p-3 shadow-[0_30px_80px_rgba(17,17,17,0.12)] backdrop-blur-2xl"
          >
            <div className="flex items-center gap-3 rounded-[1.2rem] border border-[#d8d1c8] bg-white/70 px-4 py-3 shadow-inner shadow-white/70">
              <Command size={16} className="text-[#111111]" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') onClose();
                }}
                placeholder="Search sections, projects, or actions..."
                className="w-full bg-transparent text-base text-[#111111] outline-none placeholder:text-[#6b625b]"
              />
            </div>

            <div className="mt-3 space-y-2">
              {filtered.length > 0 ? (
                filtered.map((item) => (
                  <button
                    key={`${item.type}-${item.label}`}
                    onClick={() => {
                      onAction(item.action);
                      setQuery('');
                    }}
                    className="flex w-full items-center justify-between rounded-[1.1rem] border border-[#e4dfd8] bg-white/55 px-4 py-3 text-left transition hover:border-[#111111]/20 hover:bg-white/80"
                  >
                    <div>
                      <div className="text-sm font-medium text-[#111111]">{item.label}</div>
                      <div className="text-[10px] uppercase tracking-[0.2em] text-[#6b625b]">{item.type}</div>
                    </div>
                    <ChevronRight size={16} className="text-[#111111]/70" />
                  </button>
                ))
              ) : (
                <div className="rounded-[1.1rem] border border-[#e4dfd8] bg-white/55 px-4 py-6 text-center text-sm text-[#6b625b]">
                  No matches found for “{query}”
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
