// src/components/EstadoGeneral/EstadoGeneral.tsx

import React, { useEffect } from 'react';
import { Guide, EstadoGeneral as EstadoGeneralType } from '../../types';
import './EstadoGeneral.css';

interface EstadoGeneralProps {
  guias: Guide[];
}

export const EstadoGeneral: React.FC<EstadoGeneralProps> = ({ guias }) => {
  const [estado, setEstado] = React.useState<EstadoGeneralType>({
    activas: 0,
    enTransito: 0,
    entregadas: 0,
    total: 0
  });

  useEffect(() => {
    const activas = guias.filter(g => g.estado === 'pendiente' || g.estado === 'transito').length;
    const enTransito = guias.filter(g => g.estado === 'transito').length;
    const entregadas = guias.filter(g => g.estado === 'entregado').length;
    
    setEstado({
      activas,
      enTransito,
      entregadas,
      total: guias.length
    });
  }, [guias]);

  return (
    <section className="estado-general">
      <h2 className="estado-general__title">Estado General</h2>
      <div className="estado-general__estado">
        <p className="estado-general__estado-item">
          <strong>Total de Guías Activas:</strong> {estado.activas}
        </p>
        <p className="estado-general__estado-item">
          <strong>Guías en Tránsito:</strong> {estado.enTransito}
        </p>
        <p className="estado-general__estado-item">
          <strong>Guías Entregadas:</strong> {estado.entregadas}
        </p>
        <p className="estado-general__estado-item">
          <strong>Total de Guías:</strong> {estado.total}
        </p>
      </div>
    </section>
  );
};