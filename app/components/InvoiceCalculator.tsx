import React from 'react';
import { useTimeline } from '../contexts/TimelineContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { formatPrice } from '../utils/pricing';

interface InvoiceCalculatorProps {
  basePrice: number;
}

const InvoiceCalculator: React.FC<InvoiceCalculatorProps> = ({ basePrice }) => {
  const { timeline, getTimelineMultiplier } = useTimeline();
  const { currency, isPakistan } = useCurrency();

  const timelineMultiplier = getTimelineMultiplier();
  const adjustedPrice = basePrice * timelineMultiplier;
  const difference = adjustedPrice - basePrice;

  return (
    <div className="space-y-2 text-gray-200">
      <div className="flex justify-between">
        <span>Base Price:</span>
        <span>{formatPrice(basePrice, currency, isPakistan)}</span>
      </div>
      {timeline !== 'normal' && (
        <div className="flex justify-between text-sm">
          <span>{timeline === 'urgent' ? 'Urgency Charge' : 'Timeline Discount'}:</span>
          <span className={timeline === 'urgent' ? 'text-red-400' : 'text-green-400'}>
            {timeline === 'urgent' ? '+' : '-'}{formatPrice(Math.abs(difference), currency, isPakistan)}
          </span>
        </div>
      )}
      <div className="flex justify-between font-semibold border-t border-gray-700 pt-2 mt-2">
        <span>Total:</span>
        <span>{formatPrice(adjustedPrice, currency, isPakistan)}</span>
      </div>
    </div>
  );
};

export default InvoiceCalculator;
