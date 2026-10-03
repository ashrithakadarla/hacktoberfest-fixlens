import React from 'react';
import { HelpCircle, X, CheckCircle2, Eye, Cpu, ShieldAlert } from 'lucide-react';
import type { DiagnosisResult } from '../types/diagnosis';

interface AskWhyModalProps {
  isOpen: boolean;
  onClose: () => void;
  diagnosis: DiagnosisResult;
}

export const AskWhyModal: React.FC<AskWhyModalProps> = ({ isOpen, onClose, diagnosis }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in font-sans">
      <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-slate-100 border border-slate-200 text-slate-800">
              <HelpCircle className="w-5 h-5 text-slate-800" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Visual Reasoning Breakdown</h3>
              <p className="text-xs text-slate-500">How Gemma 4 interpreted visual evidence</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Reasoning Paragraph */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 text-slate-800 text-sm leading-relaxed font-sans">
          <p className="font-medium">{diagnosis.reasoning}</p>
        </div>

        {/* Observation vs Inference Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Directly Observed */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2.5 shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 font-mono-code">
              <Eye className="w-4 h-4 text-emerald-600" /> Visual Facts
            </div>
            <ul className="space-y-2 text-xs text-slate-700">
              {diagnosis.observations.map((obs, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{obs}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Model Inference */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2.5 shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 font-mono-code">
              <Cpu className="w-4 h-4 text-slate-700" /> AI Inference
            </div>
            <p className="text-xs text-slate-800 leading-normal font-medium">
              "{diagnosis.primary_issue}"
            </p>
            {diagnosis.missing_information.length > 0 && (
              <div className="pt-2 border-t border-slate-100 text-[11px] text-amber-700 flex items-start gap-1">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>Note: {diagnosis.missing_information[0]}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-full transition-colors cursor-pointer"
          >
            Understood
          </button>
        </div>

      </div>
    </div>
  );
};
