import React, { useState } from 'react';
import type { Guide, EstadoGuia } from '../../types';

interface RegistroGuiaProps {
  onRegistrar: (datos: Omit<Guide, 'id' | 'ultimaActualizacion' | 'historial'>) => void;
}

const RegistroGuia: React.FC<RegistroGuiaProps> = ({ onRegistrar }) => {
  const [formData, setFormData] = useState({
    numeroGuia: '',
    origen: '',
    destino: '',
    destinatario: '',
    fechaCreacion: '',
    estado: 'pendiente' as EstadoGuia
  });
  const [errores, setErrores] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    const campoMap: Record<string, keyof typeof formData> = {
      'num-guia': 'numeroGuia',
      'origen': 'origen',
      'destino': 'destino',
      'destinatario': 'destinatario',
      'fecha': 'fechaCreacion',
      'estado': 'estado'
    };
    const campo = campoMap[id];
    if (campo) {
      setFormData(prev => ({ ...prev, [campo]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const erroresValidacion: string[] = [];
    if (!formData.numeroGuia.trim()) erroresValidacion.push('Número de Guía es obligatorio');
    if (!formData.origen.trim()) erroresValidacion.push('Origen es obligatorio');
    if (!formData.destino.trim()) erroresValidacion.push('Destino es obligatorio');
    if (!formData.destinatario.trim()) erroresValidacion.push('Destinatario es obligatorio');
    if (!formData.fechaCreacion) erroresValidacion.push('Fecha es obligatoria');
    
    if (erroresValidacion.length > 0) {
      setErrores(erroresValidacion);
      return;
    }
    setErrores([]);
    onRegistrar(formData);
    setFormData({ numeroGuia: '', origen: '', destino: '', destinatario: '', fechaCreacion: '', estado: 'pendiente' });
  };

  return (
    <section id="registro" className="registro">
      <h2 className="registro__title">Registro de Guías</h2>
      {errores.length > 0 && (
        <div className="alert alert-danger">
          {errores.map((error, i) => <div key={i}>{error}</div>)}
        </div>
      )}
      <form className="registro__form" onSubmit={handleSubmit}>
        <label htmlFor="num-guia" className="registro__label">Número de Guía:</label>
        <input type="text" id="num-guia" className="registro__input" value={formData.numeroGuia} onChange={handleChange} required />
        <label htmlFor="origen" className="registro__label">Origen:</label>
        <input type="text" id="origen" className="registro__input" value={formData.origen} onChange={handleChange} required />
        <label htmlFor="destino" className="registro__label">Destino:</label>
        <input type="text" id="destino" className="registro__input" value={formData.destino} onChange={handleChange} required />
        <label htmlFor="destinatario" className="registro__label">Destinatario:</label>
        <input type="text" id="destinatario" className="registro__input" value={formData.destinatario} onChange={handleChange} required />
        <label htmlFor="fecha" className="registro__label">Fecha de Creación:</label>
        <input type="date" id="fecha" className="registro__input" value={formData.fechaCreacion} onChange={handleChange} required />
        <label htmlFor="estado" className="registro__label">Estado:</label>
        <select id="estado" className="registro__select" value={formData.estado} onChange={handleChange}>
          <option value="pendiente">Pendiente</option>
          <option value="transito">En tránsito</option>
          <option value="entregado">Entregado</option>
        </select>
        <button type="submit" className="registro__button">Registrar Guía</button>
      </form>
    </section>
  );
};

export default RegistroGuia;
