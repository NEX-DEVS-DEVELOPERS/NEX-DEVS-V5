'use client';

import dynamic from 'next/dynamic';

// Import NexiousChatbot dynamically with SSR disabled
const NexiousChatbot = dynamic(() => import('@/components/NexiousChatbot'), {
  ssr: false,
  loading: () => null
});

export default function ChatbotClientWrapper() {
  return (
    <div className="fixed-bottom-right float" id="nexious-chat-container">
      <NexiousChatbot />
    </div>
  );
} 