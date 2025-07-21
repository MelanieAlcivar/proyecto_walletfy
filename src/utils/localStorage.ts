import { Event } from '../types/event';

const STORAGE_KEYS = {
  EVENTS: 'walletfy-events',
  BALANCE_INICIAL: 'walletfy-balance-inicial',
};

export const saveToLocalStorage = (events: Event[], balanceInicial: number): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    localStorage.setItem(STORAGE_KEYS.BALANCE_INICIAL, JSON.stringify(balanceInicial));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const loadFromLocalStorage = (): { events: Event[]; balanceInicial: number } => {
  try {
    const eventsData = localStorage.getItem(STORAGE_KEYS.EVENTS);
    const balanceData = localStorage.getItem(STORAGE_KEYS.BALANCE_INICIAL);
    
    const events = eventsData ? JSON.parse(eventsData).map((event: any) => ({
      ...event,
      fecha: new Date(event.fecha),
    })) : [];
    
    const balanceInicial = balanceData ? JSON.parse(balanceData) : 0;
    
    return { events, balanceInicial };
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return { events: [], balanceInicial: 0 };
  }
};