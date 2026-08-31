// src/types/index.ts

export interface HistoryEntry {
  id: number;
  estado: 'pendiente' | 'transito' | 'entregado';
  fecha: string;
}

export interface Guide {
  id: number;
  numeroGuia: string;
  origen: string;
  destino: string;
  destinatario: string;
  fechaCreacion: string;
  estado: 'pendiente' | 'transito' | 'entregado';
  ultimaActualizacion: string;
  historial: HistoryEntry[];
}

export type EstadoGuia = 'pendiente' | 'transito' | 'entregado';

export interface FormData {
  numeroGuia: string;
  origen: string;
  destino: string;
  destinatario: string;
  fechaCreacion: string;
  estado: EstadoGuia;
}

export interface EstadoGeneral {
  activas: number;
  enTransito: number;
  entregadas: number;
  total: number;
}

export interface Mensaje {
  texto: string;
  tipo: 'success' | 'danger' | 'info' | 'warning';
}