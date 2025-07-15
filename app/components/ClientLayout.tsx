"use client";

import dynamic from 'next/dynamic';
import BarbaInitializer from './BarbaInitializer';
import ChatbotClientWrapper from './ChatbotClientWrapper';

// Dynamic imports for better client-side code splitting
const Footer = dynamic(() => import("@/components/layout/Footer"), {
  loading: () => <div className="h-20 bg-black" />
});

interface ClientLayoutProps {
  children: React.ReactNode;
}

/**
 * Client-side layout wrapper that contains client components
 * This separates client from server components properly
 */
export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <>
      <div className="flex-1 gpu-accelerated overflow-visible" 
           style={{ contain: 'paint style' }} 
           data-page-content="true">
        {children}
      </div>
      <Footer />
      <ChatbotClientWrapper />
      <BarbaInitializer />
    </>
  );
} 