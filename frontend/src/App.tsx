import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CategorySelector } from './components/CategorySelector';
import { ImageUpload } from './components/ImageUpload';
import { DemoSelector } from './components/DemoSelector';
import { AnalyzingView } from './components/AnalyzingView';
import { DiagnosisResultView } from './components/DiagnosisResultView';
import type { CategoryType, DiagnosisResult, HealthStatus } from './types/diagnosis';
import { diagnoseImage, checkHealth } from './services/api';
import {
  Camera,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Wrench,
  Terminal,
  Cpu,
  Package,
  Eye,
  CheckCircle2,
  ArrowUpRight
} from 'lucide-react';

export function App() {
  const [viewState, setViewState] = useState<'input' | 'analyzing' | 'result'>('input');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('auto_detect');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDiagnosing, setIsDiagnosing] = useState(false);

  useEffect(() => {
    checkHealth().then(setHealthStatus).catch(console.error);
  }, []);

  const handleSelectFile = (file: File | null) => {
    setSelectedFile(file);
    if (previewUrl && !previewUrl.startsWith('data:')) {
      URL.revokeObjectURL(previewUrl);
    }
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
    setErrorMsg(null);
  };

  const handleSelectDemo = (file: File, category: CategoryType, desc: string) => {
    setSelectedFile(file);
    setSelectedCategory(category);
    setDescription(desc);
    
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setErrorMsg(null);

    // Smooth scroll down to workspace
    const workspaceElem = document.getElementById('workspace');
    if (workspaceElem) {
      workspaceElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleRunDiagnosis = async () => {
    if (!selectedFile) {
      setErrorMsg('Please upload a photo or capture an image using your camera first.');
      return;
    }

    setErrorMsg(null);
    setIsDiagnosing(true);
    setViewState('analyzing');

    try {
      const result = await diagnoseImage(selectedFile, selectedCategory, description);
      setDiagnosisResult(result);
      setViewState('result');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "We couldn't analyze that image. Please try again or upload a clearer photo.");
      setViewState('input');
    } finally {
      setIsDiagnosing(false);
    }
  };

  const handleReset = () => {
    setViewState('input');
    setSelectedFile(null);
    if (previewUrl && !previewUrl.startsWith('data:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setDescription('');
    setDiagnosisResult(null);
    setErrorMsg(null);
  };

  const scrollToWorkspace = () => {
    const elem = document.getElementById('workspace');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-slate-900 flex flex-col font-sans selection:bg-slate-900 selection:text-white">
      {/* Top Navigation Header */}
      <Header 
        healthStatus={healthStatus} 
        onReset={handleReset} 
        onScrollToWorkspace={scrollToWorkspace}
      />

      {/* Main Content View */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-24">
        
        {/* VIEW 1: LANDING PAGE & WORKSPACE INPUT */}
        {viewState === 'input' && (
          <>
            {/* HERO SECTION */}
            <section className="pt-6 sm:pt-12 pb-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* HERO LEFT COLUMN */}
              <div className="lg:col-span-7 space-y-6 text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-full font-mono-code shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>GEMMA 4 · MULTIMODAL AI</span>
                </div>

                <h1 className="text-5xl sm:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.05] font-sans">
                  Don't describe the problem.<br />
                  <span className="font-serif-display italic font-normal text-slate-700">Show it.</span>
                </h1>

                <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                  FixLens uses <strong>Gemma 4's</strong> multimodal vision capabilities to understand what you're showing, identify possible problems, explain the visual evidence, and guide you through a fix.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button
                    onClick={scrollToWorkspace}
                    className="inline-flex items-center gap-2 px-7 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:scale-102 cursor-pointer active:scale-98"
                  >
                    <span>Try FixLens</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <a
                    href="#how-it-works"
                    className="inline-flex items-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200/90 font-semibold text-sm rounded-full shadow-2xs transition-all duration-200 cursor-pointer"
                  >
                    <span>See how it works</span>
                  </a>
                </div>

                {/* Capabilities pills */}
                <div className="pt-6 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 border-t border-slate-200/70">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-slate-800" /> Electronics & Wiring
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-slate-800" /> Code & Screenshots
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-slate-800" /> Physical Assembly
                  </span>
                </div>
              </div>

              {/* HERO RIGHT COLUMN: Visual Hero Presentation Card */}
              <div className="lg:col-span-5">
                <div className="relative bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xl space-y-4">
                  
                  {/* Hero Visual Mockup Box */}
                  <div className="relative aspect-[4/3] rounded-2xl bg-slate-950 overflow-hidden flex items-center justify-center border border-slate-200/80 group">
                    
                    {/* Simulated scanning SVG scene */}
                    <svg className="w-full h-full object-cover" viewBox="0 0 400 300" fill="none">
                      <rect width="400" height="300" fill="#0F172A"/>
                      <circle cx="200" cy="150" r="80" stroke="#334155" strokeWidth="2" strokeDasharray="6 6"/>
                      
                      {/* Circuit elements mock */}
                      <rect x="120" y="110" width="160" height="80" rx="8" fill="#1E293B" stroke="#475569" strokeWidth="2"/>
                      <circle cx="160" cy="150" r="14" fill="#EF4444" opacity="0.85"/>
                      <path d="M 220 130 L 260 170" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round"/>
                      
                      {/* Bounding box scanning box */}
                      <rect x="135" y="125" width="50" height="50" rx="6" stroke="#6366F1" strokeWidth="2" strokeDasharray="4 4" fill="none"/>
                      <text x="140" y="120" fill="#818CF8" fontSize="10" fontFamily="monospace" fontWeight="bold">LED (Polarity)</text>
                    </svg>

                    {/* Laser overlay animation */}
                    <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-400 to-transparent shadow-[0_0_12px_#818cf8] animate-scan" />

                    {/* AI Tag Overlay */}
                    <div className="absolute bottom-3 left-3 right-3 bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-800 text-white flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-indigo-400" />
                        <div>
                          <p className="text-xs font-bold font-sans">Arduino LED Circuit</p>
                          <p className="text-[10px] text-slate-400 font-mono-code">Gemma 4 Confidence 82%</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono-code bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full font-bold">
                        Analysis Ready
                      </span>
                    </div>
                  </div>

                  {/* Interactive Quick Action */}
                  <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between text-xs text-slate-700">
                    <span className="font-semibold">Ready to diagnose your own issue?</span>
                    <button
                      onClick={scrollToWorkspace}
                      className="px-3.5 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      Start Scan
                    </button>
                  </div>
                </div>
              </div>

            </section>


            {/* HOW IT WORKS SECTION */}
            <section id="how-it-works" className="space-y-8 pt-6">
              <div className="text-center space-y-3 max-w-2xl mx-auto">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono-code">
                  How FixLens Works
                </span>
                <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-sans">
                  From problem to solution.
                </h2>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  Three steps to resolve hardware, code, and physical assembly problems without searching for technical terms.
                </p>
              </div>

              {/* 3 Step Editorial Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Step 1 */}
                <div className="bg-white border border-slate-200/90 rounded-3xl p-8 space-y-4 shadow-xs hover:border-slate-300 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-extrabold text-slate-300 font-serif-display">01</span>
                    <div className="p-3 rounded-2xl bg-slate-100 text-slate-800">
                      <Camera className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">
                    SHOW IT
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Upload a photo or use your device camera. No need to know component names or technical terminology.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="bg-white border border-slate-200/90 rounded-3xl p-8 space-y-4 shadow-xs hover:border-slate-300 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-extrabold text-slate-300 font-serif-display">02</span>
                    <div className="p-3 rounded-2xl bg-slate-100 text-slate-800">
                      <Eye className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">
                    UNDERSTAND IT
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Gemma 4 analyzes visual evidence, identifies components, checks for anomalies, and explains what's wrong.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="bg-white border border-slate-200/90 rounded-3xl p-8 space-y-4 shadow-xs hover:border-slate-300 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-extrabold text-slate-300 font-serif-display">03</span>
                    <div className="p-3 rounded-2xl bg-slate-100 text-slate-800">
                      <Wrench className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">
                    FIX IT
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Follow step-by-step instructions, check off completed tasks, and verify the fix with a follow-up scan.
                  </p>
                </div>

              </div>
            </section>


            {/* DIAGNOSTIC MODES / CAPABILITIES SECTION */}
            <section id="capabilities" className="space-y-8 pt-6">
              <div className="text-center space-y-3 max-w-2xl mx-auto">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono-code">
                  Multimodal Domains
                </span>
                <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-sans">
                  What can FixLens understand?
                </h2>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  Gemma 4 evaluates visual details across electronics, software errors, and mechanical assemblies.
                </p>
              </div>

              {/* 4 Feature Tiles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* 01 Electronics */}
                <div className="bg-white border border-slate-200/90 rounded-3xl p-6 space-y-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-mono-code font-extrabold text-slate-400">01</span>
                      <div className="p-2.5 rounded-xl bg-slate-100 text-slate-800">
                        <Cpu className="w-5 h-5" />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                      Electronics
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Circuits, breadboards, wiring, Arduino, Raspberry Pi, resistors, LEDs, and pin connections.
                    </p>
                  </div>
                </div>

                {/* 02 Computer / Software */}
                <div className="bg-white border border-slate-200/90 rounded-3xl p-6 space-y-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-mono-code font-extrabold text-slate-400">02</span>
                      <div className="p-2.5 rounded-xl bg-slate-100 text-slate-800">
                        <Terminal className="w-5 h-5" />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                      Computer / Software
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Terminal error logs, stack traces, IDE screenshots, syntax errors, and missing package imports.
                    </p>
                  </div>
                </div>

                {/* 03 Physical Objects */}
                <div className="bg-white border border-slate-200/90 rounded-3xl p-6 space-y-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-mono-code font-extrabold text-slate-400">03</span>
                      <div className="p-2.5 rounded-xl bg-slate-100 text-slate-800">
                        <Package className="w-5 h-5" />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                      Physical Objects
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Assembly joint gaps, mechanical fasteners, cross-threaded bolts, tool orientation, and physical parts.
                    </p>
                  </div>
                </div>

                {/* 04 Auto Detect */}
                <div className="bg-slate-900 text-white rounded-3xl p-6 space-y-4 shadow-md flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-mono-code font-extrabold text-slate-500">04</span>
                      <div className="p-2.5 rounded-xl bg-slate-800 text-white">
                        <Sparkles className="w-5 h-5 text-indigo-400" />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">
                      Auto Detect
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Let Gemma 4 automatically classify the domain and analyze whatever problem you present.
                    </p>
                  </div>
                </div>

              </div>
            </section>


            {/* MAIN FIXLENS WORKSPACE SECTION */}
            <section id="workspace" className="pt-6 space-y-8">
              
              {/* Workspace Header */}
              <div className="text-center space-y-3 max-w-2xl mx-auto">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono-code">
                  FixLens Workspace
                </span>
                <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-sans">
                  Show FixLens the problem.
                </h2>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  Upload an image or use your camera. You don't need to know what's wrong.
                </p>
              </div>

              {/* Error Banner Notification */}
              {errorMsg && (
                <div className="max-w-3xl mx-auto flex items-center gap-3 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs sm:text-sm shadow-xs font-medium">
                  <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
                  <span className="flex-1">{errorMsg}</span>
                </div>
              )}

              {/* Workspace Card */}
              <div className="max-w-4xl mx-auto bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 space-y-8 shadow-sm">
                
                {/* Domain Category Selector */}
                <CategorySelector
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                />

                {/* Dropzone & Live Camera */}
                <ImageUpload
                  selectedFile={selectedFile}
                  previewUrl={previewUrl}
                  onSelectFile={handleSelectFile}
                  description={description}
                  onChangeDescription={setDescription}
                />

                {/* Primary Diagnose CTA Button */}
                <div className="pt-2">
                  <button
                    onClick={handleRunDiagnosis}
                    disabled={!selectedFile || isDiagnosing}
                    className="w-full flex items-center justify-center gap-3 py-4 px-8 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-base rounded-2xl shadow-md transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer"
                  >
                    <Camera className="w-5 h-5" />
                    <span>Diagnose with Gemma 4</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Demo Scenarios Section */}
                <DemoSelector onSelectDemo={handleSelectDemo} />

              </div>
            </section>


            {/* WHY FIXLENS SECTION */}
            <section id="why-fixlens" className="pt-6 space-y-8">
              <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-14 space-y-6 shadow-xl">
                <div className="max-w-3xl space-y-4">
                  <span className="text-xs font-mono-code font-bold uppercase tracking-wider text-indigo-400">
                    Why FixLens
                  </span>
                  <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight font-sans">
                    Troubleshooting shouldn't require the right words.
                  </h2>
                  <p className="text-base text-slate-300 leading-relaxed font-sans">
                    Traditional troubleshooting requires users to understand the problem before asking for help. FixLens reverses that model.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-slate-800 text-xs text-slate-300">
                  <div className="space-y-2">
                    <strong className="text-white text-sm block">1. You show the problem</strong>
                    <p className="text-slate-400">Point your camera or upload a photo of the circuit, screen, or object.</p>
                  </div>
                  <div className="space-y-2">
                    <strong className="text-white text-sm block">2. Gemma interprets it</strong>
                    <p className="text-slate-400">Multimodal AI extracts visual evidence and identifies potential anomalies.</p>
                  </div>
                  <div className="space-y-2">
                    <strong className="text-white text-sm block">3. FixLens guides you</strong>
                    <p className="text-slate-400">Follow structured fix steps and verify the outcome with a follow-up check.</p>
                  </div>
                </div>
              </div>
            </section>


            {/* DEMO SCENARIOS STANDALONE PREVIEWS */}
            <section id="demos" className="pt-6 space-y-6">
              <div className="text-center space-y-2 max-w-xl mx-auto">
                <span className="text-xs font-mono-code font-bold uppercase tracking-wider text-slate-500">
                  Interactive Demo
                </span>
                <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  Try a problem.
                </h3>
                <p className="text-xs text-slate-600">
                  Click any demo scenario to test FixLens's multimodal analysis pipeline instantly.
                </p>
              </div>

              <div className="max-w-4xl mx-auto">
                <DemoSelector onSelectDemo={handleSelectDemo} />
              </div>
            </section>

          </>
        )}

        {/* VIEW 2: ANALYZING STATE */}
        {viewState === 'analyzing' && (
          <AnalyzingView
            previewUrl={previewUrl}
            category={selectedCategory}
          />
        )}

        {/* VIEW 3: DIAGNOSIS RESULT STATE */}
        {viewState === 'result' && diagnosisResult && (
          <DiagnosisResultView
            diagnosis={diagnosisResult}
            previewUrl={previewUrl}
            category={selectedCategory}
            description={description}
            onReset={handleReset}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-10 px-4 text-slate-600 text-xs mt-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-white">
              <Camera className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900">FixLens</span>
              <p className="text-[11px] text-slate-500">Don't describe the problem. Show it.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-slate-500 font-medium">
            <span>Powered by <strong>Gemma 4</strong> through Gemini API</span>
            <span>•</span>
            <span>MLH Hack Day 2026</span>
            <span>•</span>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-slate-900 inline-flex items-center gap-1 transition-colors"
            >
              <span>Repository</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
