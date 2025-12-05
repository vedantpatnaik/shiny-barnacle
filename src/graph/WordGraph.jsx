import { useEffect, useMemo, useRef, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

const valueToColor = (v = 0) => {
  const clamped = Math.max(0, Math.min(1, v));
  const hue = 180 + (1 - clamped) * 120; // mint to orchid
  return `hsl(${hue}, 80%, 60%)`;
};

const WordGraph = ({ data, onNodeClick }) => {
  const fgRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 400 });

  useEffect(() => {
    const updateDimensions = () => {
      const container = document.getElementById('graph-container');
      if (container) {
        setDimensions({
          width: container.clientWidth,
          height: Math.max(400, window.innerHeight * 0.6),
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

  const graphData = useMemo(() => data || { nodes: [], links: [] }, [data]);

  return (
    <div id="graph-container" className="w-full rounded-3xl overflow-hidden border border-white/10 glass shadow-soft">
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

