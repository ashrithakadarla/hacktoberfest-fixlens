import React from 'react';
import { Sparkles, Cpu, Terminal, Package, ArrowRight } from 'lucide-react';
import { DEMO_PRESETS, dataUrlToFile, type DemoPreset } from '../data/sampleDemos';
import type { CategoryType } from '../types/diagnosis';

interface DemoSelectorProps {
  onSelectDemo: (file: File, category: CategoryType, description: string) => void;
}

export const DemoSelector: React.FC<DemoSelectorProps> = ({ onSelectDemo }) => {
  const handlePresetClick = (preset: DemoPreset) => {
    const file = dataUrlToFile(preset.dataUrl, preset.imageFileName);
    onSelectDemo(file, preset.category, preset.description);
  };

  return (
    <div className="pt-6 border-t border-slate-200/80 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-slate-800" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono-code">
            Sample Scenarios
          </h4>
        </div>
        <span className="text-xs text-slate-400">Click any preset to test Gemma 4 scan</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {DEMO_PRESETS.map((preset) => {
          return (
            <div
              key={preset.id}
              onClick={() => handlePresetClick(preset)}
              className="group relative cursor-pointer bg-slate-50 hover:bg-white border border-slate-200/80 hover:border-slate-400 rounded-2xl p-4 transition-all duration-200 hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider text-slate-700 bg-slate-200/70 border border-slate-300 px-2.5 py-0.5 rounded-full">
                    {preset.badge}
                  </span>
                  {preset.category === 'electronics' && <Cpu className="w-4 h-4 text-slate-700" />}
                  {preset.category === 'software' && <Terminal className="w-4 h-4 text-slate-700" />}
                  {preset.category === 'physical_object' && <Package className="w-4 h-4 text-slate-700" />}
                </div>

                <h5 className="text-sm font-bold text-slate-900 group-hover:text-slate-950 transition-colors mb-1.5">
                  {preset.title}
                </h5>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  "{preset.description}"
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-200/60 text-xs font-bold text-slate-900 group-hover:translate-x-0.5 transition-transform">
                <span>Load Scenario</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
