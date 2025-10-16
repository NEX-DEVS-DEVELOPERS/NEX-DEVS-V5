import React from 'react';
import { useTimeline } from '@/frontend/contexts/TimelineContext';

const TimelineSelector: React.FC = () => {
  const { timeline, setTimeline } = useTimeline();

  return (
    <div className="mb-6">
      <label htmlFor="timeline" className="block text-sm font-medium text-gray-200 mb-2">
        Project Timeline
      </label>
      <select
        id="timeline"
        value={timeline}
        onChange={(e) => {
          const value = e.target.value as 'urgent' | 'normal' | 'relaxed';
          setTimeline(value);
        }}
        className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        <option value="urgent">Urgent (1-2 weeks) (+20% charge)</option>
        <option value="normal">Normal (2-4 weeks)</option>
        <option value="relaxed">Relaxed (4+ weeks) (+5% discount)</option>
      </select>
    </div>
  );
};

export default TimelineSelector;

