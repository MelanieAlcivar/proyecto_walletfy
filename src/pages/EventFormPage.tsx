import React from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { addEvent, updateEvent, setCurrentEvent, saveEvents } from '../store/slices/eventsSlice';
import { Event } from '../types/event';
import EventForm from '../components/EventForm';

interface EventFormPageProps {
  onSuccess: () => void;
}

const EventFormPage: React.FC<EventFormPageProps> = ({ onSuccess }) => {
  const dispatch = useAppDispatch();
  const currentEvent = useAppSelector(state => state.events.currentEvent);

  const handleSubmit = async (event: Event) => {
    if (currentEvent) {
      dispatch(updateEvent(event));
    } else {
      dispatch(addEvent(event));
    }
    
    await dispatch(saveEvents());
    dispatch(setCurrentEvent(null));
    onSuccess();
  };

  const handleCancel = () => {
    dispatch(setCurrentEvent(null));
    onSuccess();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <EventForm
        initialEvent={currentEvent}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default EventFormPage;