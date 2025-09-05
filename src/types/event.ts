import { z } from 'zod';
import moment from 'moment';

export const EventTypeSchema = z.enum(['ingreso', 'egreso']);
export type EventType = z.infer<typeof EventTypeSchema>;

export const EventSchema = z.object({
  id: z.string().uuid(),
  nombre: z.string().min(1, 'El nombre es obligatorio').max(20, 'El nombre no puede tener más de 20 caracteres'),
  descripcion: z.string().max(100, 'La descripción no puede tener más de 100 caracteres').optional(),
  cantidad: z.number().positive('La cantidad debe ser un número positivo'),
  fecha: z.date(),
  tipo: EventTypeSchema,
  adjunto: z.string().optional(), // Base64 encoded image
});

export type Event = {
  id: string;
  nombre: string;
  descripcion?: string;
  cantidad: number;
  fecha: Date;
  tipo: EventType;
  adjunto?: string;
};

export interface MonthGroup {
  month: string;
  year: number;
  events: Event[];
  totalIngresos: number;
  totalEgresos: number;
  balance: number;
  balanceGlobal: number;
}