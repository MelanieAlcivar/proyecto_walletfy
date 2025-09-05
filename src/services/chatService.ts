import { ChatMessage, LLMConfig, WalletfyContext } from '../types/chat';
import { v4 as uuidv4 } from 'uuid';

class ChatService {
  private isInitialized = false;

  async initialize(): Promise<void> {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simular carga
      this.isInitialized = true;
    } catch (error) {
      throw new Error('Error inicializando el modelo de chat');
    }
  }

  private generateSystemPrompt(context: WalletfyContext): string {
    return `Eres un asistente financiero inteligente especializado en Walletfy, una aplicación de gestión de billetera personal.

CONTEXTO ACTUAL DEL USUARIO:
- Balance inicial: $${context.balanceInicial.toFixed(2)}
- Balance actual: $${context.balanceActual.toFixed(2)}
- Total de eventos registrados: ${context.totalEvents}
- Total ingresos: $${context.totalIngresos.toFixed(2)}
- Total egresos: $${context.totalEgresos.toFixed(2)}
- Tasa de ahorro: ${context.insights.savingsRate.toFixed(1)}%
- Ingreso promedio mensual: $${context.insights.avgMonthlyIncome.toFixed(2)}
- Gasto promedio mensual: $${context.insights.avgMonthlyExpense.toFixed(2)}

DATOS MENSUALES:
${context.monthlyData.map(month => 
  `${month.month} ${month.year}: Ingresos $${month.ingresos.toFixed(2)}, Egresos $${month.egresos.toFixed(2)}, Balance $${month.balance.toFixed(2)}`
).join('\n')}

EVENTOS RECIENTES:
${context.recentEvents.map(event => 
  `${event.nombre} (${event.tipo}): $${event.cantidad.toFixed(2)} - ${event.fecha}${event.descripcion ? ` - ${event.descripcion}` : ''}`
).join('\n')}

INSTRUCCIONES:
1. Responde siempre en español de manera amigable y profesional
2. Usa los datos del contexto para dar respuestas precisas y personalizadas
3. Ofrece insights financieros útiles basados en los patrones de gasto e ingreso
4. Sugiere mejoras en la gestión financiera cuando sea apropiado
5. Mantén las respuestas concisas pero informativas
6. Si no tienes suficiente información, pide aclaraciones específicas
7. Usa emojis ocasionalmente para hacer la conversación más amigable
8. Formatea números monetarios con el símbolo $ y dos decimales

Recuerda: Tu objetivo es ayudar al usuario a entender mejor sus finanzas y tomar decisiones informadas.`;
  }

  async sendMessage(
    message: string, 
    context: WalletfyContext, 
    config: LLMConfig
  ): Promise<ChatMessage> {
    if (!this.isInitialized) {
      throw new Error('El modelo no está inicializado');
    }

    try {
      // Simulación de respuesta del LLM
      // En un entorno real, aquí harías la llamada a OpenAI
      const response = await this.simulateOpenAIResponse(message, context, config);
      
      return {
        id: uuidv4(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
    } catch (error) {
      throw new Error('Error procesando el mensaje');
    }
  }

  private async simulateOpenAIResponse(
    message: string, 
    context: WalletfyContext, 
    config: LLMConfig
  ): Promise<string> {
    // Simulación de delay de respuesta
    await new Promise(resolve => setTimeout(resolve, 1500));

    const lowerMessage = message.toLowerCase();

    // Respuestas contextualizadas basadas en los datos
    if (lowerMessage.includes('balance') || lowerMessage.includes('dinero')) {
      return `💰 Tu balance actual es de $${context.balanceActual.toFixed(2)}. 

Comenzaste con $${context.balanceInicial.toFixed(2)} y has tenido un ${context.balanceActual >= context.balanceInicial ? 'crecimiento' : 'decrecimiento'} de $${(context.balanceActual - context.balanceInicial).toFixed(2)}.

Con una tasa de ahorro del ${context.insights.savingsRate.toFixed(1)}%, estás ${context.insights.savingsRate > 20 ? '¡excelente! 🎉' : context.insights.savingsRate > 10 ? 'bien encaminado 👍' : 'necesitando mejorar tus hábitos de ahorro 📈'}.`;
    }

    if (lowerMessage.includes('gasto') || lowerMessage.includes('egreso')) {
      const highestExpenseMonth = context.insights.highestExpenseMonth;
      return `📊 Tus gastos totales son de $${context.totalEgresos.toFixed(2)}.

Tu promedio mensual de gastos es $${context.insights.avgMonthlyExpense.toFixed(2)}. El mes con mayores gastos fue ${highestExpenseMonth}.

${context.insights.avgMonthlyExpense > context.insights.avgMonthlyIncome * 0.8 ? 
  '⚠️ Tus gastos representan más del 80% de tus ingresos. Considera revisar tus gastos no esenciales.' : 
  '✅ Mantienes un buen control de gastos respecto a tus ingresos.'}`;
    }

    if (lowerMessage.includes('ingreso')) {
      return `💵 Tus ingresos totales son de $${context.totalIngresos.toFixed(2)}.

Tu promedio mensual de ingresos es $${context.insights.avgMonthlyIncome.toFixed(2)}. El mes con mayores ingresos fue ${context.insights.highestIncomeMonth}.

${context.monthlyData.length > 1 ? 
  `Comparando los últimos meses, ${this.analyzeIncometrend(context.monthlyData)}` : 
  'Registra más meses para obtener análisis de tendencias.'}`;
    }

    if (lowerMessage.includes('consejo') || lowerMessage.includes('recomendación')) {
      return this.generateFinancialAdvice(context);
    }

    if (lowerMessage.includes('resumen') || lowerMessage.includes('análisis')) {
      return `📈 **Resumen Financiero**

**Balance:** $${context.balanceActual.toFixed(2)} (${context.balanceActual >= context.balanceInicial ? '+' : ''}$${(context.balanceActual - context.balanceInicial).toFixed(2)})
**Ingresos totales:** $${context.totalIngresos.toFixed(2)}
**Gastos totales:** $${context.totalEgresos.toFixed(2)}
**Tasa de ahorro:** ${context.insights.savingsRate.toFixed(1)}%

**Tendencia:** ${context.monthlyData.length > 1 ? this.analyzeTrend(context.monthlyData) : 'Necesitas más datos para análisis de tendencias'}

${this.generateQuickTips(context)}`;
    }

    // Respuesta genérica contextualizada
    return `Hola! 👋 Soy tu asistente financiero de Walletfy. 

Veo que tienes ${context.totalEvents} eventos registrados con un balance actual de $${context.balanceActual.toFixed(2)}.

Puedo ayudarte con:
• Análisis de tu balance y gastos 📊
• Consejos personalizados de ahorro 💡
• Resumen de tus finanzas 📈
• Tendencias de ingresos y gastos 📉

¿En qué te gustaría que te ayude específicamente?`;
  }

  private analyzeIncometrend(monthlyData: any[]): string {
    if (monthlyData.length < 2) return '';
    
    const recent = monthlyData.slice(-2);
    const trend = recent[1].ingresos - recent[0].ingresos;
    
    if (trend > 0) {
      return `tus ingresos han aumentado $${trend.toFixed(2)} 📈`;
    } else if (trend < 0) {
      return `tus ingresos han disminuido $${Math.abs(trend).toFixed(2)} 📉`;
    } else {
      return 'tus ingresos se han mantenido estables 📊';
    }
  }

  private analyzeTrend(monthlyData: any[]): string {
    if (monthlyData.length < 2) return 'Insuficientes datos';
    
    const recent = monthlyData.slice(-2);
    const balanceTrend = recent[1].balance - recent[0].balance;
    
    if (balanceTrend > 0) {
      return `Mejorando (+$${balanceTrend.toFixed(2)}) 📈`;
    } else if (balanceTrend < 0) {
      return `Decreciendo ($${balanceTrend.toFixed(2)}) 📉`;
    } else {
      return 'Estable 📊';
    }
  }

  private generateFinancialAdvice(context: WalletfyContext): string {
    const advice = [];
    
    if (context.insights.savingsRate < 10) {
      advice.push('💡 Intenta ahorrar al menos el 10% de tus ingresos');
    }
    
    if (context.insights.avgMonthlyExpense > context.insights.avgMonthlyIncome * 0.9) {
      advice.push('⚠️ Tus gastos son muy altos comparados con tus ingresos');
    }
    
    if (context.balanceActual < context.balanceInicial) {
      advice.push('📉 Tu balance ha disminuido, revisa tus gastos recurrentes');
    }
    
    if (advice.length === 0) {
      advice.push('🎉 ¡Excelente manejo financiero! Sigue así');
    }
    
    return `**Consejos Personalizados:**\n\n${advice.join('\n\n')}`;
  }

  private generateQuickTips(context: WalletfyContext): string {
    return `**Tips rápidos:**
• ${context.insights.savingsRate > 15 ? 'Considera invertir tus ahorros 💰' : 'Establece una meta de ahorro mensual 🎯'}
• ${context.monthlyData.length > 3 ? 'Revisa patrones estacionales en tus gastos 📅' : 'Registra más meses para mejores insights 📊'}`;
  }
}

export const chatService = new ChatService();