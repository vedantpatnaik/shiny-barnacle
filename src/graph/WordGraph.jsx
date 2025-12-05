import { useEffect, useMemo, useRef, useState } from 'react';

const valueToColor = (v = 0) => {
  const clamped = Math.max(0, Math.min(1, v));
  // Interpolate between Sky Blue (200) and Purple (270)
  const hue = 200 + clamped * 70; 
  return `hsl(${hue}, 90%, 70%)`;
};

const buildFallback = (seed = 'seed') => {
  const nodes = [
    { id: seed, value: 1.0 },
    { id: `${seed}-1`, value: 0.8 },
    { id: `${seed}-2`, value: 0.7 },
    { id: `${seed}-3`, value: 0.6 },
  ];
  const links = nodes.slice(1).map((n) => ({ source: seed, target: n.id, weight: n.value }));
  return { nodes, links };
};

const SimpleGraph = ({ graphData, width, height, onNodeClick }) => {
  const nodes = graphData.nodes || [];
  const links = graphData.links || [];
  if (!nodes.length) return null;

  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.max(Math.min(width, height) / 2 - 60, 120);

  const positioned = nodes.map((n, idx) => {
    if (idx === 0) return { ...n, x: centerX, y: centerY };
    const angle = (idx - 1) * ((2 * Math.PI) / Math.max(nodes.length - 1, 1));
    return {
      ...n,
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  });

  const nodeMap = Object.fromEntries(positioned.map((n) => [n.id, n]));

  return (
    <svg width={width} height={height} className="block">
      <defs>
        <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.0)" />
        </radialGradient>
      </defs>
      <rect width={width} height={height} fill="rgba(12,18,32,0.9)" />
      {links.map((l, i) => {
        const s = nodeMap[l.source];
        const t = nodeMap[l.target];
        if (!s || !t) return null;
        return (
          <line
            key={`l-${i}`}
            x1={s.x}
            y1={s.y}
            x2={t.x}
            y2={t.y}
            stroke="rgba(255,255,255,0.25)"
            strokeWidth={Math.max(1, (l.weight || 0.5) * 3)}
          />
        );
      })}
      {positioned.map((n) => {
        const r = 12 + (n.value || 0.5) * 12;
        return (
          <g
            key={n.id}
            onClick={() => onNodeClick?.(n)}
            style={{ cursor: 'pointer', transition: 'transform 150ms ease' }}
          >
            <circle cx={n.x} cy={n.y} r={r} fill={valueToColor(n.value)} stroke="rgba(255,255,255,0.35)" />
            <circle cx={n.x} cy={n.y} r={r * 1.6} fill="url(#nodeGlow)" opacity={0.2} />
            <text
              x={n.x}
              y={n.y - r - 6}
              textAnchor="middle"
              fill="#e2e8f0"
              style={{ fontSize: 12, fontFamily: 'Inter, sans-serif' }}
            >
              {n.id}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

const WordGraph = ({ data, onNodeClick }) => {
  const fgRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });

  useEffect(() => {
    const updateDimensions = () => {
      const container = document.getElementById('graph-container');
      if (container) {
        const width = Math.max(container.clientWidth || 0, 640);
        const height = Math.max(420, window.innerHeight * 0.6);
        setDimensions({
          width,
          height,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (fgRef.current) {
      fgRef.current.d3VelocityDecay(0.3);
      fgRef.current.d3Force('charge')?.strength(-180);
      setTimeout(() => fgRef.current?.zoomToFit(400, 60), 300);
    }
  }, [data]);

  const graphData = useMemo(() => {
    if (data?.nodes?.length && data?.links?.length) return data;
    const seed = data?.nodes?.[0]?.id || 'demo';
    return buildFallback(seed);
  }, [data]);

  return (
    <div
      id="graph-container"
      className="w-full min-h-[420px] rounded-3xl overflow-hidden border border-white/10 glass shadow-soft"
    >
      <SimpleGraph graphData={graphData} width={dimensions.width} height={dimensions.height} onNodeClick={onNodeClick} />
    </div>
  );
};

export default WordGraph;

