import { Event, MonthGroup } from '../types/event';
import { WalletfyContext } from '../types/chat';
import { groupEventsByMonth } from './calculations';

export const buildWalletfyContext = (
  events: Event[], 
  balanceInicial: number
): WalletfyContext => {
  const monthGroups = groupEventsByMonth(events, balanceInicial);
  
  const totalIngresos = events
    .filter(e => e.tipo === 'ingreso')
    .reduce((sum, e) => sum + e.cantidad, 0);
  
  const totalEgresos = events
    .filter(e => e.tipo === 'egreso')
    .reduce((sum, e) => sum + e.cantidad, 0);
  
  const balanceActual = balanceInicial + totalIngresos - totalEgresos;
  
  // Calcular insights
  const avgMonthlyIncome = monthGroups.length > 0 
    ? monthGroups.reduce((sum, m) => sum + m.totalIngresos, 0) / monthGroups.length 
    : 0;
  
  const avgMonthlyExpense = monthGroups.length > 0 
    ? monthGroups.reduce((sum, m) => sum + m.totalEgresos, 0) / monthGroups.length 
    : 0;
  
  const highestIncomeMonth = monthGroups.length > 0 
    ? monthGroups.reduce((max, current) => 
        current.totalIngresos > max.totalIngresos ? current : max
      )
    : null;
  
  const highestExpenseMonth = monthGroups.length > 0 
    ? monthGroups.reduce((max, current) => 
        current.totalEgresos > max.totalEgresos ? current : max
      )
    : null;
  
  const savingsRate = totalIngresos > 0 
    ? ((totalIngresos - totalEgresos) / totalIngresos) * 100 
    : 0;
  
  // Eventos recientes (últimos 5)
  const recentEvents = events
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    .slice(0, 5)
    .map(event => ({
      nombre: event.nombre,
      tipo: event.tipo,
      cantidad: event.cantidad,
      fecha: new Date(event.fecha).toLocaleDateString('es-ES'),
      descripcion: event.descripcion,
    }));

  return {
    balanceInicial,
    totalEvents: events.length,
    totalIngresos,
    totalEgresos,
    balanceActual,
    monthlyData: monthGroups.map(group => ({
      month: group.month,
      year: group.year,
      ingresos: group.totalIngresos,
      egresos: group.totalEgresos,
      balance: group.balance,
      balanceGlobal: group.balanceGlobal,
      eventCount: group.events.length,
    })),
    recentEvents,
    insights: {
      avgMonthlyIncome,
      avgMonthlyExpense,
      highestIncomeMonth: highestIncomeMonth 
        ? `${highestIncomeMonth.month} ${highestIncomeMonth.year}` 
        : 'N/A',
      highestExpenseMonth: highestExpenseMonth 
        ? `${highestExpenseMonth.month} ${highestExpenseMonth.year}` 
        : 'N/A',
      savingsRate,
    },
  };
};