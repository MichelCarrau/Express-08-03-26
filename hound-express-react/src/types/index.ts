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
