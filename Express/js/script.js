
let guias = [];

let historialSeleccionado = null;

let contadorHistorial = 0;

const guiasIniciales = [
    {
        id: 1,
        numeroGuia: '12345',
        origen: 'Cancún',
        destino: 'CDMX',
        destinatario: 'María Pérez',
        fechaCreacion: '2025-03-01',
        estado: 'transito',
        ultimaActualizacion: '2025-03-01',
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
        ultimaActualizacion: '2025-03-02',
        historial: [
            { id: 1, estado: 'pendiente', fecha: '2025-03-02 09:00:00' }
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
        ultimaActualizacion: '2025-03-03',
        historial: [
            { id: 1, estado: 'pendiente', fecha: '2025-02-28 08:00:00' },
            { id: 2, estado: 'transito', fecha: '2025-03-01 11:00:00' },
            { id: 3, estado: 'entregado', fecha: '2025-03-03 16:00:00' }
        ]
    }
];

function inicializarDatos() {
    guias = JSON.parse(JSON.stringify(guiasIniciales));
    // Asignar IDs de historial correctos
    guias.forEach(guia => {
        guia.historial.forEach(entry => {
            entry.id = ++contadorHistorial;
        });
    });
    actualizarTodo();
}

function obtenerNuevoId() {
    if (guias.length === 0) return 1;
    const ids = guias.map(g => g.id);
    return Math.max(...ids) + 1;
}

function validarCampoVacio(valor, nombreCampo) {
    if (!valor || valor.trim() === '') {
        return `El campo "${nombreCampo}" es obligatorio.`;
    }
    return null;
}

function validarNumeroGuiaUnico(numeroGuia, idGuiaActual = null) {
    const existente = guias.find(g => 
        g.numeroGuia === numeroGuia && g.id !== idGuiaActual
    );
    if (existente) {
        return `El número de guía "${numeroGuia}" ya está registrado.`;
    }
    return null;
}

function validarFormulario(datos) {
    const errores = [];
    
    const campos = [
        { key: 'numeroGuia', nombre: 'Número de Guía' },
        { key: 'origen', nombre: 'Origen' },
        { key: 'destino', nombre: 'Destino' },
        { key: 'destinatario', nombre: 'Destinatario' },
        { key: 'fechaCreacion', nombre: 'Fecha de Creación' }
    ];
    
    for (const campo of campos) {
        const error = validarCampoVacio(datos[campo.key], campo.nombre);
        if (error) errores.push(error);
    }
    
    const errorDuplicado = validarNumeroGuiaUnico(datos.numeroGuia);
    if (errorDuplicado) errores.push(errorDuplicado);
    
    return errores;
}

function registrarGuia(event) {
    event.preventDefault();
    
    const numeroGuia = document.getElementById('num-guia').value.trim();
    const origen = document.getElementById('origen').value.trim();
    const destino = document.getElementById('destino').value.trim();
    const destinatario = document.getElementById('destinatario').value.trim();
    const fechaCreacion = document.getElementById('fecha').value;
    const estado = document.getElementById('estado').value;
    
    const datosGuia = {
        numeroGuia,
        origen,
        destino,
        destinatario,
        fechaCreacion,
        estado
    };
    
    const errores = validarFormulario(datosGuia);
    
    if (errores.length > 0) {
        mostrarMensajeError(errores.join('\n'));
        return;
    }
    
    const nuevaGuia = {
        id: obtenerNuevoId(),
        numeroGuia: numeroGuia,
        origen: origen,
        destino: destino,
        destinatario: destinatario,
        fechaCreacion: fechaCreacion,
        estado: estado,
        ultimaActualizacion: obtenerFechaHoraActual(),
        historial: [
            {
                id: ++contadorHistorial,
                estado: estado,
                fecha: obtenerFechaHoraActual()
            }
        ]
    };
    
    guias.push(nuevaGuia);
    
    actualizarTodo();
    
    limpiarFormulario();
    
    mostrarMensajeExito(`Guía ${numeroGuia} registrada exitosamente.`);
}

function actualizarEstadoGuia(id) {
    const guia = guias.find(g => g.id === id);
    if (!guia) return;
    
    const flujoEstados = ['pendiente', 'transito', 'entregado'];
    const estadoActual = guia.estado;
    const indiceActual = flujoEstados.indexOf(estadoActual);
    
    if (indiceActual === flujoEstados.length - 1) {
        mostrarMensajeError('Esta guía ya está entregada. No se puede actualizar.');
        return;
    }
    
    const nuevoEstado = flujoEstados[indiceActual + 1];
    guia.estado = nuevoEstado;
    guia.ultimaActualizacion = obtenerFechaHoraActual();
    
    guia.historial.push({
        id: ++contadorHistorial,
        estado: nuevoEstado,
        fecha: obtenerFechaHoraActual()
    });
    
    actualizarTodo();
    
    const nombresEstados = {
        'pendiente': 'Pendiente',
        'transito': 'En Tránsito',
        'entregado': 'Entregado'
    };
    mostrarMensajeExito(
        `Guía ${guia.numeroGuia} actualizada a "${nombresEstados[nuevoEstado]}".`
    );
}

function eliminarGuia(id) {
    if (confirm('¿Está seguro de eliminar esta guía?')) {
        guias = guias.filter(g => g.id !== id);
        actualizarTodo();
        mostrarMensajeExito('Guía eliminada correctamente.');
    }
}

function buscarGuia() {
    const inputBusqueda = document.getElementById('buscar-guia');
    const numeroBusqueda = inputBusqueda.value.trim();
    
    if (!numeroBusqueda) {
        mostrarMensajeError('Por favor, ingrese un número de guía para buscar.');
        return;
    }
    
    const guiaEncontrada = guias.find(g => g.numeroGuia === numeroBusqueda);
    
    if (guiaEncontrada) {
        renderizarListaGuias([guiaEncontrada]);
        mostrarMensajeExito(`Guía ${numeroBusqueda} encontrada.`);
    } else {
        renderizarListaGuias(guias);
        mostrarMensajeError(`No se encontró ninguna guía con el número "${numeroBusqueda}".`);
    }
    
    inputBusqueda.value = '';
}


function mostrarHistorial(id) {
    const guia = guias.find(g => g.id === id);
    if (!guia) return;
    
    historialSeleccionado = guia;
    
    const modalHTML = `
        <div class="modal fade" id="historialModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            Historial de Cambios - Guía #${guia.numeroGuia}
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <p><strong>Destinatario:</strong> ${guia.destinatario}</p>
                            <p><strong>Origen:</strong> ${guia.origen} → <strong>Destino:</strong> ${guia.destino}</p>
                            <p><strong>Estado Actual:</strong> <span class="badge ${getEstadoBadgeClass(guia.estado)}">${getEstadoNombre(guia.estado)}</span></p>
                            <hr>
                        </div>
                        <h6>Registro de Cambios:</h6>
                        <div class="table-responsive">
                            <table class="table table-striped">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Estado</th>
                                        <th>Fecha y Hora</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${guia.historial.map((entry, index) => `
                                        <tr>
                                            <td>${index + 1}</td>
                                            <td><span class="badge ${getEstadoBadgeClass(entry.estado)}">${getEstadoNombre(entry.estado)}</span></td>
                                            <td>${entry.fecha}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const modalExistente = document.getElementById('historialModal');
    if (modalExistente) {
        modalExistente.remove();
    }
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    const modalElement = document.getElementById('historialModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
    
    modalElement.addEventListener('hidden.bs.modal', function() {
        this.remove();
        historialSeleccionado = null;
    });
}

function renderizarListaGuias(listaGuias = null) {
    const tbody = document.querySelector('.lista-guias__tbody');
    if (!tbody) return;
    
    const guiasAMostrar = listaGuias || guias;
    
    if (guiasAMostrar.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">No hay guías registradas.</td>
            </tr>
        `;
        return;
    }
    
    const guiasOrdenadas = [...guiasAMostrar].sort((a, b) => b.id - a.id);
    
    tbody.innerHTML = guiasOrdenadas.map(guia => `
        <tr>
            <td class="lista-guias__td"><strong>${guia.numeroGuia}</strong></td>
            <td class="lista-guias__td">
                <span class="badge ${getEstadoBadgeClass(guia.estado)}">
                    ${getEstadoNombre(guia.estado)}
                </span>
            </td>
            <td class="lista-guias__td">${guia.origen}</td>
            <td class="lista-guias__td">${guia.destino}</td>
            <td class="lista-guias__td">${formatearFecha(guia.ultimaActualizacion)}</td>
            <td class="lista-guias__td">
                <button class="btn btn-sm btn-primary lista-guias__button" 
                        onclick="actualizarEstadoGuia(${guia.id})"
                        ${guia.estado === 'entregado' ? 'disabled' : ''}>
                    ${guia.estado === 'entregado' ? 'Entregado' : 'Actualizar'}
                </button>
                <button class="btn btn-sm btn-secondary lista-guias__button" 
                        onclick="mostrarHistorial(${guia.id})">
                    Historial
                </button>
            </td>
        </tr>
    `).join('');
}

function actualizarPanelEstado() {
    const totalActivas = guias.filter(g => g.estado === 'pendiente' || g.estado === 'transito').length;
    const enTransito = guias.filter(g => g.estado === 'transito').length;
    const entregadas = guias.filter(g => g.estado === 'entregado').length;
    
    const elementos = document.querySelectorAll('.estado-general__estado-item');
    if (elementos.length >= 3) {
        elementos[0].innerHTML = `<strong>Total de Guías Activas:</strong> ${totalActivas}`;
        elementos[1].innerHTML = `<strong>Guías en Tránsito:</strong> ${enTransito}`;
        elementos[2].innerHTML = `<strong>Guías Entregadas:</strong> ${entregadas}`;
    }
}

function getEstadoNombre(estado) {
    const nombres = {
        'pendiente': 'Pendiente',
        'transito': 'En Tránsito',
        'entregado': 'Entregado'
    };
    return nombres[estado] || estado;
}

function getEstadoBadgeClass(estado) {
    const clases = {
        'pendiente': 'bg-warning text-dark',
        'transito': 'bg-primary',
        'entregado': 'bg-success'
    };
    return clases[estado] || 'bg-secondary';
}

function obtenerFechaHoraActual() {
    const ahora = new Date();
    const año = ahora.getFullYear();
    const mes = String(ahora.getMonth() + 1).padStart(2, '0');
    const dia = String(ahora.getDate()).padStart(2, '0');
    const horas = String(ahora.getHours()).padStart(2, '0');
    const minutos = String(ahora.getMinutes()).padStart(2, '0');
    const segundos = String(ahora.getSeconds()).padStart(2, '0');
    return `${año}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;
}

function formatearFecha(fechaStr) {
    if (!fechaStr) return 'N/A';
    const partes = fechaStr.split(' ');
    const fecha = partes[0];
    const hora = partes[1] || '';
    if (fecha) {
        const [año, mes, dia] = fecha.split('-');
        return `${dia}/${mes}/${año} ${hora}`;
    }
    return fechaStr;
}

function limpiarFormulario() {
    document.getElementById('num-guia').value = '';
    document.getElementById('origen').value = '';
    document.getElementById('destino').value = '';
    document.getElementById('destinatario').value = '';
    document.getElementById('fecha').value = '';
    document.getElementById('estado').value = 'pendiente';
}

function mostrarMensajeError(mensaje) {
    mostrarMensaje(mensaje, 'danger');
}

function mostrarMensajeExito(mensaje) {
    mostrarMensaje(mensaje, 'success');
}

function mostrarMensaje(mensaje, tipo = 'info') {
    const mensajesAnteriores = document.querySelectorAll('.mensaje-flotante');
    mensajesAnteriores.forEach(el => el.remove());
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${tipo} alert-dismissible fade show mensaje-flotante`;
    alertDiv.role = 'alert';
    alertDiv.style.position = 'fixed';
    alertDiv.style.top = '20px';
    alertDiv.style.right = '20px';
    alertDiv.style.zIndex = '9999';
    alertDiv.style.maxWidth = '400px';
    alertDiv.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    
    const mensajes = mensaje.split('\n');
    const contenido = mensajes.map(m => `<div>${m}</div>`).join('');
    
    alertDiv.innerHTML = `
        ${contenido}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.classList.remove('show');
            setTimeout(() => alertDiv.remove(), 300);
        }
    }, 5000);
}

function actualizarTodo() {
    renderizarListaGuias();
    actualizarPanelEstado();
}

function configurarEventos() {
    const formRegistro = document.querySelector('.registro__form');
    if (formRegistro) {
        formRegistro.addEventListener('submit', registrarGuia);
    }
    
    const btnBuscar = document.querySelector('.buscar__button');
    if (btnBuscar) {
        btnBuscar.addEventListener('click', buscarGuia);
    }
    
    const inputBuscar = document.getElementById('buscar-guia');
    if (inputBuscar) {
        inputBuscar.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                buscarGuia();
            }
        });
    }
}

function init() {
    inicializarDatos();
    
    configurarEventos();
    
    console.log('🐕 Hound Express - Sistema iniciado correctamente');
    console.log(`📦 ${guias.length} guías cargadas`);
}


document.addEventListener('DOMContentLoaded', init);


window.actualizarEstadoGuia = actualizarEstadoGuia;
window.mostrarHistorial = mostrarHistorial;
window.buscarGuia = buscarGuia;