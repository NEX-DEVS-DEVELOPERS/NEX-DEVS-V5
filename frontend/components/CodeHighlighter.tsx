'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface CodeHighlighterProps {
  code: string;
  language?: string;
  lineNumbers?: boolean;
  projectImage?: string;
  projectTitle?: string;
  maxHeight?: string;
}

export default function CodeHighlighter({ 
  code, 
  language = 'javascript', 
  lineNumbers = true,
  projectImage,
  projectTitle,
  maxHeight = '500px'
}: CodeHighlighterProps) {
  const codeRef = useRef<HTMLElement>(null);
  const [codeLines, setCodeLines] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  
  useEffect(() => {
    // Split code into lines for line number display
    setCodeLines(code.split('\n'));
    
    // Dynamically import Prism only on the client side
    const loadPrism = async () => {
      if (typeof window !== 'undefined' && codeRef.current) {
        try {
          // Dynamic imports for Prism and its components
          const Prism = (await import('prismjs')).default;
          
          // Import theme - using link element instead of CSS import to avoid TS errors
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css';
          document.head.appendChild(link);
          
          // Import the language needed
          const prismLanguage = getLanguageAlias(language);
          try {
            await import(`prismjs/components/prism-${prismLanguage}.js`);
          } catch (e) {
            console.warn(`Failed to load language: ${prismLanguage}`, e);
          }
          
          // Safely highlight the element
          if (Prism && typeof Prism.highlightElement === 'function') {
            Prism.highlightElement(codeRef.current);
          }
        } catch (error) {
          console.error('Error loading Prism:', error);
        }
      }
    };
    
    loadPrism();
  }, [code, language]);
  
  // Function to get language alias
  const getLanguageAlias = (lang: string): string => {
    const languageMap: Record<string, string> = {
      'js': 'javascript',
      'jsx': 'jsx',
      'ts': 'typescript',
      'tsx': 'tsx',
      'py': 'python',
      'rb': 'ruby',
      'rs': 'rust',
      'sh': 'bash',
      'bash': 'bash',
      'shell': 'bash',
      'html': 'markup',
      'xml': 'markup',
      'md': 'markdown',
      'cs': 'csharp',
      'go': 'go',
      'java': 'java',
      'json': 'json',
      'yaml': 'yaml',
      'yml': 'yaml',
      'css': 'css',
      'scss': 'scss',
      'sql': 'sql',
      'c': 'c',
      'cpp': 'cpp',
      'php': 'php',
      'swift': 'swift',
      'kt': 'kotlin',
      'kotlin': 'kotlin',
    };
    
    return languageMap[lang.toLowerCase()] || lang;
  };
  
  // Use the mapped language name or default to the provided language
  const prismLanguage = getLanguageAlias(language);
  
  // Toggle expanded code view
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  
  // Copy code to clipboard
  const copyToClipboard = () => {
    if (navigator.clipboard && code) {
      navigator.clipboard.writeText(code);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };
  
  return (
    <div className="code-highlighter-container rounded-xl overflow-hidden shadow-xl border border-gray-700/50 bg-gradient-to-br from-gray-900/80 to-black flex flex-col">
      {/* Background image with overlay if provided */}
      {projectImage && (
        <div className="absolute inset-0 z-0 opacity-10">
          <Image 
            src={projectImage}
            alt={projectTitle || "Project preview"}
            fill
            className="object-cover blur-[1px]"
            priority={false}
            quality={20}
            unoptimized={projectImage.startsWith('data:')}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 to-[#1a1a2e]/90" />
        </div>
      )}

      {/* Main container with background */}
      <div className="relative z-10 shadow-[0_0_30px_rgba(124,58,237,0.2)] flex flex-col flex-grow">
        {/* Code editor header */}
        <div className="px-4 py-3 bg-black/80 backdrop-blur-sm border-b border-gray-700/50 flex items-center gap-1.5">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <div className="ml-4 flex-1 truncate">
            {projectTitle && (
              <span className="text-xs text-gray-400 font-mono">{projectTitle}</span>
            )}
          </div>
          {prismLanguage && (
            <div className="ml-auto flex items-center gap-3">
              <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-300 rounded font-mono border border-blue-500/30">
                {prismLanguage}
              </span>
              <button 
                onClick={toggleExpand}
                className="px-2 py-1 text-xs bg-purple-500/20 text-purple-300 rounded font-mono border border-purple-500/30 hover:bg-purple-500/30 transition-colors"
              >
                {isExpanded ? 'Collapse' : 'Expand'}
              </button>
              
              <button 
                onClick={copyToClipboard}
                className={`px-2 py-1 text-xs rounded font-mono border transition-colors flex items-center gap-1.5 ${
                  copySuccess 
                    ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                    : 'bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30'
                }`}
              >
                {copySuccess ? (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy
                  </>
                )}
              </button>
            </div>
          )}
        </div>
        
        {/* Code content container with scrollbar */}
        <div className="relative bg-gradient-to-br from-[#141420] to-[#0a0a18] backdrop-blur-sm flex-grow flex">
          {/* Line numbers column */}
          {lineNumbers && (
            <div className="sticky left-0 top-0 bottom-0 w-12 bg-black/40 backdrop-blur-sm flex flex-col items-end pr-3 pt-4 pb-4 text-xs text-gray-500/70 select-none font-mono border-r border-gray-700/30 z-10 h-full">
              {codeLines.map((_, i) => (
                <div key={i} className="leading-6 h-6">
                  {i + 1}
                </div>
              ))}
            </div>
          )}
          
          {/* Scrollable code area with fixed height */}
          <div 
            className="flex-grow relative overflow-hidden" 
            style={{ height: isExpanded ? 'auto' : maxHeight }}
          >
            <div
              className="scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-800 overflow-auto h-full"
              style={{ 
                maxHeight: isExpanded ? 'none' : maxHeight,
              }}
            >
              <pre className={`rounded-none bg-transparent m-0 ${lineNumbers ? 'pl-4' : 'pl-4'} pr-4 pt-4 pb-4 backdrop-blur-sm bg-black/30`}>
                <code
                  ref={codeRef}
                  className={`language-${prismLanguage} font-mono text-sm leading-6 block whitespace-pre`}
                >
                  {code}
                </code>
              </pre>
            </div>
            
            {/* Gradient fade effect at bottom when collapsed */}
            {!isExpanded && codeLines.length > 15 && (
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#0a0a18] to-transparent pointer-events-none"></div>
            )}
          </div>
        </div>
        
        {/* Show "See More" button for long code snippets */}
        {codeLines.length > 15 && !isExpanded && (
          <div className="text-center py-2 border-t border-gray-700/30 bg-black/40">
            <button 
              onClick={toggleExpand}
              className="px-4 py-1.5 bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 text-xs rounded-md transition-colors flex items-center gap-1.5 mx-auto"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              Show more code
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 