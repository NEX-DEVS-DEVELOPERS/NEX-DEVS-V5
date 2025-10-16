'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Import NexiousChatbot dynamically with SSR disabled but with better loading handling
const NexiousChatbot = dynamic(() => import('@/frontend/components/NexiousChatbot'), {
  ssr: false,
  loading: () => null
});

export default function ChatbotClientWrapper() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [chatbotReady, setChatbotReady] = useState(false);

  // Pre-initialize chatbot settings to avoid delays
  useEffect(() => {
    const preInitializeChatbot = async () => {
      try {
        // Pre-warm the chatbot settings API to avoid delays
        const timestamp = Date.now();
        const response = await fetch(`/api/chatbot/settings/public?t=${timestamp}`, {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'X-Requested-With': 'fetch'
          }
        });

        if (response.ok) {
          const data = await response.json();
          // Cache the settings immediately for instant access
          localStorage.setItem('nexious-chatbot-settings', JSON.stringify({
            enabled: data.enabled,
            timestamp: Date.now()
          }));
          console.log('Chatbot settings pre-loaded:', data.enabled ? 'Enabled' : 'Disabled');
        }
      } catch (error) {
        console.error('Error pre-initializing chatbot:', error);
      } finally {
        setChatbotReady(true);
      }
    };

    // Start pre-initialization immediately
    preInitializeChatbot();
  }, []);

  // Add global animation classes and ensure chatbot container is ready
  useEffect(() => {
    // Create style element for global chatbot animations
    const style = document.createElement('style');
    style.textContent = `
      .nexious-button-enter {
        transform: translateY(0);
        opacity: 1;
        transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.5s ease;
      }
      .nexious-button-exit {
        transform: translateY(20px);
        opacity: 0;
        transition: transform 0.3s cubic-bezier(0.36, 0, 0.66, -0.56), opacity 0.3s ease;
      }
      .nexious-chat-container {
        perspective: 1000px;
        transform-style: preserve-3d;
      }

      /* Ensure chatbot container does not capture events globally */
      .nexious-chat-container {
        position: fixed !important;
        bottom: 20px !important;
        right: 24px !important;
        z-index: 999999 !important;
        pointer-events: none !important; /* container is transparent to touches */
      }

      /* Only allow events on the chat button and open chat window */
      .nexious-chat-container .nexious-chat-button,
      .nexious-chat-container #chat-window,
      .nexious-chat-container .chatbot-sidebar,
      .nexious-chat-container .pro-features-popup,
      .nexious-chat-container .pro-maintenance-popup {
        pointer-events: auto !important;
      }
    `;
    document.head.appendChild(style);

    // Ensure the chatbot container is properly positioned
    const ensureChatbotContainer = () => {
      const container = document.getElementById('nexious-chat-container');
      if (container) {
        container.style.position = 'fixed';
        container.style.bottom = '20px';
        container.style.right = '24px';
        container.style.zIndex = '999999';
        container.style.pointerEvents = 'auto';
      }
    };

    // Set up container immediately and on DOM changes
    ensureChatbotContainer();
    const observer = new MutationObserver(ensureChatbotContainer);
    observer.observe(document.body, { childList: true, subtree: true });

    setIsInitialized(true);

    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
      observer.disconnect();
    };
  }, []);

  // Don't render until both initialization and chatbot settings are ready
  if (!isInitialized || !chatbotReady) {
    return null;
  }

  return (
    <div className="fixed-bottom-right nexious-chat-container" id="nexious-chat-container">
      <NexiousChatbot />
    </div>
  );
}