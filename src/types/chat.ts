export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  isModelReady: boolean;
  error: string | null;
}

export interface LLMConfig {
  temperature: number;
  topP: number;
  maxTokens: number;
  model: string;
}

export interface WalletfyContext {
  balanceInicial: number;
  totalEvents: number;
  totalIngresos: number;
  totalEgresos: number;
  balanceActual: number;
  monthlyData: Array<{
    month: string;
    year: number;
    ingresos: number;
    egresos: number;
    balance: number;
    balanceGlobal: number;
    eventCount: number;
  }>;
  recentEvents: Array<{
    nombre: string;
    tipo: 'ingreso' | 'egreso';
    cantidad: number;
    fecha: string;
    descripcion?: string;
  }>;
  insights: {
    avgMonthlyIncome: number;
    avgMonthlyExpense: number;
    highestIncomeMonth: string;
    highestExpenseMonth: string;
    savingsRate: number;
  };
}