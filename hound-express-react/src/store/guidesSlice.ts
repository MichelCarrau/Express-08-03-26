import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Guide, EstadoGuia, HistoryEntry } from '../types';

const GUIAS_INICIALES: Guide[] = [
  {
    id: 1,
    numeroGuia: '12345',
    origen: 'Cancún',
    destino: 'CDMX',
    destinatario: 'María Pérez',
    fechaCreacion: '2025-03-01',
    estado: 'transito',
    ultimaActualizacion: '2025-03-01 14:30:00',
    historial: [
      { id: 1, estado: 'pendiente', fecha: '2025-03-01 10:00:00' },
      { id: 2, estado: 'transito', fecha: '2025-03-01 14:30:00' },
    ],
  },
  {
    id: 2,
    numeroGuia: '67890',
    origen: 'Guadalajara',
    destino: 'Monterrey',
    destinatario: 'Juan López',
    fechaCreacion: '2025-03-02',
    estado: 'pendiente',
    ultimaActualizacion: '2025-03-02 09:00:00',
    historial: [{ id: 3, estado: 'pendiente', fecha: '2025-03-02 09:00:00' }],
  },
  {
    id: 3,
    numeroGuia: '54321',
    origen: 'CDMX',
    destino: 'Cancún',
    destinatario: 'Ana García',
    fechaCreacion: '2025-02-28',
    estado: 'entregado',
    ultimaActualizacion: '2025-03-03 16:00:00',
    historial: [
      { id: 4, estado: 'pendiente', fecha: '2025-02-28 08:00:00' },
      { id: 5, estado: 'transito', fecha: '2025-03-01 11:00:00' },
      { id: 6, estado: 'entregado', fecha: '2025-03-03 16:00:00' },
    ],
  },
];

export interface GuidesState {
  guias: Guide[];
  contadorHistorial: number;
}

const initialState: GuidesState = {
  guias: GUIAS_INICIALES,
  contadorHistorial: 6,
};

const obtenerFechaHoraActual = (): string => {
  const ahora = new Date();
  const anio = ahora.getFullYear();
  const mes = String(ahora.getMonth() + 1).padStart(2, '0');
  const dia = String(ahora.getDate()).padStart(2, '0');
  const horas = String(ahora.getHours()).padStart(2, '0');
  const minutos = String(ahora.getMinutes()).padStart(2, '0');
  const segundos = String(ahora.getSeconds()).padStart(2, '0');
  return `${anio}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;
};

const flujoEstados: EstadoGuia[] = ['pendiente', 'transito', 'entregado'];

const guidesSlice = createSlice({
  name: 'guides',
  initialState,
  reducers: {
    addGuide: (
      state,
      action: PayloadAction<Omit<Guide, 'id' | 'ultimaActualizacion' | 'historial'>>
    ) => {
      const datos = action.payload;
      const existe = state.guias.some((g) => g.numeroGuia === datos.numeroGuia);
      if (existe) return;

      state.contadorHistorial += 1;
      const ahora = obtenerFechaHoraActual();

      const nuevaGuia: Guide = {
        ...datos,
        id: state.guias.length + 1,
        ultimaActualizacion: ahora,
        historial: [
          { id: state.contadorHistorial, estado: datos.estado, fecha: ahora },
        ],
      };
      state.guias.push(nuevaGuia);
    },

    updateGuideStatus: (state, action: PayloadAction<number>) => {
      const guia = state.guias.find((g) => g.id === action.payload);
      if (!guia) return;

      const indiceActual = flujoEstados.indexOf(guia.estado);
      if (indiceActual === flujoEstados.length - 1) return;

      const nuevoEstado = flujoEstados[indiceActual + 1];
      state.contadorHistorial += 1;
      const ahora = obtenerFechaHoraActual();

      guia.estado = nuevoEstado;
      guia.ultimaActualizacion = ahora;
      const nuevoEntry: HistoryEntry = {
        id: state.contadorHistorial,
        estado: nuevoEstado,
        fecha: ahora,
      };
      guia.historial.push(nuevoEntry);
    },
  },
});

export const { addGuide, updateGuideStatus } = guidesSlice.actions;
export default guidesSlice.reducer;