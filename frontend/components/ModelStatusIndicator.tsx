import React, { useState, useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import {
  getModelSettings,
  extractModelFirstName,
  getEffectiveModelSettings,
  getPerformanceMetrics,
  isProModeUnderMaintenance,
  getFallbackModelsByPriority
} from '@/backend/utils/nexiousAISettings';

interface ModelStatusIndicatorProps {
  currentModel: string;
  isLoading: boolean;
  isSwitching: boolean;
  isProMode: boolean;
  isMobile: boolean;
  isThinking?: boolean;
  thinkingText?: string;
  className?: string;
}

interface AnimationRefs {
  container: React.RefObject<HTMLDivElement>;
  textContainer: React.RefObject<HTMLSpanElement>;
  statusDot: React.RefObject<HTMLDivElement>;
  pulseRing: React.RefObject<HTMLDivElement>;
  thinkingDots: React.RefObject<HTMLDivElement>;
}

const ModelStatusIndicator: React.FC<ModelStatusIndicatorProps> = ({
  currentModel,
  isLoading,
  isSwitching,
  isProMode,
  isMobile,
  isThinking = false,
  thinkingText = '',
  className = ''
}) => {
  // Animation refs for GSAP
  const refs: AnimationRefs = {
    container: useRef<HTMLDivElement>(null),
    textContainer: useRef<HTMLSpanElement>(null),
    statusDot: useRef<HTMLDivElement>(null),
    pulseRing: useRef<HTMLDivElement>(null),
    thinkingDots: useRef<HTMLDivElement>(null)
  };

  // State management
  const [displayName, setDisplayName] = useState('');
  const [actualModel, setActualModel] = useState('');
  const [modelPerformance, setModelPerformance] = useState<any>(null);
  const [animationTimeline, setAnimationTimeline] = useState<gsap.core.Timeline | null>(null);

  // Get real-time model information from nexiousAISettings.ts
  const getRealTimeModelInfo = useCallback(() => {
    try {
      // Get the actual model being used based on mode
      const effectiveSettings = getEffectiveModelSettings(isProMode);
      const actualModelId = effectiveSettings.model;

      // Get performance metrics for this model
      const performanceMetrics = getPerformanceMetrics();
      const modelPerf = performanceMetrics.modelPerformance[actualModelId];

      // Check if Pro Mode is under maintenance
      const isMaintenanceMode = isProMode && isProModeUnderMaintenance();

      // Get fallback models if needed
      const fallbackModels = getFallbackModelsByPriority();

      return {
        actualModel: actualModelId,
        displayName: getCleanModelName(actualModelId),
        performance: modelPerf,
        isMaintenanceMode,
        fallbackModels,
        settings: effectiveSettings
      };
    } catch (error) {
      console.error('Error getting real-time model info:', error);
      return {
        actualModel: currentModel || 'unknown',
        displayName: 'AI Assistant',
        performance: null,
        isMaintenanceMode: false,
        fallbackModels: [],
        settings: null
      };
    }
  }, [isProMode, currentModel]);

  // Clean model name without dummy labels
  const getCleanModelName = (modelId: string): string => {
    // Professional model name mappings - no "Free" labels
    const professionalMappings: Record<string, string> = {
      'qwen/qwen3-235b-a22b-2507:free': 'Qwen3 235B',
      'qwen/qwen3-235b-a22b:free': 'Qwen3 235B',
      'qwen/qwen3-32b:free': 'Qwen3 32B',
      'deepseek/deepseek-r1-0528:free': 'DeepSeek R1',
      'deepseek/deepseek-r1-0528': 'DeepSeek R1',
      'deepseek/deepseek-chat-v3-0324:free': 'DeepSeek Chat V3',
      'deepseek/deepseek-chat-v3-0324': 'DeepSeek Chat V3',
      'meta-llama/llama-3.1-8b-instruct': 'Llama 3.1 8B',
      'meta-llama/llama-3.1-70b-instruct': 'Llama 3.1 70B',
      'mistralai/mistral-small': 'Mistral Small',
      'anthropic/claude-3-haiku': 'Claude 3 Haiku',
      'anthropic/claude-3.5-sonnet': 'Claude 3.5 Sonnet',
      'openai/gpt-4o-mini': 'GPT-4o Mini',
      'openai/gpt-4o': 'GPT-4o'
    };

    // Check for exact match
    if (professionalMappings[modelId]) {
      return professionalMappings[modelId];
    }

    // Use extractModelFirstName as fallback
    return extractModelFirstName(modelId) || 'AI Assistant';
  };

  // Professional model switching animation
  const triggerModelSwitchAnimation = useCallback((newDisplayName: string, newModel: string) => {
    if (!refs.textContainer.current) {
      setDisplayName(newDisplayName);
      setActualModel(newModel);
      return;
    }

    // Smooth professional transition
    const timeline = gsap.timeline({
      onComplete: () => setAnimationTimeline(null)
    });

    timeline
      .to(refs.textContainer.current, {
        opacity: 0.4,
        y: -2,
        duration: 0.15,
        ease: "power2.out"
      })
      .call(() => {
        setDisplayName(newDisplayName);
        setActualModel(newModel);
      })
      .to(refs.textContainer.current, {
        opacity: 1,
        y: 0,
        duration: 0.25,
        ease: "power2.out"
      });

    setAnimationTimeline(timeline);
  }, [refs]);

  // Update model information in real-time
  useEffect(() => {
    const updateModelInfo = () => {
      const modelInfo = getRealTimeModelInfo();

      // Update performance metrics
      setModelPerformance(modelInfo.performance);

      // Check if model actually changed
      if (actualModel !== modelInfo.actualModel) {
        triggerModelSwitchAnimation(modelInfo.displayName, modelInfo.actualModel);
      } else if (displayName !== modelInfo.displayName) {
        setDisplayName(modelInfo.displayName);
      }
    };

    updateModelInfo();

    // Update every 5 seconds to get real-time data
    const interval = setInterval(updateModelInfo, 5000);

    return () => clearInterval(interval);
  }, [actualModel, displayName, getRealTimeModelInfo, triggerModelSwitchAnimation]);

  // Professional container animations
  useEffect(() => {
    if (!refs.container.current) return;

    if (isSwitching) {
      // Subtle glow effect for switching
      gsap.to(refs.container.current, {
        boxShadow: "0 0 20px rgba(147, 51, 234, 0.3), 0 4px 16px rgba(0, 0, 0, 0.15)",
        duration: 0.8,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1
      });
    } else {
      gsap.killTweensOf(refs.container.current);
      gsap.to(refs.container.current, {
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
        duration: 0.4,
        ease: "power2.out"
      });
    }

    return () => gsap.killTweensOf(refs.container.current);
  }, [isSwitching, refs]);

  // Status dot animation with pulse ring
  useEffect(() => {
    if (!refs.statusDot.current || !refs.pulseRing.current) return;

    if (isLoading || isSwitching || isThinking) {
      // Dot pulsing
      gsap.to(refs.statusDot.current, {
        scale: 1.15,
        duration: 1.2,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1
      });

      // Pulse ring animation
      gsap.fromTo(refs.pulseRing.current,
        { scale: 1, opacity: 0.6 },
        {
          scale: 1.8,
          opacity: 0,
          duration: 2,
          ease: "power2.out",
          repeat: -1
        }
      );
    } else {
      gsap.killTweensOf([refs.statusDot.current, refs.pulseRing.current]);
      gsap.to(refs.statusDot.current, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      });
      gsap.set(refs.pulseRing.current, { scale: 1, opacity: 0 });
    }

    return () => gsap.killTweensOf([refs.statusDot.current, refs.pulseRing.current]);
  }, [isLoading, isSwitching, isThinking, refs]);

  // Thinking dots animation
  useEffect(() => {
    if (!refs.thinkingDots.current || !isThinking) return;

    const dots = refs.thinkingDots.current.children;
    if (dots.length === 0) return;

    // Smooth wave animation for thinking dots
    gsap.fromTo(dots,
      { y: 0, opacity: 0.5 },
      {
        y: -3,
        opacity: 1,
        duration: 0.6,
        ease: "power2.inOut",
        stagger: 0.1,
        repeat: -1,
        yoyo: true
      }
    );

    return () => gsap.killTweensOf(dots);
  }, [isThinking, refs]);

  // Cleanup animations on unmount
  useEffect(() => {
    return () => {
      if (animationTimeline) {
        animationTimeline.kill();
      }
      Object.values(refs).forEach(ref => {
        if (ref.current) {
          gsap.killTweensOf(ref.current);
        }
      });
    };
  }, [animationTimeline, refs]);

  // Professional status colors
  const getStatusColor = () => {
    if (isSwitching) return 'text-amber-400';
    if (isThinking) return 'text-purple-400';
    if (isLoading) return 'text-blue-400';
    return 'text-gray-100';
  };

  // Clean status text showing actual model
  const getStatusText = () => {
    if (isSwitching) return `Switching to ${displayName}`;
    if (isThinking) {
      const cleanThinkingStates: Record<string, string> = {
        'thinking': 'Processing',
        'Thinking...': 'Processing',
        'Looking for content...': 'Analyzing',
        'Analyzing content...': 'Computing',
        'searching for details...': 'Searching'
      };
      return cleanThinkingStates[thinkingText] || 'Processing';
    }
    if (isLoading) return 'Responding';
    return displayName;
  };

  // Status dot colors
  const getDotColor = () => {
    if (isSwitching) return 'bg-amber-400';
    if (isThinking) return 'bg-purple-500';
    if (isLoading) return 'bg-blue-500';
    return 'bg-emerald-500';
  };

  // Performance indicator
  const getPerformanceIndicator = () => {
    if (!modelPerformance) return null;

    const successRate = modelPerformance.successRate * 100;
    const avgResponseTime = modelPerformance.averageResponseTime;

    if (successRate >= 95 && avgResponseTime < 3000) return '🟢';
    if (successRate >= 85 && avgResponseTime < 5000) return '🟡';
    return '🔴';
  };



  return (
    <div
      ref={refs.container}
      className={`relative flex items-center gap-3 px-4 py-2.5 border border-gray-600/30 rounded-xl transition-all duration-300 hover:border-gray-500/40 ${className}`}
      style={{
        fontSize: isMobile ? '11px' : '12px',
        minHeight: isMobile ? '32px' : '36px',
        background: 'linear-gradient(135deg, rgba(15, 15, 25, 0.95) 0%, rgba(20, 20, 30, 0.95) 100%)',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        transform: 'translateZ(0)',
        willChange: 'transform'
      }}
    >
      {/* Professional Status Indicator */}
      <div className="relative flex items-center">
        {/* Main Status Dot */}
        <div
          ref={refs.statusDot}
          className={`w-2.5 h-2.5 rounded-full ${getDotColor()} transition-all duration-300`}
          style={{
            boxShadow: isLoading || isSwitching || isThinking
              ? '0 0 12px rgba(147, 51, 234, 0.6)'
              : '0 2px 4px rgba(0, 0, 0, 0.3)'
          }}
        />

        {/* Pulse Ring for Active States */}
        <div
          ref={refs.pulseRing}
          className={`absolute inset-0 w-2.5 h-2.5 rounded-full border-2 ${
            isLoading || isSwitching || isThinking
              ? 'border-purple-400/40'
              : 'border-transparent'
          }`}
          style={{ opacity: 0 }}
        />
      </div>

      {/* Model Name Display */}
      <div className="flex items-center gap-2">
        <span
          ref={refs.textContainer}
          className={`font-medium transition-colors duration-200 ${getStatusColor()}`}
          style={{
            fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
            letterSpacing: '-0.01em',
            fontSize: isMobile ? '11px' : '12px'
          }}
        >
          {getStatusText()}
        </span>

        {/* Performance Indicator */}
        {modelPerformance && !isLoading && !isSwitching && !isThinking && (
          <span className="text-xs opacity-60">
            {getPerformanceIndicator()}
          </span>
        )}
      </div>

      {/* Pro Mode Badge */}
      {isProMode && !isSwitching && !isThinking && (
        <div className="flex items-center">
          <div className="w-px h-3 bg-gradient-to-b from-purple-400/60 to-purple-600/60 mx-2" />
          <div className="bg-gradient-to-r from-purple-500/15 to-purple-600/15 px-1.5 py-0.5 rounded border border-purple-500/25">
            <span className="text-xs font-semibold text-purple-300 tracking-wide">
              PRO
            </span>
          </div>
        </div>
      )}

      {/* Switching Indicator */}
      {isSwitching && (
        <div className="flex items-center ml-2">
          <div className="w-3 h-3 border-2 border-amber-400/40 border-t-amber-400 rounded-full animate-spin"
               style={{ animationDuration: '1s' }} />
        </div>
      )}

      {/* Thinking Dots */}
      {isThinking && !isSwitching && (
        <div className="flex items-center ml-2">
          <div ref={refs.thinkingDots} className="flex space-x-1">
            <div className="w-1 h-1 bg-purple-400 rounded-full" />
            <div className="w-1 h-1 bg-purple-400 rounded-full" />
            <div className="w-1 h-1 bg-purple-400 rounded-full" />
          </div>
        </div>
      )}

      {/* Real-time Model Info Tooltip */}
      {actualModel && !isMobile && (
        <div className="absolute -top-8 left-0 bg-gray-900/95 text-xs text-gray-300 px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
          {actualModel}
          {modelPerformance && (
            <span className="ml-2 text-green-400">
              {Math.round(modelPerformance.successRate * 100)}% • {Math.round(modelPerformance.averageResponseTime)}ms
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ModelStatusIndicator;
