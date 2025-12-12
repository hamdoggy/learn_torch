import React from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  label?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, label = 'python' }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-lg overflow-hidden bg-slate-900 border border-slate-800 shadow-sm">
      <div className="flex justify-between items-center px-4 py-2 bg-slate-800/50 border-b border-slate-700/50">
        <span className="text-xs font-mono text-slate-400 uppercase">{label}</span>
        <button
          onClick={handleCopy}
          className="p-1.5 hover:bg-slate-700 rounded transition-colors duration-200"
          aria-label="Copy code"
        >
          {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} className="text-slate-400" />}
        </button>
      </div>
      <div className="p-4 overflow-x-auto custom-scrollbar">
        <pre className="text-sm font-mono text-slate-200 leading-relaxed whitespace-pre">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};