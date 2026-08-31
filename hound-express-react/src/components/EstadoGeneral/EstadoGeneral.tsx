import React, { useEffect, useState } from 'react';
import { Guide } from '../../types';

interface EstadoGeneralProps {
  guias: Guide[];
}

const EstadoGeneral: React.FC<EstadoGeneralProps> = ({ guias }) => {
  const [activas, setActivas] = useState(0);
  const [enTransito, setEnTransito] = useState(0);
  const [entregadas, setEntregadas] = useState(0);

  useEffect(() => {
    setActivas(guias.filter(g => g.estado === 'pendiente' || g.estado === 'transito').length);
    setEnTransito(guias.filter(g => g.estado === 'transito').length);
    setEntregadas(guias.filter(g => g.estado === 'entregado').length);
  }, [guias]);

  return (
    <section id="estado-general" className="estado-general">
      <h2 className="estado-general__title">Estado General</h2>
      <div className="estado-general__estado">
        <p className="estado-general__estado-item"><strong>Total de Guías Activas:</strong> {activas}</p>
        <p className="estado-general__estado-item"><strong>Guías en Tránsito:</strong> {enTransito}</p>
        <p className="estado-general__estado-item"><strong>Guías Entregadas:</strong> {entregadas}</p>
        <p className="estado-general__estado-item"><strong>Total de Guías:</strong> {guias.length}</p>
      </div>
    </section>
  );
};

export default EstadoGeneral;
