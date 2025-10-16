'use client';

import React, { createContext, useContext, useState } from 'react';

type Timeline = 'urgent' | 'normal' | 'relaxed';

interface TimelineContextType {
  timeline: Timeline;
  setTimeline: (timeline: Timeline) => void;
  getTimelineMultiplier: () => number;
}

const TimelineContext = createContext<TimelineContextType | undefined>(undefined);

export const TimelineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [timeline, setTimeline] = useState<Timeline>('normal');

  const getTimelineMultiplier = () => {
    switch (timeline) {
      case 'urgent':
        return 1.2; // +20% charge
      case 'relaxed':
        return 0.95; // -5% discount
      default:
        return 1; // normal price
    }
  };

  return (
    <TimelineContext.Provider value={{ timeline, setTimeline, getTimelineMultiplier }}>
      {children}
    </TimelineContext.Provider>
  );
};

export const useTimeline = () => {
  const context = useContext(TimelineContext);
  if (context === undefined) {
    throw new Error('useTimeline must be used within a TimelineProvider');
  }
  return context;
};
