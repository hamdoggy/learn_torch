import React from 'react';
import { TorchFunctionCard } from '../types';
import { CodeBlock } from './CodeBlock';
import { BookOpen, Tag, Activity, Terminal } from 'lucide-react';

interface FlashCardProps {
  card: TorchFunctionCard;
}

const difficultyColors = {
  '入门': 'bg-green-100 text-green-700 border-green-200',
  '进阶': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  '高级': 'bg-red-100 text-red-700 border-red-200',
};

export const FlashCard: React.FC<FlashCardProps> = ({ card }) => {
  return (
    <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="bg-gradient-to-r from-torch-500 to-torch-600 p-6 md:p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-black/10 rounded-full blur-xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3 opacity-90">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 border border-white/20 backdrop-blur-sm`}>
              {card.category}
            </span>
             <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 border border-white/20 backdrop-blur-sm flex items-center gap-1`}>
              <Activity size={12} />
              {card.difficulty}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-mono tracking-tight mb-2">
            {card.name}
          </h1>
          <p className="font-mono text-sm md:text-base text-torch-100 bg-black/20 inline-block px-3 py-1 rounded-lg">
            {card.signature}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 md:p-8 space-y-6">
        
        {/* Description Section */}
        <div>
          <div className="flex items-center gap-2 text-slate-800 font-semibold mb-2">
            <BookOpen size={20} className="text-torch-500" />
            <h2>这是什么？</h2>
          </div>
          <p className="text-slate-600 leading-relaxed text-lg">
            {card.description}
          </p>
        </div>

        {/* Code & Output Section */}
        <div>
          <div className="flex items-center gap-2 text-slate-800 font-semibold mb-1">
            <Tag size={20} className="text-torch-500" />
            <h2>代码示例</h2>
          </div>
          <div className="space-y-3">
            <CodeBlock code={card.codeExample} label="python" />
            
            <div className="relative">
              <div className="absolute -top-3 left-4 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-slate-900"></div>
              <CodeBlock code={card.output} label="output" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};