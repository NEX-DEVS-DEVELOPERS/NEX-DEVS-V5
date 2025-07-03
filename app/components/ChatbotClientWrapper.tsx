'use client';

import dynamic from 'next/dynamic';

// Import NexiousChatbot dynamically with SSR disabled
const NexiousChatbot = dynamic(() => import('@/components/NexiousChatbot'), {
  ssr: false,
});

export default function ChatbotClientWrapper() {
  return <NexiousChatbot />;
} 