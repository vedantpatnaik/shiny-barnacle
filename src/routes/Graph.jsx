import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import TextArea from '../components/TextArea';
import Card from '../components/Card';
import WordGraph from '../graph/WordGraph';
import { fetchWordnet } from '../api/api';
import { useApi } from '../hooks/useApi';

const Graph = () => {
  const [word, setWord] = useState('');
  const { data, loading, error, request } = useApi(fetchWordnet);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!word.trim()) return;
    await request(word.trim());
  };

  const handleNodeClick = (node) => {
    if (!node?.id) return;
    navigate('/learn', { state: { word: node.id } });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3">
        <p className="text-sm uppercase tracking-[0.3em] text-white/50">Mode 3 · Graph</p>
        <h1 className="text-3xl md:text-4xl font-semibold leading-tight">
          Semantic bubble network — explore associations visually.
        </h1>
        <p className="text-white/70">
          Enter a word to generate an interactive wordnet. Click any node to jump into Learn Mode prefilled with that
          term.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 flex flex-col md:flex-row gap-4 items-end">
        <div className="w-full md:flex-1">
          <TextArea label="Seed word" value={word} onChange={setWord} placeholder="e.g., plant" rows={3} />
        </div>
        <button type="submit" className="btn-primary w-full md:w-auto" disabled={loading}>
          {loading ? 'Building…' : 'Generate Graph'}
        </button>
      </form>

      <Card title="Wordnet" subtle>
        {error && <p className="text-red-300">{error}</p>}
        {!data && !loading && <p className="text-white/50">Graph will render after you submit a word.</p>}
        {loading && <p className="text-white/70">Calculating associations…</p>}
        {data && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <WordGraph data={data} onNodeClick={handleNodeClick} />
            <p className="text-white/60 text-sm">
              Node size and tint scale with association weight. Click a node to jump into Learn Mode with that target
              prefilled.
            </p>
          </motion.div>
        )}
      </Card>
    </div>
  );
};

export default Graph;

