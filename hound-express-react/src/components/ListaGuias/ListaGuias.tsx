import React, { useState } from 'react';
import { Guide, EstadoGuia } from '../../types';

interface ListaGuiasProps {
  guias: Guide[];
  onActualizarEstado: (id: number) => void;
}

const ListaGuias: React.FC<ListaGuiasProps> = ({ guias, onActualizarEstado }) => {
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
      return ${dia}// ;
    }
    return fechaStr;
  };

  const handleBuscar = () => {
    if (!busqueda.trim()) {
      setGuiasFiltradas(guias);
      return;
    }
    setGuiasFiltradas(guias.filter(g => g.numeroGuia.includes(busqueda)));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleBuscar();
  };

  return (
    <>
      <section id="lista-guías" className="lista-guias mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <h2 className="lista-guias__title">Lista de Guías</h2>
          <div className="d-flex gap-2">
            <input
              type="text"
              className="form-control"
              placeholder="Ingrese el número de guía"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button className="btn btn-primary" onClick={handleBuscar}>Buscar</button>
          </div>
        </div>
        <table className="table lista-guias__table">
          <thead className="lista-guias__thead">
            <tr>
              <th className="lista-guias__th">Número de Guía</th>
              <th className="lista-guias__th">Estado Actual</th>
              <th className="lista-guias__th">Origen</th>
              <th className="lista-guias__th">Destino</th>
              <th className="lista-guias__th">Última Actualización</th>
              <th className="lista-guias__th">Acciones</th>
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
                  <td className="lista-guias__td"><strong>{guia.numeroGuia}</strong></td>
                  <td className="lista-guias__td">
                    <span className={adge }>
                      {getEstadoNombre(guia.estado)}
                    </span>
                  </td>
                  <td className="lista-guias__td">{guia.origen}</td>
                  <td className="lista-guias__td">{guia.destino}</td>
                  <td className="lista-guias__td">{formatearFecha(guia.ultimaActualizacion)}</td>
                  <td className="lista-guias__td">
                    <button
                      className="btn btn-sm btn-primary lista-guias__button"
                      onClick={() => onActualizarEstado(guia.id)}
                      disabled={guia.estado === 'entregado'}
                    >
                      {guia.estado === 'entregado' ? 'Entregado' : 'Actualizar'}
                    </button>
                    <button
                      className="btn btn-sm btn-secondary lista-guias__button"
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
      </section>

      {/* MODAL HISTORIAL */}
      {guiaSeleccionada && (
        <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Historial de Cambios - Guía #{guiaSeleccionada.numeroGuia}</h5>
                <button type="button" className="btn-close" onClick={() => setGuiaSeleccionada(null)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <p><strong>Destinatario:</strong> {guiaSeleccionada.destinatario}</p>
                  <p><strong>Origen:</strong> {guiaSeleccionada.origen} → <strong>Destino:</strong> {guiaSeleccionada.destino}</p>
                  <p><strong>Estado Actual:</strong> <span className={adge }>{getEstadoNombre(guiaSeleccionada.estado)}</span></p>
                  <hr />
                </div>
                <h6>Registro de Cambios:</h6>
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr><th>#</th><th>Estado</th><th>Fecha y Hora</th></tr>
                    </thead>
                    <tbody>
                      {guiaSeleccionada.historial.map((entry, index) => (
                        <tr key={entry.id}>
                          <td>{index + 1}</td>
                          <td><span className={adge }>{getEstadoNombre(entry.estado)}</span></td>
                          <td>{entry.fecha}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setGuiaSeleccionada(null)}>Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ListaGuias;
