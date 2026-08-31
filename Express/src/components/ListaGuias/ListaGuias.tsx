// src/components/ListaGuias/ListaGuias.tsx

import React, { useState } from 'react';
import { Guide, EstadoGuia } from '../../types';
import { ModalHistorial } from '../ModalHistorial/ModalHistorial';
import './ListaGuias.css';

interface ListaGuiasProps {
  guias: Guide[];
  onActualizarEstado: (id: number) => void;
  onBuscarGuia?: (numeroGuia: string) => Guide | null;
}

export const ListaGuias: React.FC<ListaGuiasProps> = ({ 
  guias, 
  onActualizarEstado,
  onBuscarGuia 
}) => {
  const [guiaSeleccionada, setGuiaSeleccionada] = useState<Guide | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [guiasFiltradas, setGuiasFiltradas] = useState<Guide[]>(guias);

  const getEstadoNombre = (estado: EstadoGuia): string => {
    const nombres = {
      'pendiente': 'Pendiente',
      'transito': 'En Tránsito',
      'entregado': 'Entregado'
    };
    return nombres[estado] || estado;
  };

  const getEstadoBadgeClass = (estado: EstadoGuia): string => {
    const clases = {
      'pendiente': 'bg-warning text-dark',
      'transito': 'bg-primary',
      'entregado': 'bg-success'
    };
    return clases[estado] || 'bg-secondary';
  };

  const formatearFecha = (fechaStr: string): string => {
    if (!fechaStr) return 'N/A';
    const partes = fechaStr.split(' ');
    const fecha = partes[0];
    const hora = partes[1] || '';
    if (fecha) {
      const [año, mes, dia] = fecha.split('-');
      return `${dia}/${mes}/${año} ${hora}`;
    }
    return fechaStr;
  };

  const handleBuscar = () => {
    if (!busqueda.trim()) {
      setGuiasFiltradas(guias);
      return;
    }

    if (onBuscarGuia) {
      const guia = onBuscarGuia(busqueda);
      if (guia) {
        setGuiasFiltradas([guia]);
      } else {
        setGuiasFiltradas([]);
      }
    }
  };

  React.useEffect(() => {
    setGuiasFiltradas(guias);
  }, [guias]);

  return (
    <>
      <section className="lista-guias mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="lista-guias__title">Lista de Guías</h2>
          <div className="d-flex gap-2">
            <input 
              type="text" 
              className="form-control" 
              placeholder="Buscar por número de guía"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleBuscar()}
            />
            <button className="btn btn-primary" onClick={handleBuscar}>
              Buscar
            </button>
          </div>
        </div>
        
        <div className="table-responsive">
          <table className="table lista-guias__table">
            <thead className="lista-guias__thead">
              <tr>
                <th>Número de Guía</th>
                <th>Estado Actual</th>
                <th>Origen</th>
                <th>Destino</th>
                <th>Última Actualización</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody className="lista-guias__tbody">
              {guiasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center">No hay guías registradas.</td>
                </tr>
              ) : (
                guiasFiltradas.map(guia => (
                  <tr key={guia.id}>
                    <td><strong>{guia.numeroGuia}</strong></td>
                    <td>
                      <span className={`badge ${getEstadoBadgeClass(guia.estado)}`}>
                        {getEstadoNombre(guia.estado)}
                      </span>
                    </td>
                    <td>{guia.origen}</td>
                    <td>{guia.destino}</td>
                    <td>{formatearFecha(guia.ultimaActualizacion)}</td>
                    <td>
                      <button 
                        className="btn btn-sm btn-primary me-1"
                        onClick={() => onActualizarEstado(guia.id)}
                        disabled={guia.estado === 'entregado'}
                      >
                        {guia.estado === 'entregado' ? 'Entregado' : 'Actualizar'}
                      </button>
                      <button 
                        className="btn btn-sm btn-secondary"
                        onClick={() => setGuiaSeleccionada(guia)}
                      >
                        Historial
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <ModalHistorial 
        guia={guiaSeleccionada}
        onClose={() => setGuiaSeleccionada(null)}
      />
    </>
  );
};