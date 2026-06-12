import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

// Animated neural-network visualization for the hero.
// Indigo (brand) = input/output layers; emerald (AI accent) = hidden layers.
// Edges fade in/out, nodes pulse, and signal particles flow input → output.

const LAYERS = [4, 6, 5, 3];
const LAYER_SPACING = 110;
const NODE_SPACING = 44;
const PADDING_X = 26;
const PADDING_Y = 32;

function buildNetwork() {
  const maxNodes = Math.max(...LAYERS);
  const width = (LAYERS.length - 1) * LAYER_SPACING + PADDING_X * 2;
  const height = (maxNodes - 1) * NODE_SPACING + PADDING_Y * 2;
  const centerY = height / 2;

  const nodes = [];
  LAYERS.forEach((size, layerIdx) => {
    const startY = centerY - ((size - 1) * NODE_SPACING) / 2;
    for (let i = 0; i < size; i++) {
      nodes.push({
        id: `${layerIdx}-${i}`,
        x: PADDING_X + layerIdx * LAYER_SPACING,
        y: startY + i * NODE_SPACING,
        layer: layerIdx,
        color:
          layerIdx === 0 || layerIdx === LAYERS.length - 1
            ? 'indigo'
            : 'emerald',
      });
    }
  });

  const edges = [];
  for (let l = 0; l < LAYERS.length - 1; l++) {
    const from = nodes.filter((n) => n.layer === l);
    const to = nodes.filter((n) => n.layer === l + 1);
    from.forEach((f) => {
      to.forEach((t) => {
        edges.push({
          id: `${f.id}->${t.id}`,
          x1: f.x,
          y1: f.y,
          x2: t.x,
          y2: t.y,
        });
      });
    });
  }

  // Deterministic sample of edges to host travelling signal particles.
  const flowEdges = edges.filter((_, i) => i % 9 === 0).slice(0, 8);

  return { nodes, edges, flowEdges, width, height };
}

export default function NeuralNetwork() {
  const { nodes, edges, flowEdges, width, height } = useMemo(
    buildNetwork,
    []
  );

  return (
    <div className="relative w-full max-w-[440px]">
      {/* Brand-color glow behind the network (bright on dark canvas) */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full bg-gradient-to-br from-indigo-500/35 via-violet-500/25 to-emerald-500/20 blur-3xl" />
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="nnEdgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
          <radialGradient id="nnNodeIndigo">
            <stop offset="0%" stopColor="#C7D2FE" />
            <stop offset="55%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#4338CA" />
          </radialGradient>
          <radialGradient id="nnNodeEmerald">
            <stop offset="0%" stopColor="#A7F3D0" />
            <stop offset="55%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#047857" />
          </radialGradient>
          <filter id="nnGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Static mesh */}
        {edges.map((e) => (
          <line
            key={e.id}
            x1={e.x1}
            y1={e.y1}
            x2={e.x2}
            y2={e.y2}
            stroke="url(#nnEdgeGrad)"
            strokeWidth="0.45"
            opacity="0.2"
          />
        ))}

        {/* Travelling signal particles input → output */}
        {flowEdges.map((e, i) => (
          <motion.circle
            key={`flow-${e.id}`}
            r={2.2}
            fill="#10B981"
            filter="url(#nnGlow)"
            initial={{ cx: e.x1, cy: e.y1, opacity: 0 }}
            animate={{
              cx: [e.x1, e.x2],
              cy: [e.y1, e.y2],
              opacity: [0, 0.95, 0],
            }}
            transition={{
              duration: 1.6,
              delay: i * 0.32,
              repeat: Infinity,
              repeatDelay: 2.4,
              ease: 'linear',
            }}
          />
        ))}

        {/* Pulsing nodes */}
        {nodes.map((n, i) => (
          <motion.circle
            key={n.id}
            cx={n.x}
            cy={n.y}
            fill={
              n.color === 'indigo'
                ? 'url(#nnNodeIndigo)'
                : 'url(#nnNodeEmerald)'
            }
            filter="url(#nnGlow)"
            initial={{ r: 4, opacity: 0.7 }}
            animate={{
              r: [4, 5.4, 4],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 2.4 + (i % 4) * 0.35,
              delay: (i * 0.12) % 1.6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </svg>
    </div>
  );
}
