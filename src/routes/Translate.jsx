import { useState } from 'react';
import { motion } from 'framer-motion';
import TextArea from '../components/TextArea';
import Card from '../components/Card';
import { translateText } from '../api/api';
import { useApi } from '../hooks/useApi';

const Translate = () => {
  const [input, setInput] = useState('');
  const { data, loading, error, request } = useApi(translateText);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    await request(input.trim());
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3">
        <p className="text-sm uppercase tracking-[0.3em] text-white/50">Mode 1 · Translate</p>
        <h1 className="text-3xl md:text-4xl font-semibold leading-tight">
          Bilingual engine, teachable glosses, compact grammar cues.
        </h1>
        <p className="text-white/70">
          Enter English or Mohawk. Direction auto-detected. Outputs translation, literal gloss, and a concise grammatical
          hint.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
        <div className="card p-6 space-y-4">
          <TextArea
            label="Input"
            value={input}
            onChange={setInput}
            placeholder="Type or paste text..."
            rows={10}
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/60">Auto English ⇄ Mohawk</span>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Translating…' : 'Translate'}
            </button>
          </div>
        </div>

        <div className="card p-6 space-y-4 min-h-[260px]">
          <p className="text-sm text-white/60">Output</p>
          {!data && !loading && <p className="text-white/50">Results will appear here.</p>}
          {loading && <p className="text-white/70">Thinking with Gemini…</p>}
          {error && <p className="text-red-300">{error}</p>}
          {data && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <div className="space-y-3">
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/50">Translation</p>
                  <p className="text-xl font-semibold mt-1">{data.translation}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/50">Literal Gloss</p>
                  <p className="text-white/80">{data.gloss}</p>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <p className="text-xs uppercase tracking-widest text-white/50">Grammar Cue</p>
                  <p className="text-white/80 mt-1">{data.explanation}</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </form>
    </div>
  );
};

export default Translate;

