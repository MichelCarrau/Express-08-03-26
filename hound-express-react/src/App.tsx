// src/App.tsx

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header/Header';
import { Banner } from './components/Banner/Banner';
import { RegistroGuia } from './components/RegistroGuia/RegistroGuia';
import { EstadoGeneral } from './components/EstadoGeneral/EstadoGeneral';
import { ListaGuias } from './components/ListaGuias/ListaGuias';
import { Guide, EstadoGuia } from './types';
import './App.css';

// Datos iniciales
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
      { id: 2, estado: 'transito', fecha: '2025-03-01 14:30:00' }
    ]
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
    historial: [
      { id: 3, estado: 'pendiente', fecha: '2025-03-02 09:00:00' }
    ]
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
      { id: 6, estado: 'entregado', fecha: '2025-03-03 16:00:00' }
    ]
  }
];

let contadorHistorial = 6;
let contadorGuias = 3;

function App() {
  const [guias, setGuias] = useState<Guide[]>(GUIAS_INICIALES);
  const [mensaje, setMensaje] = useState<{ texto: string; tipo: 'success' | 'danger' | 'info' } | null>(null);

  useEffect(() => {
    console.log('El estado de guías ha cambiado:', guias);
  }, [guias]);

  const mostrarMensaje = (texto: string, tipo: 'success' | 'danger' | 'info' = 'info') => {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje(null), 5000);
  };

  const obtenerFechaHoraActual = (): string => {
    const ahora = new Date();
    const año = ahora.getFullYear();
    const mes = String(ahora.getMonth() + 1).padStart(2, '0');
    const dia = String(ahora.getDate()).padStart(2, '0');
    const horas = String(ahora.getHours()).padStart(2, '0');
    const minutos = String(ahora.getMinutes()).padStart(2, '0');
    const segundos = String(ahora.getSeconds()).padStart(2, '0');
    return `${año}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;
  };

  const handleRegistrarGuia = (nuevaGuia: Omit<Guide, 'id' | 'ultimaActualizacion' | 'historial'>) => {
    // Verificar duplicado
    const existe = guias.some(g => g.numeroGuia === nuevaGuia.numeroGuia);
    if (existe) {
      mostrarMensaje(`El número de guía "${nuevaGuia.numeroGuia}" ya está registrado.`, 'danger');
      return;
    }

    contadorGuias++;
    contadorHistorial++;

    const guiaCompleta: Guide = {
      ...nuevaGuia,
      id: contadorGuias,
      ultimaActualizacion: obtenerFechaHoraActual(),
      historial: [
        {
          id: contadorHistorial,
          estado: nuevaGuia.estado,
          fecha: obtenerFechaHoraActual()
        }
      ]
    };

    setGuias(prev => [...prev, guiaCompleta]);
    mostrarMensaje(`Guía ${nuevaGuia.numeroGuia} registrada exitosamente.`, 'success');
  };

  const handleActualizarEstado = (id: number) => {
    const guia = guias.find(g => g.id === id);
    if (!guia) return;

    const flujoEstados: EstadoGuia[] = ['pendiente', 'transito', 'entregado'];
    const indiceActual = flujoEstados.indexOf(guia.estado);

    if (indiceActual === flujoEstados.length - 1) {
      mostrarMensaje('Esta guía ya está entregada. No se puede actualizar.', 'danger');
      return;
    }

    const nuevoEstado = flujoEstados[indiceActual + 1];
    contadorHistorial++;

    const guiaActualizada: Guide = {
      ...guia,
      estado: nuevoEstado,
      ultimaActualizacion: obtenerFechaHoraActual(),
      historial: [
        ...guia.historial,
        {
          id: contadorHistorial,
          estado: nuevoEstado,
          fecha: obtenerFechaHoraActual()
        }
      ]
    };

    setGuias(prev => prev.map(g => g.id === id ? guiaActualizada : g));
    
    const nombresEstados = {
      'pendiente': 'Pendiente',
      'transito': 'En Tránsito',
      'entregado': 'Entregado'
    };
    mostrarMensaje(
      `Guía ${guia.numeroGuia} actualizada a "${nombresEstados[nuevoEstado]}".`,
      'success'
    );
  };

  const handleBuscarGuia = (numeroGuia: string): Guide | null => {
    const guia = guias.find(g => g.numeroGuia === numeroGuia);
    if (guia) {
      mostrarMensaje(`Guía ${numeroGuia} encontrada.`, 'success');
    } else {
      mostrarMensaje(`No se encontró ninguna guía con el número "${numeroGuia}".`, 'danger');
    }
    return guia || null;
  };

  return (
    <div className="App">
      <Header />
      <Banner />
      
      {mensaje && (
        <div className={`alert alert-${mensaje.tipo} alert-dismissible fade show mensaje-flotante`} 
             style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999, maxWidth: '400px' }}>
          {mensaje.texto}
          <button type="button" className="btn-close" onClick={() => setMensaje(null)}></button>
        </div>
      )}

      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <RegistroGuia onRegistrarGuia={handleRegistrarGuia} />
          </div>
          <div className="col-md-6">
            <div className="estado-box">
              <EstadoGeneral guias={guias} />
            </div>
          </div>
        </div>

        <ListaGuias 
          guias={guias}
          onActualizarEstado={handleActualizarEstado}
          onBuscarGuia={handleBuscarGuia}
        />

        <section className="historial mt-4">
          <h2 className="historial__title">Historial de Guías</h2>
          <p className="historial__description">
            Visualiza el historial de cambios de cada guía registrada haciendo clic en "Historial".
          </p>
        </section>
      </div>

      <footer className="footer text-center mt-4">
        <p className="footer__text">&copy; 2025 Hound Express. Todos los derechos reservados.</p>
        <p className="footer__links">
          <a href="#contacto" className="footer__link">Contáctanos</a> | 
          <a href="#privacidad" className="footer__link">Política de Privacidad</a>
        </p>
      </footer>
    </div>
  );
}

export default App;