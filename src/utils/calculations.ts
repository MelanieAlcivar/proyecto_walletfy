import moment from 'moment';
import { Event, MonthGroup } from '../types/event';

export const groupEventsByMonth = (events: Event[], balanceInicial: number): MonthGroup[] => {
  // Group events by month-year
  const grouped = events.reduce((acc, event) => {
    const monthYear = moment(event.fecha).format('YYYY-MM');
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(event);
    return acc;
  }, {} as Record<string, Event[]>);

  // Sort by month-year
  const sortedKeys = Object.keys(grouped).sort();
  
  let previousBalanceGlobal = balanceInicial;
  
  return sortedKeys.map(monthYear => {
    const monthEvents = grouped[monthYear];
    const totalIngresos = monthEvents
      .filter(event => event.tipo === 'ingreso')
      .reduce((sum, event) => sum + event.cantidad, 0);
    
    const totalEgresos = monthEvents
      .filter(event => event.tipo === 'egreso')
      .reduce((sum, event) => sum + event.cantidad, 0);
    
    const balance = totalIngresos - totalEgresos;
    const balanceGlobal = previousBalanceGlobal + balance;
    
    previousBalanceGlobal = balanceGlobal;
    
    const date = moment(monthYear, 'YYYY-MM');
    
    return {
      month: date.format('MMMM'),
      year: date.year(),
      events: monthEvents.sort((a, b) => moment(a.fecha).valueOf() - moment(b.fecha).valueOf()),
      totalIngresos,
      totalEgresos,
      balance,
      balanceGlobal,
    };
  });
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatDate = (date: Date): string => {
  return moment(date).format('DD/MM/YYYY');
};