'use client';

import dynamic from 'next/dynamic';
import { useEffect } from 'react';

// Import NexiousChatbot dynamically with SSR disabled
const NexiousChatbot = dynamic(() => import('@/components/NexiousChatbot'), {
  ssr: false,
  loading: () => null
});

export default function ChatbotClientWrapper() {
  // Add global animation classes
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
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="fixed-bottom-right nexious-chat-container" id="nexious-chat-container">
      <NexiousChatbot />
    </div>
  );
} 