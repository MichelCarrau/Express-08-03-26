// src/components/RegistroGuia/RegistroGuia.tsx

import React, { useState } from 'react';
import { Guide, FormData, EstadoGuia } from '../../types';
import './RegistroGuia.css';

interface RegistroGuiaProps {
  onRegistrarGuia: (guia: Omit<Guide, 'id' | 'ultimaActualizacion' | 'historial'>) => void;
}

export const RegistroGuia: React.FC<RegistroGuiaProps> = ({ onRegistrarGuia }) => {
  const [formData, setFormData] = useState<FormData>({
    numeroGuia: '',
    origen: '',
    destino: '',
    destinatario: '',
    fechaCreacion: '',
    estado: 'pendiente'
  });

  const [errores, setErrores] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    const campoMap: Record<string, keyof FormData> = {
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

  const validarFormulario = (): boolean => {
    const nuevosErrores: string[] = [];
    
    if (!formData.numeroGuia.trim()) {
      nuevosErrores.push('El campo "Número de Guía" es obligatorio.');
    }
    if (!formData.origen.trim()) {
      nuevosErrores.push('El campo "Origen" es obligatorio.');
    }
    if (!formData.destino.trim()) {
      nuevosErrores.push('El campo "Destino" es obligatorio.');
    }
    if (!formData.destinatario.trim()) {
      nuevosErrores.push('El campo "Destinatario" es obligatorio.');
    }
    if (!formData.fechaCreacion) {
      nuevosErrores.push('El campo "Fecha de Creación" es obligatorio.');
    }
    
    setErrores(nuevosErrores);
    return nuevosErrores.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }

    const nuevaGuia = {
      numeroGuia: formData.numeroGuia,
      origen: formData.origen,
      destino: formData.destino,
      destinatario: formData.destinatario,
      fechaCreacion: formData.fechaCreacion,
      estado: formData.estado as EstadoGuia
    };

    onRegistrarGuia(nuevaGuia);
    
    // Limpiar formulario
    setFormData({
      numeroGuia: '',
      origen: '',
      destino: '',
      destinatario: '',
      fechaCreacion: '',
      estado: 'pendiente'
    });
  };

  return (
    <section className="registro">
      <h2 className="registro__title">Registro de Guías</h2>
      
      {errores.length > 0 && (
        <div className="alert alert-danger">
          {errores.map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </div>
      )}
      
      <form className="registro__form" onSubmit={handleSubmit}>
        <label htmlFor="num-guia" className="registro__label">Número de Guía:</label>
        <input 
          type="text" 
          id="num-guia" 
          className="registro__input" 
          value={formData.numeroGuia}
          onChange={handleChange}
          required 
        />
        
        <label htmlFor="origen" className="registro__label">Origen:</label>
        <input 
          type="text" 
          id="origen" 
          className="registro__input" 
          value={formData.origen}
          onChange={handleChange}
          required 
        />
        
        <label htmlFor="destino" className="registro__label">Destino:</label>
        <input 
          type="text" 
          id="destino" 
          className="registro__input" 
          value={formData.destino}
          onChange={handleChange}
          required 
        />
        
        <label htmlFor="destinatario" className="registro__label">Destinatario:</label>
        <input 
          type="text" 
          id="destinatario" 
          className="registro__input" 
          value={formData.destinatario}
          onChange={handleChange}
          required 
        />
        
        <label htmlFor="fecha" className="registro__label">Fecha de Creación:</label>
        <input 
          type="date" 
          id="fecha" 
          className="registro__input" 
          value={formData.fechaCreacion}
          onChange={handleChange}
          required 
        />
        
        <label htmlFor="estado" className="registro__label">Estado:</label>
        <select 
          id="estado" 
          className="registro__select" 
          value={formData.estado}
          onChange={handleChange}
        >
          <option value="pendiente">Pendiente</option>
          <option value="transito">En tránsito</option>
          <option value="entregado">Entregado</option>
        </select>
        
        <button type="submit" className="registro__button">Registrar Guía</button>
      </form>
    </section>
  );
};