import React, { useEffect, useState } from 'react';
import { Camera, Sparkles, CheckCircle2, Loader2 } from 'lucide-react';

interface AnalyzingViewProps {
  previewUrl: string | null;
  category: string;
}

const ANALYSIS_STAGES = [
  'Observing image & extracting visual attributes...',
  'Identifying visible components & connections...',
  'Checking for visual anomalies & pattern mismatches...',
  'Reasoning about the problem with Gemma 4...',
  'Preparing actionable fix recommendations...'
];

export const AnalyzingView: React.FC<AnalyzingViewProps> = ({ previewUrl, category }) => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStageIndex((prev) => {
        if (prev < ANALYSIS_STAGES.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 1100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 text-center space-y-8 animate-fade-in">
      
      {/* Title Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-slate-200/80 border border-slate-300 text-slate-800 text-xs font-semibold rounded-full font-mono-code uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 animate-spin text-slate-700" /> Gemma 4 Multimodal Scan
        </div>
        
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
          Gemma is looking closely...
        </h2>
        
        <p className="text-sm text-slate-500 font-sans">
          Domain focus: <span className="text-slate-900 font-semibold uppercase">{category.replace('_', ' ')}</span>
        </p>
      </div>

      {/* Image Scanner Frame */}
      <div className="relative aspect-video w-full max-w-md mx-auto bg-slate-950 border border-slate-300 rounded-3xl overflow-hidden shadow-xl">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Analyzing target"
            className="w-full h-full object-contain filter brightness-95 contrast-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-900">
            <Camera className="w-12 h-12 text-slate-600" />
          </div>
        )}

        {/* Laser Scanner Line */}
        <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-indigo-400 to-transparent shadow-[0_0_15px_rgba(99,102,241,0.8)] animate-scan" />
        
        {/* Soft Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-slate-950/30 pointer-events-none" />
      </div>

      {/* Stages Progress List */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 text-left max-w-md mx-auto space-y-4 shadow-sm">
        {ANALYSIS_STAGES.map((stage, idx) => {
          const isDone = idx < currentStageIndex;
          const isCurrent = idx === currentStageIndex;
          return (
            <div
              key={stage}
              className={`flex items-center gap-3 text-xs sm:text-sm font-medium transition-colors duration-300 ${
                isDone
                  ? 'text-slate-400'
                  : isCurrent
                  ? 'text-slate-900 font-bold'
                  : 'text-slate-400/60'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : isCurrent ? (
                <Loader2 className="w-4 h-4 text-slate-900 animate-spin shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
              )}
              <span>{stage}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
