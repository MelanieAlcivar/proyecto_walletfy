import React from 'react';
import { ArrowUp, ArrowDown, Edit2, Trash2 } from 'lucide-react';
import { Tooltip } from 'react-tooltip';
import { Event } from '../types/event';
import { formatCurrency, formatDate } from '../utils/calculations';

interface EventCardProps {
  event: Event;
  onEdit: (event: Event) => void;
  onDelete: (id: string) => void;
  onClick: (event: Event) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onEdit, onDelete, onClick }) => {
  const isIngreso = event.tipo === 'ingreso';

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(event);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('¿Estás seguro de que quieres eliminar este evento?')) {
      onDelete(event.id);
    }
  };

  return (
    <>
      <div
        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => onClick(event)}
        data-tooltip-id={`event-tooltip-${event.id}`}
        data-tooltip-content={event.descripcion || 'Sin descripción'}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${
              isIngreso 
                ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400' 
                : 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400'
            }`}>
              {isIngreso ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">{event.nombre}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(event.fecha)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`font-bold ${
              isIngreso 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
            }`}>
              {isIngreso ? '+' : '-'}{formatCurrency(event.cantidad)}
            </span>
            <div className="flex gap-1">
              <button
                onClick={handleEdit}
                className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                aria-label="Editar evento"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleDelete}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                aria-label="Eliminar evento"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
      {event.descripcion && (
        <Tooltip
          id={`event-tooltip-${event.id}`}
          place="top"
          className="max-w-xs bg-gray-900 text-white text-xs rounded-md shadow-lg"
        />
      )}
    </>
  );
};

export default EventCard;