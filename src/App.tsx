import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { useAppDispatch, useAppSelector } from './hooks/redux';
import { loadEvents, setCurrentEvent } from './store/slices/eventsSlice';
import { Event } from './types/event';
import Layout from './components/Layout';
import BalanceFlow from './pages/BalanceFlow';
import EventFormPage from './pages/EventFormPage';

type AppView = 'balance' | 'form';

const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const [currentView, setCurrentView] = useState<AppView>('balance');

  useEffect(() => {
    dispatch(loadEvents());
  }, [dispatch]);

  const handleCreateEvent = () => {
    dispatch(setCurrentEvent(null));
    setCurrentView('form');
  };

  const handleEditEvent = (event: Event) => {
    dispatch(setCurrentEvent(event));
    setCurrentView('form');
  };

  const handleFormSuccess = () => {
    setCurrentView('balance');
  };

  return (
    <Layout>
      {currentView === 'balance' ? (
        <BalanceFlow
          onCreateEvent={handleCreateEvent}
          onEditEvent={handleEditEvent}
        />
      ) : (
        <EventFormPage onSuccess={handleFormSuccess} />
      )}
    </Layout>
  );
};

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;