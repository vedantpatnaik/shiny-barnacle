import { useEffect, useMemo, useRef, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

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
      <ForceGraph2D
        ref={fgRef}
        width={dimensions.width}
        height={dimensions.height}
        graphData={graphData}
        nodeLabel="id"
        onNodeClick={onNodeClick}
        backgroundColor="rgba(12,20,41,0.65)"
        linkColor={() => 'rgba(255,255,255,0.18)'}
        linkWidth={(link) => Math.max(1, (link.weight || 0.4) * 4)}
        nodeVal={(node) => 6 + (node.value || 0.4) * 12}
        nodeRelSize={6}
        cooldownTicks={80}
        enableNodeDrag={false}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const label = node.id;
          const fontSize = 12 / globalScale;
          const radius = 10 + (node.value || 0.5) * 12;
          ctx.beginPath();
          const gradient = ctx.createRadialGradient(node.x, node.y, radius * 0.2, node.x, node.y, radius);
          gradient.addColorStop(0, 'rgba(255,255,255,0.85)');
          gradient.addColorStop(1, valueToColor(node.value));
          ctx.fillStyle = gradient;
          ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
          ctx.fill();

          ctx.strokeStyle = 'rgba(255,255,255,0.35)';
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.font = `${fontSize}px Inter`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = '#f8fafc';
          ctx.fillText(label, node.x, node.y - radius - fontSize);
        }}
      />
    </div>
  );
};

export default WordGraph;

