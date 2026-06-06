import { useState, useEffect } from 'react';
import Cursor         from './components/Cursor';
import VideoHome      from './components/VideoHome';
import RoadmapView    from './components/RoadmapView';
import { ToastProvider } from './components/Toast';
import { analyzeResume } from './utils/resumeParser';

export default function App() {
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    document.documentElement.style.background = '#080808';
  }, []);

  const handleAnalyze = text => {
    const result = analyzeResume(text);
    setAnalysis(result);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Cursor />
      <ToastProvider />
      {!analysis
        ? <VideoHome onAnalyze={handleAnalyze} />
        : <RoadmapView analysis={analysis} onReset={() => { setAnalysis(null); window.scrollTo({top:0,behavior:'smooth'}); }} />
      }
    </>
  );
}
