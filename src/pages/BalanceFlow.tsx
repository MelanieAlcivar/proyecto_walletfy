import React, { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { deleteEvent, setCurrentEvent, saveEvents } from '../store/slices/eventsSlice';
import { groupEventsByMonth } from '../utils/calculations';
import { Event } from '../types/event';
import BalanceInput from '../components/BalanceInput';
import MonthCard from '../components/MonthCard';
import MonthSearch from '../components/MonthSearch';
import EventModal from '../components/EventModal';

interface BalanceFlowProps {
  onCreateEvent: () => void;
  onEditEvent: (event: Event) => void;
}

const BalanceFlow: React.FC<BalanceFlowProps> = ({ onCreateEvent, onEditEvent }) => {
  const dispatch = useAppDispatch();
  const { events, balanceInicial } = useAppSelector(state => state.events);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const monthGroups = useMemo(() => {
    const groups = groupEventsByMonth(events, balanceInicial);
    
    if (!searchQuery) return groups;
    
    const query = searchQuery.toLowerCase();
    return groups.filter(group => {
      const monthYear = `${group.month} ${group.year}`.toLowerCase();
      return monthYear.includes(query) || 
             group.month.toLowerCase().includes(query) ||
             group.year.toString().includes(query);
    });
  }, [events, balanceInicial, searchQuery]);

  const handleDeleteEvent = async (id: string) => {
    dispatch(deleteEvent(id));
    await dispatch(saveEvents());
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedEvent(null);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <BalanceInput />
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Flujo de Balance
        </h2>
        <button
          onClick={onCreateEvent}
          className="inline-flex items-center px-4 py-2 bg-emerald-700 text-white rounded-md hover:bg-emerald-600 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Crear Evento
        </button>
      </div>

      <MonthSearch onSearch={setSearchQuery} />

      {monthGroups.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            {searchQuery ? 'No se encontraron meses que coincidan con tu búsqueda.' : 'No hay eventos registrados aún.'}
          </p>
          {/*
          {!searchQuery && (
            <button
              onClick={onCreateEvent}
              className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Crear tu primer evento
            </button>
          )}

          */}
        </div>
      ) : (
        <div className="space-y-4">
          {monthGroups.map((monthData, index) => (
            <MonthCard
              key={`${monthData.month}-${monthData.year}`}
              monthData={monthData}
              onEditEvent={onEditEvent}
              onDeleteEvent={handleDeleteEvent}
              onEventClick={handleEventClick}
            />
          ))}
        </div>
      )}

      <EventModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
};

export default BalanceFlow;