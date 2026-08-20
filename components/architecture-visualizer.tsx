'use client';

import { motion } from 'framer-motion';
import { Briefcase, ChevronRight } from 'lucide-react';

export type ArchitectureNode = {
  id: string;
  name: string;
  label: string;
  details: string;
  tradeoff: string;
};

type ArchitectureVisualizerProps = {
  nodes: ArchitectureNode[];
  activeNodeId: string;
  onSelectNode: (id: string) => void;
};

export function ArchitectureVisualizer({ nodes, activeNodeId, onSelectNode }: ArchitectureVisualizerProps) {
  const activeNode = nodes.find((node) => node.id === activeNodeId) ?? nodes[0];

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="glass rounded-[1.8rem] p-5">
        <div className="flex flex-wrap gap-3">
          {nodes.map((node) => (
            <button
              key={node.id}
              onClick={() => onSelectNode(node.id)}
              className={`rounded-full border px-4 py-2 text-sm transition ${activeNodeId === node.id ? 'border-cyan-400/60 bg-cyan-500/10 text-cyan-300' : 'border-slate-700 bg-slate-900/80 text-slate-300 hover:border-violet-400/60 hover:text-violet-300'}`}
            >
              {node.name}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {nodes.map((node, index) => (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.08 }}
              className={`rounded-2xl border p-4 transition ${activeNodeId === node.id ? 'border-cyan-400/60 bg-cyan-500/10 shadow-neon' : 'border-slate-800 bg-slate-950/70'}`}
            >
              <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-slate-400">
                <span>{index + 1}</span>
                <ChevronRight size={14} className="text-slate-500" />
              </div>
              <p className="text-lg font-semibold text-white">{node.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/80 p-5">
          <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-cyan-300">
            <Briefcase size={14} /> Selected layer
          </div>
          <h3 className="text-2xl font-bold text-white">{activeNode.name}</h3>
          <p className="mt-3 text-slate-300">{activeNode.details}</p>
          <div className="mt-5 rounded-xl border border-violet-500/30 bg-violet-500/10 p-4 text-sm text-violet-100">
            <span className="font-semibold">Trade-off:</span> {activeNode.tradeoff}
          </div>
        </div>
      </div>

      <div className="glass rounded-[1.8rem] p-5">
        <p className="mb-4 text-xs uppercase tracking-[0.3em] text-slate-400">Live demo stack</p>
        <div className="space-y-4">
          {['Frontend', 'API / Server Actions', 'Secure Cloud', 'CI/CD'].map((item, index) => (
            <div key={item} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-white">{item}</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-300">{index < 3 ? 'Ready' : 'Automated'}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500" style={{ width: `${75 + index * 7}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-4">
          <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">Design principle</p>
          <p className="mt-2 text-sm text-slate-200">Prefer secure defaults, measurable reliability, and product-first engineering over overbuilt complexity.</p>
        </div>
      </div>
    </div>
  );
}
