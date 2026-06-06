import { useState, useEffect, useRef } from 'react';
import Cursor        from './components/Cursor';
import { ToastProvider } from './components/Toast';
import HomePage      from './components/HomePage';
import RoadmapApp    from './components/RoadmapApp';
import { analyzeResume } from './utils/resumeParser';

export default function App() {
  const [analysis, setAnalysis] = useState(null);

  const handleAnalyze = text => {
    const r = analyzeResume(text);
    setAnalysis(r);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Cursor />
      <ToastProvider />
      {!analysis
        ? <HomePage   onAnalyze={handleAnalyze} />
        : <RoadmapApp analysis={analysis} onReset={() => setAnalysis(null)} />
      }
    </>
  );
}
