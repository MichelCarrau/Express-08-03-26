import React, { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import Banner from './components/Banner/Banner';
import RegistroGuia from './components/RegistroGuia/RegistroGuia';
import EstadoGeneral from './components/EstadoGeneral/EstadoGeneral';
import ListaGuias from './components/ListaGuias/ListaGuias';
import type { Guide, EstadoGuia } from './types';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

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

function App() {
  const [guias, setGuias] = useState<Guide[]>(GUIAS_INICIALES);
  const [mensaje, setMensaje] = useState<{ texto: string; tipo: string } | null>(null);

  useEffect(() => {
    console.log('El estado de guías ha cambiado:', guias);
  }, [guias]);

  const mostrarMensaje = (texto: string, tipo: string = 'info') => {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje(null), 5000);
  };

  const obtenerFechaHoraActual = (): string => {
    const ahora = new Date();
    const anio = ahora.getFullYear();
    const mes = String(ahora.getMonth() + 1).padStart(2, '0');
    const dia = String(ahora.getDate()).padStart(2, '0');
    const horas = String(ahora.getHours()).padStart(2, '0');
    const minutos = String(ahora.getMinutes()).padStart(2, '0');
    const segundos = String(ahora.getSeconds()).padStart(2, '0');
    return anio + '-' + mes + '-' + dia + ' ' + horas + ':' + minutos + ':' + segundos;
  };

  const handleRegistrar = (datos: Omit<Guide, 'id' | 'ultimaActualizacion' | 'historial'>) => {
    const existe = guias.some(g => g.numeroGuia === datos.numeroGuia);
    if (existe) {
      mostrarMensaje('El número de guía "' + datos.numeroGuia + '" ya está registrado.', 'danger');
      return;
    }

    contadorHistorial++;
    const nuevaGuia: Guide = {
      ...datos,
      id: guias.length + 1,
      ultimaActualizacion: obtenerFechaHoraActual(),
      historial: [{ id: contadorHistorial, estado: datos.estado, fecha: obtenerFechaHoraActual() }]
    };

    setGuias([...guias, nuevaGuia]);
    mostrarMensaje('Guía ' + datos.numeroGuia + ' registrada exitosamente.', 'success');
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
        { id: contadorHistorial, estado: nuevoEstado, fecha: obtenerFechaHoraActual() }
      ]
    };

    setGuias(guias.map(g => g.id === id ? guiaActualizada : g));
    const nombresEstados = {
      'pendiente': 'Pendiente',
      'transito': 'En Tránsito',
      'entregado': 'Entregado'
    };
    mostrarMensaje('Guía ' + guia.numeroGuia + ' actualizada a "' + nombresEstados[nuevoEstado] + '".', 'success');
  };

  return (
    <div>
      <Header />
      <Banner />

      {mensaje && (
        <div className={'alert alert-' + mensaje.tipo + ' alert-dismissible fade show mensaje-flotante'} style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999, maxWidth: '400px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}>
          {mensaje.texto}
          <button type="button" className="btn-close" onClick={() => setMensaje(null)}></button>
        </div>
      )}

      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <RegistroGuia onRegistrar={handleRegistrar} />
          </div>
          <div className="col-md-6">
            <section className="estado-box">
              <EstadoGeneral guias={guias} />
              <section id="buscar" className="buscar">
                <h2 className="buscar__title">Buscar Guías</h2>
                <input type="text" id="buscar-guia" className="buscar__input" placeholder="Ingrese el número de guía" />
                <button className="buscar__button" onClick={() => {
                  const input = document.getElementById('buscar-guia') as HTMLInputElement;
                  const numero = input.value.trim();
                  if (!numero) {
                    mostrarMensaje('Por favor, ingrese un número de guía para buscar.', 'danger');
                    return;
                  }
                  const encontrada = guias.find(g => g.numeroGuia === numero);
                  if (encontrada) {
                    mostrarMensaje('Guía ' + numero + ' encontrada.', 'success');
                    setGuias([encontrada]);
                    setTimeout(() => setGuias(guias), 3000);
                  } else {
                    mostrarMensaje('No se encontró ninguna guía con el número "' + numero + '".', 'danger');
                  }
                  input.value = '';
                }}>Buscar</button>
              </section>
            </section>
          </div>
        </div>

        <ListaGuias guias={guias} onActualizarEstado={handleActualizarEstado} />

        <section id="historial" className="historial mt-4">
          <h2 className="historial__title">Historial de Guías</h2>
          <p className="historial__description">Visualiza el historial de cambios de cada guía registrada.</p>
        </section>
      </div>

      <footer className="footer text-center mt-4">
        <p className="footer__text">&copy; 2025 Hound Express. Todos los derechos reservados.</p>
        <p className="footer__links"><a href="#contacto" className="footer__link">Contáctanos</a> | <a href="#privacidad" className="footer__link">Política de Privacidad</a></p>
      </footer>
    </div>
  );
}

export default App;