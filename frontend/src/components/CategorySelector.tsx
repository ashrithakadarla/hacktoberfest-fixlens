import React from 'react';
import { Cpu, Terminal, Package, Sparkles } from 'lucide-react';
import type { CategoryType } from '../types/diagnosis';

interface CategoryOption {
  id: CategoryType;
  label: string;
  icon: React.ReactNode;
  hint: string;
  number: string;
}

const CATEGORIES: CategoryOption[] = [
  {
    id: 'auto_detect',
    number: '01',
    label: 'Auto Detect',
    icon: <Sparkles className="w-4 h-4 text-slate-700" />,
    hint: 'Gemma 4 automatically classifies subject',
  },
  {
    id: 'electronics',
    number: '02',
    label: 'Electronics',
    icon: <Cpu className="w-4 h-4 text-slate-700" />,
    hint: 'Circuits, breadboards, wiring, microcontrollers',
  },
  {
    id: 'software',
    number: '03',
    label: 'Computer / Software',
    icon: <Terminal className="w-4 h-4 text-slate-700" />,
    hint: 'Terminal errors, stack traces, code screenshots',
  },
  {
    id: 'physical_object',
    number: '04',
    label: 'Physical Object',
    icon: <Package className="w-4 h-4 text-slate-700" />,
    hint: 'Assembly joints, mechanical components, tools',
  },
];

interface CategorySelectorProps {
  selectedCategory: CategoryType;
  onSelectCategory: (category: CategoryType) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono-code">
          Diagnostic Domain
        </label>
        <span className="text-[11px] text-slate-400">Select domain or use Auto Detect</span>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`flex flex-col justify-between p-4 rounded-2xl text-left border transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                  : 'bg-white border-slate-200/80 text-slate-800 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-xl ${isSelected ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-700'}`}>
                    {cat.icon}
                  </div>
                  <span className={`text-[11px] font-mono-code font-semibold ${isSelected ? 'text-slate-400' : 'text-slate-400'}`}>
                    {cat.number}
                  </span>
                </div>
                <h4 className="text-sm font-bold tracking-tight mb-1">
                  {cat.label}
                </h4>
              </div>
              <p className={`text-[11px] leading-relaxed line-clamp-2 mt-2 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                {cat.hint}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
