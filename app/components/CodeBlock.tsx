'use client';

import { useState } from 'react';

interface CodeBlockProps {
  code: string;
  language: string;
}

export default function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <button
        onClick={copyToClipboard}
        className="absolute right-4 top-4 p-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 transition-colors"
        aria-label={copied ? "Copied to clipboard" : "Copy to clipboard"}
      >
        <span className={`text-sm ${copied ? 'text-green-400' : 'text-purple-400'}`}>
          {copied ? '✓ Copied' : 'Copy'}
        </span>
      </button>
      <pre className="text-purple-300 overflow-x-auto p-6 rounded-lg bg-black/30 border border-purple-500/10">
        <code>{code}</code>
      </pre>
    </div>
  );
} 
