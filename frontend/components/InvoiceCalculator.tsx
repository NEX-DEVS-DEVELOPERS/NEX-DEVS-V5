import React from 'react';
import { useTimeline } from '@/frontend/contexts/TimelineContext';
import { useCurrency } from '@/frontend/contexts/CurrencyContext';
import { formatPrice } from '@/frontend/utils/pricing';

interface InvoiceCalculatorProps {
  basePrice: number;
}

const InvoiceCalculator: React.FC<InvoiceCalculatorProps> = ({ basePrice }) => {
  const { timeline, getTimelineMultiplier } = useTimeline();
  const { currency } = useCurrency(); // Removed isPakistan since it doesn't exist

  const timelineMultiplier = getTimelineMultiplier();
  const adjustedPrice = basePrice * timelineMultiplier;
  const difference = adjustedPrice - basePrice;

  return (
    <div className="space-y-2 text-gray-200">
      <div className="flex justify-between">
        <span>Base Price:</span>
        <span>{formatPrice(basePrice, currency)}</span>
      </div>
      {timeline !== 'normal' && (
        <div className="flex justify-between text-sm">
          <span>{timeline === 'urgent' ? 'Urgency Charge' : 'Timeline Discount'}:</span>
          <span className={timeline === 'urgent' ? 'text-red-400' : 'text-green-400'}>
            {timeline === 'urgent' ? '+' : '-'}{formatPrice(Math.abs(difference), currency)}
          </span>
        </div>
      )}
      <div className="flex justify-between">
        <span>Total:</span>
        <span>{formatPrice(adjustedPrice, currency)}</span>
      </div>
    </div>
  );
};

export default InvoiceCalculator;
