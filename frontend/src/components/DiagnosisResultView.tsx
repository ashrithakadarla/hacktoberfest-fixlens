import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  ShieldAlert,
  RotateCcw,
  Send,
  Eye,
  ListChecks,
  ChevronDown,
  ChevronUp,
  Cpu,
  Sparkles,
  Maximize2,
  X,
  Info,
  ArrowRight
} from 'lucide-react';
import type { DiagnosisResult, FollowUpMessage } from '../types/diagnosis';
import { AskWhyModal } from './AskWhyModal';
import { askFollowUp } from '../services/api';

interface DiagnosisResultViewProps {
  diagnosis: DiagnosisResult;
  previewUrl: string | null;
  category: string;
  description: string;
  onReset: () => void;
}

export const DiagnosisResultView: React.FC<DiagnosisResultViewProps> = ({
  diagnosis,
  previewUrl,
  category,
  description,
  onReset,
}) => {
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({});
  const [isWhyOpen, setIsWhyOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [showAlternatives, setShowAlternatives] = useState(false);

  // Follow-up Q&A state
  const [followUpQuestion, setFollowUpQuestion] = useState('');
  const [followUpMessages, setFollowUpMessages] = useState<FollowUpMessage[]>([]);
  const [isSubmittingFollowUp, setIsSubmittingFollowUp] = useState(false);

  const toggleStep = (idx: number) => {
    setCheckedSteps((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const completedStepsCount = Object.values(checkedSteps).filter(Boolean).length;
  const totalStepsCount = diagnosis.recommended_steps.length;
  const isAllStepsCompleted = totalStepsCount > 0 && completedStepsCount === totalStepsCount;

  const handleSendFollowUp = async (qText?: string) => {
    const text = qText || followUpQuestion;
    if (!text.trim() || isSubmittingFollowUp) return;

    setIsSubmittingFollowUp(true);
    setFollowUpQuestion('');

    try {
      const res = await askFollowUp(text, diagnosis, category, description);
      const newMsg: FollowUpMessage = {
        id: Date.now().toString(),
        question: text,
        answer: res.answer,
        reasoning: res.reasoning,
        suggested_steps: res.suggested_steps,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setFollowUpMessages((prev) => [...prev, newMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingFollowUp(false);
    }
  };

  const isInsufficient =
    diagnosis.status === 'not_enough_evidence' ||
    diagnosis.confidence_level === 'insufficient_evidence';

  // Badges styling
  const getStatusBadge = () => {
    switch (diagnosis.status) {
      case 'confirmed_issue':
        return { label: 'Confirmed Issue', color: 'bg-rose-100 text-rose-900 border-rose-200' };
      case 'likely_issue':
        return { label: 'Likely Issue Detected', color: 'bg-amber-100 text-amber-900 border-amber-200' };
      case 'possible_issue':
        return { label: 'Possible Issue Detected', color: 'bg-yellow-100 text-yellow-900 border-yellow-200' };
      case 'not_enough_evidence':
        return { label: 'Not Enough Evidence', color: 'bg-slate-100 text-slate-800 border-slate-200' };
      default:
        return { label: 'Diagnostic Assessment', color: 'bg-slate-100 text-slate-800 border-slate-200' };
    }
  };

  const getConfidenceBadge = () => {
    switch (diagnosis.confidence_level) {
      case 'high':
        return { label: 'High Confidence', color: 'bg-emerald-100 text-emerald-900 border-emerald-200' };
      case 'medium':
        return { label: 'Medium Confidence', color: 'bg-blue-100 text-blue-900 border-blue-200' };
      case 'low':
        return { label: 'Low Confidence', color: 'bg-amber-100 text-amber-900 border-amber-200' };
      default:
        return { label: 'Insufficient Evidence', color: 'bg-slate-100 text-slate-800 border-slate-200' };
    }
  };

  const statusInfo = getStatusBadge();
  const confidenceInfo = getConfidenceBadge();

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 space-y-8 animate-fade-in font-sans">
      
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/80 p-4 rounded-3xl shadow-2xs">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Start New Scan
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusInfo.color}`}>
            {statusInfo.label}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${confidenceInfo.color}`}>
            {confidenceInfo.label}
          </span>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Image Panel */}
          <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden p-3 shadow-sm">
            <div className="relative aspect-video sm:aspect-square w-full bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center">
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Diagnosed problem evidence"
                  className="w-full h-full object-contain cursor-pointer hover:scale-102 transition-transform duration-300"
                  onClick={() => setIsLightboxOpen(true)}
                />
              )}
              <button
                onClick={() => setIsLightboxOpen(true)}
                className="absolute top-3 right-3 p-2 bg-slate-950/70 hover:bg-slate-950 text-white rounded-xl backdrop-blur-xs transition-opacity cursor-pointer"
                title="Expand Image"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
            <div className="p-2 text-center">
              <span className="text-xs text-slate-400">Click image to enlarge & inspect detail</span>
            </div>
          </div>

          {/* Headline & Why Action */}
          <div className="p-6 bg-white border border-slate-200/90 rounded-3xl space-y-4 shadow-sm">
            <span className="inline-block text-[10px] font-mono-code font-bold uppercase tracking-wider text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full">
              Category: {category.replace('_', ' ')}
            </span>

            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {diagnosis.title}
            </h2>

            {description && (
              <p className="text-xs text-slate-500 italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                Context provided: "{description}"
              </p>
            )}

            {/* Why Do You Think This Button */}
            <button
              onClick={() => setIsWhyOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-2xl shadow-sm transition-all duration-200 hover:scale-101 cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-slate-300" />
              <span>Why do you think this?</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-60" />
            </button>
          </div>

          {/* Safety Warning Card */}
          {diagnosis.safety_note && (
            <div className="p-5 bg-amber-50 border border-amber-200 rounded-3xl space-y-2 text-amber-900 shadow-2xs">
              <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-amber-800">
                <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Safety Precaution</span>
              </div>
              <p className="text-xs leading-relaxed font-medium">
                {diagnosis.safety_note}
              </p>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-6">

          {/* Insufficient Evidence Warning Banner */}
          {isInsufficient && (
            <div className="p-6 bg-amber-50 border border-amber-200 rounded-3xl space-y-3 shadow-2xs">
              <div className="flex items-center gap-3 text-amber-900 font-bold text-base">
                <AlertTriangle className="w-6 h-6 text-amber-700 shrink-0" />
                <span>Not Enough Visual Evidence</span>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                FixLens identified some components, but cannot reliably confirm the cause from this image alone.
              </p>
              {diagnosis.missing_information.length > 0 && (
                <div className="pt-2 border-t border-amber-200/80 text-xs text-amber-900">
                  <strong className="text-amber-950">Missing detail:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    {diagnosis.missing_information.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="pt-2">
                <button
                  onClick={onReset}
                  className="px-4 py-2 bg-amber-900 hover:bg-amber-950 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Upload Clearer Photo
                </button>
              </div>
            </div>
          )}

          {/* 1. What I See (Observed Components) */}
          <div className="p-6 bg-white border border-slate-200/90 rounded-3xl space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                <Eye className="w-4 h-4 text-slate-700" />
                <span>What I See (Observed Components)</span>
              </div>
              <span className="text-xs font-mono-code text-slate-400">Direct Visual Facts</span>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-800 pt-1">
              {diagnosis.observations.map((obs, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="font-medium">{obs}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 2. Primary Issue & Visual Reasoning */}
          <div className="p-6 bg-white border border-slate-200/90 rounded-3xl space-y-4 shadow-sm">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
              <Cpu className="w-4 h-4 text-slate-700" />
              <span>Likely Problem & Visual Evidence</span>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-1">
                <span className="text-[10px] uppercase font-mono-code font-bold text-slate-300 tracking-wider">Likely Problem</span>
                <p className="text-base font-bold">{diagnosis.primary_issue}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-[10px] uppercase font-mono-code font-bold text-slate-500 tracking-wider">Visual Reasoning</span>
                <p className="text-xs text-slate-700 leading-relaxed font-sans">{diagnosis.reasoning}</p>
              </div>
            </div>
          </div>

          {/* 3. HOW TO FIX (Troubleshooting Checklist) */}
          <div className="p-6 bg-white border border-slate-200/90 rounded-3xl space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                <ListChecks className="w-4 h-4 text-slate-700" />
                <span>HOW TO FIX</span>
              </div>
              <div className="flex items-center gap-2">
                {isAllStepsCompleted && (
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    All Steps Completed ✓
                  </span>
                )}
                <span className="text-xs font-mono-code text-slate-400">
                  {completedStepsCount} of {totalStepsCount} completed
                </span>
              </div>
            </div>

            <ol className="space-y-3">
              {diagnosis.recommended_steps.map((step, idx) => {
                const isChecked = !!checkedSteps[idx];
                return (
                  <li
                    key={idx}
                    onClick={() => toggleStep(idx)}
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 ${
                      isChecked
                        ? 'bg-emerald-50/70 border-emerald-200 text-slate-500 line-through'
                        : 'bg-slate-50 border-slate-200/80 text-slate-800 hover:border-slate-400 hover:bg-slate-100/60'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
                      isChecked
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-slate-800'
                    }`}>
                      {isChecked ? '✓' : idx + 1}
                    </div>
                    <span className="text-xs sm:text-sm font-medium leading-relaxed">{step}</span>
                  </li>
                );
              })}
            </ol>

            {/* Verification Loop Banner */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Did that fix it?</h4>
                  <p className="text-[11px] text-slate-500">Verify the fix by taking or uploading another photo.</p>
                </div>
                <button
                  onClick={onReset}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Verify the Fix
                </button>
              </div>
            </div>
          </div>

          {/* 4. Alternative Causes (Collapsible) */}
          {diagnosis.alternative_causes.length > 0 && (
            <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-sm">
              <button
                onClick={() => setShowAlternatives(!showAlternatives)}
                className="w-full flex items-center justify-between p-5 text-left font-bold text-sm text-slate-800 hover:text-slate-950 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-slate-700" />
                  <span>Alternative Possible Causes ({diagnosis.alternative_causes.length})</span>
                </div>
                {showAlternatives ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
              </button>

              {showAlternatives && (
                <div className="px-5 pb-5 pt-1 border-t border-slate-100 space-y-2">
                  <ul className="space-y-2 text-xs text-slate-700">
                    {diagnosis.alternative_causes.map((alt, idx) => (
                      <li key={idx} className="flex items-start gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <span className="text-slate-900 font-bold">•</span>
                        <span>{alt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* 5. Follow-Up Questions Section */}
          <div className="p-6 bg-white border border-slate-200/90 rounded-3xl space-y-4 shadow-sm">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
              <Sparkles className="w-4 h-4 text-slate-700" />
              <span>Ask Follow-up Questions</span>
            </div>

            {/* Quick Prompt Chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              {[
                'Could there be another problem?',
                'What should I check first?',
                "Explain this like I'm a beginner",
                'What happens if I don\'t fix it?'
              ].map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleSendFollowUp(chip)}
                  disabled={isSubmittingFollowUp}
                  className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-full transition-colors cursor-pointer disabled:opacity-50"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Follow-up Conversation Feed */}
            {followUpMessages.length > 0 && (
              <div className="space-y-3 pt-2">
                {followUpMessages.map((msg) => (
                  <div key={msg.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900">Q: "{msg.question}"</span>
                      <span className="text-[10px] text-slate-400 font-mono-code">{msg.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-sans">
                      {msg.answer}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Input Bar */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={followUpQuestion}
                onChange={(e) => setFollowUpQuestion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendFollowUp()}
                placeholder="Ask Gemma 4 a follow-up question about this diagnosis..."
                disabled={isSubmittingFollowUp}
                className="flex-1 bg-white border border-slate-200 focus:border-slate-900 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-all disabled:opacity-50"
              />
              <button
                onClick={() => handleSendFollowUp()}
                disabled={!followUpQuestion.trim() || isSubmittingFollowUp}
                className="p-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && previewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in">
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-4 right-4 p-2.5 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-colors z-10 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={previewUrl}
              alt="Enlarged inspection view"
              className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      )}

      {/* Why Modal */}
      <AskWhyModal
        isOpen={isWhyOpen}
        onClose={() => setIsWhyOpen(false)}
        diagnosis={diagnosis}
      />
    </div>
  );
};
