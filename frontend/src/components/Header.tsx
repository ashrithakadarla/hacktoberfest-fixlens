import React, { useState } from 'react';
import { Camera, Sparkles, Cpu, Menu, X, ArrowUpRight } from 'lucide-react';
import type { HealthStatus } from '../types/diagnosis';

interface HeaderProps {
  healthStatus?: HealthStatus | null;
  onReset?: () => void;
  onScrollToWorkspace?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ healthStatus, onReset, onScrollToWorkspace }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    if (sectionId === 'workspace' && onScrollToWorkspace) {
      onScrollToWorkspace();
      return;
    }
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[#FAF9F5]/85 border-b border-slate-200/70 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Left: Brand Logo & Name */}
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={onReset}
        >
          <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-md group-hover:bg-slate-800 transition-colors duration-200">
            <Camera className="w-5 h-5 text-slate-100 group-hover:scale-110 transition-transform duration-200" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-slate-900 font-sans">
                Fix<span className="text-slate-500 font-serif-display italic">Lens</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold tracking-wide text-slate-700 bg-slate-100 border border-slate-200/80 px-2.5 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3 text-indigo-600" /> Gemma 4 Vision
              </span>
            </div>
          </div>
        </div>

        {/* Center Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <button 
            onClick={() => handleNavClick('how-it-works')}
            className="hover:text-slate-900 transition-colors cursor-pointer"
          >
            How it works
          </button>
          <button 
            onClick={() => handleNavClick('capabilities')}
            className="hover:text-slate-900 transition-colors cursor-pointer"
          >
            Capabilities
          </button>
          <button 
            onClick={() => handleNavClick('why-fixlens')}
            className="hover:text-slate-900 transition-colors cursor-pointer"
          >
            Why FixLens
          </button>
          <button 
            onClick={() => handleNavClick('demos')}
            className="hover:text-slate-900 transition-colors cursor-pointer"
          >
            Demo
          </button>
        </nav>

        {/* Right Actions (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          {/* Health Status Telemetry */}
          <div className="flex items-center gap-2 text-xs font-mono-code text-slate-600 bg-white border border-slate-200/80 px-3 py-1.5 rounded-full shadow-2xs">
            <Cpu className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-700">{healthStatus?.model || 'gemma-4-9b-it'}</span>
            <span 
              className={`w-2 h-2 rounded-full ${
                healthStatus?.api_configured ? 'bg-emerald-500 shadow-xs shadow-emerald-400' : 'bg-amber-500'
              }`}
              title={healthStatus?.api_configured ? 'API Connected' : 'Offline / Standby'}
            />
          </div>

          {/* Primary CTA */}
          <button
            onClick={() => handleNavClick('workspace')}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs tracking-wide rounded-full shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-98"
          >
            <span>Try FixLens</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
          </button>
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => handleNavClick('workspace')}
            className="px-3.5 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-full"
          >
            Try FixLens
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-[#FAF9F5] px-4 py-4 space-y-3 animate-fade-in shadow-xl">
          <button 
            onClick={() => handleNavClick('how-it-works')}
            className="block w-full text-left py-2 px-3 text-sm font-semibold text-slate-800 hover:bg-slate-200/50 rounded-xl"
          >
            How it works
          </button>
          <button 
            onClick={() => handleNavClick('capabilities')}
            className="block w-full text-left py-2 px-3 text-sm font-semibold text-slate-800 hover:bg-slate-200/50 rounded-xl"
          >
            Capabilities
          </button>
          <button 
            onClick={() => handleNavClick('why-fixlens')}
            className="block w-full text-left py-2 px-3 text-sm font-semibold text-slate-800 hover:bg-slate-200/50 rounded-xl"
          >
            Why FixLens
          </button>
          <button 
            onClick={() => handleNavClick('demos')}
            className="block w-full text-left py-2 px-3 text-sm font-semibold text-slate-800 hover:bg-slate-200/50 rounded-xl"
          >
            Demo
          </button>
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 px-3">
            <span>Model Status:</span>
            <span className="font-mono-code font-bold text-slate-800">{healthStatus?.model || 'gemma-4-9b-it'}</span>
          </div>
        </div>
      )}
    </header>
  );
};
