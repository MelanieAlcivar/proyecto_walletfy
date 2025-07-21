import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { MonthGroup, Event } from '../types/event';
import { formatCurrency } from '../utils/calculations';
import EventCard from './EventCard';

interface MonthCardProps {
  monthData: MonthGroup;
  onEditEvent: (event: Event) => void;
  onDeleteEvent: (id: string) => void;
  onEventClick: (event: Event) => void;
}

const MonthCard: React.FC<MonthCardProps> = ({ 
  monthData, 
  onEditEvent, 
  onDeleteEvent,
  onEventClick 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div
        className="p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {monthData.month} {monthData.year}
            </h3>
            <div className="mt-2 space-y-1">
              <p className="text-sm text-green-600 dark:text-green-400">
                Ingresos: {formatCurrency(monthData.totalIngresos)}
              </p>
              <p className="text-sm text-red-600 dark:text-red-400">
                Egresos: {formatCurrency(monthData.totalEgresos)}
              </p>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Balance del mes: {formatCurrency(monthData.balance)}
              </p>
              <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                Balance Global: {formatCurrency(monthData.balanceGlobal)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {monthData.events.length} evento{monthData.events.length !== 1 ? 's' : ''}
            </span>
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </div>
      </div>
      
      {isExpanded && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-6">
          <div className="space-y-3">
            {monthData.events.map(event => (
              <EventCard
                key={event.id}
                event={event}
                onEdit={onEditEvent}
                onDelete={onDeleteEvent}
                onClick={onEventClick}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthCard;