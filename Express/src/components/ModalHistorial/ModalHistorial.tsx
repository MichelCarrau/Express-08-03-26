// src/components/ModalHistorial/ModalHistorial.tsx

import React from 'react';
import { Guide, EstadoGuia } from '../../types';
import './ModalHistorial.css';

interface ModalHistorialProps {
  guia: Guide | null;
  onClose: () => void;
}

export const ModalHistorial: React.FC<ModalHistorialProps> = ({ guia, onClose }) => {
  const [isOpen, setIsOpen] = React.useState(false);

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

  React.useEffect(() => {
    setIsOpen(!!guia);
  }, [guia]);

  if (!guia) return null;

  return (
    <div className={`modal fade ${isOpen ? 'show' : ''}`} 
         style={{ display: isOpen ? 'block' : 'none' }}
         tabIndex={-1}
         role="dialog">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              Historial de Cambios - Guía #{guia.numeroGuia}
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <p><strong>Destinatario:</strong> {guia.destinatario}</p>
              <p><strong>Origen:</strong> {guia.origen} → <strong>Destino:</strong> {guia.destino}</p>
              <p>
                <strong>Estado Actual:</strong> 
                <span className={`badge ${getEstadoBadgeClass(guia.estado)}`}>
                  {getEstadoNombre(guia.estado)}
                </span>
              </p>
              <hr />
            </div>
            
            <h6>Registro de Cambios:</h6>
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Estado</th>
                    <th>Fecha y Hora</th>
                  </tr>
                </thead>
                <tbody>
                  {guia.historial.map((entry, index) => (
                    <tr key={entry.id}>
                      <td>{index + 1}</td>
                      <td>
                        <span className={`badge ${getEstadoBadgeClass(entry.estado)}`}>
                          {getEstadoNombre(entry.estado)}
                        </span>
                      </td>
                      <td>{entry.fecha}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};