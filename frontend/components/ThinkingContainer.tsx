'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp, Brain } from 'lucide-react';

interface ThinkingContainerProps {
  isVisible: boolean;
  isThinking: boolean;
  thinkingText: string;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onAutoCollapse?: () => void;
  autoCollapseDelay?: number;
  currentModel?: string;
  userQuery?: string;
  isThinkingModel?: boolean;
}

const ThinkingContainer: React.FC<ThinkingContainerProps> = ({
  isVisible,
  isThinking,
  thinkingText,
  isCollapsed,
  onToggleCollapse,
  onAutoCollapse,
  autoCollapseDelay = 3000,
  currentModel = '',
  userQuery = '',
  isThinkingModel = false
}) => {
  // CRITICAL: Hide ThinkingContainer completely from UI while preserving AI functionality
  return null;
  const [displayText, setDisplayText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [thinkingDuration, setThinkingDuration] = useState(0);
  const streamingRef = useRef<NodeJS.Timeout | null>(null);
  const autoCollapseRef = useRef<NodeJS.Timeout | null>(null);
  const durationRef = useRef<NodeJS.Timeout | null>(null);

  // Generate appropriate text based on model type - simplified for non-thinking models
  const getDisplayContent = () => {
    if (isThinkingModel && thinkingText) {
      return thinkingText;
    }
    // For non-thinking models, don't show any text content - just animation
    return '';
  };

  // Thinking duration timer (9-12 seconds for thinking models)
  useEffect(() => {
    if (isThinking && isVisible) {
      setThinkingDuration(0);
      const duration = isThinkingModel ? Math.floor(Math.random() * 4000) + 9000 : 3000; // 9-12s for thinking models, 3s for others

      const startTime = Date.now();
      const updateDuration = () => {
        const elapsed = Date.now() - startTime;
        setThinkingDuration(elapsed);

        if (elapsed < duration) {
          durationRef.current = setTimeout(updateDuration, 100);
        }
      };

      updateDuration();

      return () => {
        if (durationRef.current) {
          clearTimeout(durationRef.current);
        }
      };
    }
  }, [isThinking, isVisible, isThinkingModel]);

  // Live streaming text animation
  useEffect(() => {
    const contentToDisplay = getDisplayContent();

    if (!contentToDisplay || !isThinking) {
      setDisplayText('');
      setIsStreaming(false);
      return;
    }

    setIsStreaming(true);
    setDisplayText('');

    let currentIndex = 0;
    const streamText = () => {
      if (currentIndex < contentToDisplay.length) {
        setDisplayText(prev => prev + contentToDisplay[currentIndex]);
        currentIndex++;
        streamingRef.current = setTimeout(streamText, isThinkingModel ? 30 : 50); // Faster for thinking models
      } else {
        setIsStreaming(false);
        // Start auto-collapse timer when thinking completes
        if (onAutoCollapse && !isThinking) {
          autoCollapseRef.current = setTimeout(() => {
            onAutoCollapse();
          }, autoCollapseDelay);
        }
      }
    };

    streamText();

    return () => {
      if (streamingRef.current) {
        clearTimeout(streamingRef.current);
      }
    };
  }, [thinkingText, isThinking, onAutoCollapse, autoCollapseDelay, userQuery, isThinkingModel]);

  // Auto-collapse when thinking stops
  useEffect(() => {
    if (!isThinking && displayText && onAutoCollapse) {
      autoCollapseRef.current = setTimeout(() => {
        onAutoCollapse();
      }, autoCollapseDelay);
    }

    return () => {
      if (autoCollapseRef.current) {
        clearTimeout(autoCollapseRef.current);
      }
    };
  }, [isThinking, displayText, onAutoCollapse, autoCollapseDelay]);



  // Clear timers on unmount
  useEffect(() => {
    return () => {
      if (streamingRef.current) clearTimeout(streamingRef.current);
      if (autoCollapseRef.current) clearTimeout(autoCollapseRef.current);
      if (durationRef.current) clearTimeout(durationRef.current);
    };
  }, []);

  if (!isVisible) return null;

  // For non-thinking models, show a compact loading indicator only
  if (!isThinkingModel) {
    return (
      <div className="px-6 mb-2 flex justify-center">
        <div className="bg-black/30 backdrop-blur-[8px] border border-gray-600/20 rounded-lg py-1.5 px-2.5 flex items-center justify-center max-w-xs">
          <div className="flex items-center text-gray-400">
            <div className="w-3.5 h-3.5 mr-1.5 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-full flex items-center justify-center">
              <Brain className="w-2 h-2 text-blue-400" />
            </div>
            <span className="text-xs mr-1.5">Processing</span>
            <div className="flex space-x-0.5">
              <div className="w-0.5 h-0.5 bg-blue-400 rounded-full animate-pulse" />
              <div className="w-0.5 h-0.5 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
              <div className="w-0.5 h-0.5 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // For thinking models, show the full collapsible container
  return (
    <div className="px-4 mb-4">
      <div className="bg-black/50 backdrop-blur-[8px] border border-gray-500/20 rounded-xl overflow-hidden shadow-lg">
        {/* Thinking Header */}
        <div
          className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-600/10 transition-all duration-200"
          onClick={onToggleCollapse}
        >
          <div className="flex items-center">
            <div className="w-6 h-6 mr-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-white">
                {isThinking ? 'AI Thinking' : 'Previous Analysis'}
              </span>
              <span className="text-xs text-gray-400">
                {isThinking ? 'Processing...' : 'Completed'}
              </span>
            </div>
            {isThinking && (
              <div className="ml-3 flex space-x-1">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
              </div>
            )}
          </div>
          <div className="text-gray-400 hover:text-gray-300 transition-colors">
            {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </div>
        </div>

        {/* Thinking Content - Only for thinking models */}
        {!isCollapsed && (
          <div className="px-3 pb-2 border-t border-gray-500/20">
            <div className="bg-black/40 backdrop-blur-sm rounded-lg p-3 mt-2 border border-gray-600/20">
              <div className="text-sm text-gray-200 font-mono leading-relaxed">
                {displayText && (
                  <div className="flex items-start space-x-3">
                    <span className="text-blue-400 mt-1 flex-shrink-0">•</span>
                    <div className="flex-1">
                      <span className="whitespace-pre-wrap break-words">{displayText}</span>
                      {isStreaming && (
                        <span className="ml-1 text-blue-400 animate-pulse font-bold">|</span>
                      )}
                    </div>
                  </div>
                )}
                {!displayText && isThinking && (
                  <div className="flex items-center justify-center text-gray-400 py-2">
                    <div className="w-4 h-4 mr-2 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-full flex items-center justify-center">
                      <Brain className="w-2.5 h-2.5 text-blue-400" />
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThinkingContainer;
