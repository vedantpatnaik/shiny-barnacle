import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import TextArea from '../components/TextArea';
import Card from '../components/Card';
import { learnWord } from '../api/api';
import { useApi } from '../hooks/useApi';

const Learn = () => {
  const location = useLocation();
  const [word, setWord] = useState('');
  const { data, loading, error, request } = useApi(learnWord);

  const submit = async (value) => {
    const next = value ?? word;
    if (!next.trim()) return;
    setWord(next);
    await request(next.trim());
  };

  useEffect(() => {
    if (location.state?.word) {
      submit(location.state.word);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submit();
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3">
        <p className="text-sm uppercase tracking-[0.3em] text-white/50">Mode 2 · Learn</p>
        <h1 className="text-3xl md:text-4xl font-semibold leading-tight">
          Word intelligence: definition, gloss, morphology, variants.
        </h1>
        <p className="text-white/70">
          Enter a term to surface definition, literal gloss, example sentence, POS, and stem variants. Click a variant to
          rerun instantly.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 flex flex-col md:flex-row gap-4 items-end">
        <div className="w-full md:flex-1">
          <TextArea
            label="Word or phrase"
            value={word}
            onChange={setWord}
            placeholder="e.g., onkwawénna, language"
            rows={3}
          />
        </div>
        <button type="submit" className="btn-primary w-full md:w-auto" disabled={loading}>
          {loading ? 'Retrieving…' : 'Learn'}
        </button>
      </form>

      <div className="grid md:grid-cols-2 gap-6">
        <Card title="Entry" subtle>
          {!data && !loading && <p className="text-white/50">Awaiting your query.</p>}
          {loading && <p className="text-white/70">Consulting Gemini…</p>}
          {error && <p className="text-red-300">{error}</p>}
          {data && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              <div>
                <p className="text-xs uppercase tracking-widest text-white/50">Definition</p>
                <p className="text-lg font-semibold mt-1">{data.definition}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-white/50">Literal Gloss</p>
                <p className="text-white/80">{data.gloss}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-white/50">Example</p>
                <p className="text-white/80">{data.example}</p>
              </div>
            </motion.div>
          )}
        </Card>

        <Card title="Morphology & Relations" subtle>
          {data ? (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              <div>
                <p className="text-xs uppercase tracking-widest text-white/50">POS</p>
                <p className="text-white/80">{data.pos}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-white/50">Morphology</p>
                <p className="text-white/80">{data.morph}</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-widest text-white/50">Related Forms</p>
                <div className="flex flex-wrap gap-2">
                  {data.variants?.map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => submit(v)}
                      className="px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-sm hover:bg-white/20 transition"
                    >
                      {v}
                    </button>
                  ))}
                  {(!data.variants || data.variants.length === 0) && <p className="text-white/50">None listed.</p>}
                </div>
              </div>
            </motion.div>
          ) : (
            <p className="text-white/50">Morphology and related forms will appear after a lookup.</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Learn;

