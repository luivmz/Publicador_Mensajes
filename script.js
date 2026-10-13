/**
 * ==============================================================================
 * PUBLICADOR DE MENSAJES CON JAVASCRIPT ASÍNCRONO, FETCH Y DOM
 * Asignatura: Ingeniería Web · Trabajo Práctico
 * ==============================================================================
 * Este archivo implementa:
 *   1. Captura y escucha del evento submit mediante addEventListener().
 *   2. Prevención de recarga de página con event.preventDefault().
 *   3. Validación estricta de campos no vacíos con trim().
 *   4. Solicitud HTTP asíncrona mediante Fetch API con método POST.
 *   5. Encabezado 'Content-Type: application/json' y serialización con JSON.stringify().
 *   6. Control asíncrono con async/await y comprobación estricta de response.ok.
 *   7. Parseo del cuerpo con response.json().
 *   8. Manejo de estados de carga (deshabilitación de botón y spinner).
 *   9. Gestión robusta de excepciones con try...catch...finally.
 *  10. Renderizado seguro en el DOM empleando textContent para prevenir XSS.
 * ==============================================================================
 */

// --- 1. Referencias al DOM (Selección de Elementos) ---
const postForm = document.getElementById('post-form');
const titleInput = document.getElementById('post-title');
const bodyInput = document.getElementById('post-body');
const titleError = document.getElementById('title-error');
const bodyError = document.getElementById('body-error');
const submitBtn = document.getElementById('submit-btn');
const btnText = document.getElementById('btn-text');
const btnSpinner = document.getElementById('btn-spinner');
const resetBtn = document.getElementById('reset-btn');

// Elementos de Estado y Resultados
const statusContainer = document.getElementById('status-container');
const statusIcon = document.getElementById('status-icon');
const statusMessage = document.getElementById('status-message');

const emptyState = document.getElementById('empty-state');
const resultBox = document.getElementById('result-box');
const resId = document.getElementById('res-id');
const resTitle = document.getElementById('res-title');
const resBody = document.getElementById('res-body');
const resJson = document.getElementById('res-json');
const responseTimestamp = document.getElementById('response-timestamp');
const responseBadge = document.getElementById('response-badge');

// URL del Endpoint REST de prueba
const API_URL = 'https://jsonplaceholder.typicode.com/posts';

// --- 2. Funciones de Validación de Entradas (Paso 2) ---

/**
 * Valida que los campos no estén vacíos ni contengan únicamente espacios en blanco.
 * @returns {boolean} true si el formulario es válido, false en caso contrario.
 */
function validateInputs() {
  let isValid = true;

  // Limpieza de mensajes de error previos
  clearValidationErrors();

  const titleValue = titleInput.value.trim();
  const bodyValue = bodyInput.value.trim();

  // Validación del campo Título
  if (titleValue === '') {
    titleError.textContent = 'El título de la publicación es obligatorio.';
    titleInput.classList.add('is-invalid');
    isValid = false;
  } else if (titleValue.length < 3) {
    titleError.textContent = 'El título debe contener al menos 3 caracteres.';
    titleInput.classList.add('is-invalid');
    isValid = false;
  }

  // Validación del campo Contenido
  if (bodyValue === '') {
    bodyError.textContent = 'El contenido del mensaje no puede estar vacío.';
    bodyInput.classList.add('is-invalid');
    isValid = false;
  } else if (bodyValue.length < 5) {
    bodyError.textContent = 'El contenido debe contener al menos 5 caracteres.';
    bodyInput.classList.add('is-invalid');
    isValid = false;
  }

  return isValid;
}

/**
 * Limpia los estilos y textos de validación de los campos.
 */
function clearValidationErrors() {
  titleError.textContent = '';
  bodyError.textContent = '';
  titleInput.classList.remove('is-invalid');
  bodyInput.classList.remove('is-invalid');
}

// Limpiar error al momento en que el usuario empieza a escribir
titleInput.addEventListener('input', () => {
  if (titleInput.value.trim() !== '') {
    titleError.textContent = '';
    titleInput.classList.remove('is-invalid');
  }
});

bodyInput.addEventListener('input', () => {
  if (bodyInput.value.trim() !== '') {
    bodyError.textContent = '';
    bodyInput.classList.remove('is-invalid');
  }
});

// --- 3. Control del Estado de Carga y UI (Paso 5) ---

/**
 * Activa o desactiva la interfaz según el estado de procesamiento.
 * @param {boolean} isLoading - true mientras se procesa la petición HTTP.
 */
function setLoadingState(isLoading) {
  if (isLoading) {
    // Deshabilitar botón para prevenir envíos duplicados (Requisito 12 / 13)
    submitBtn.disabled = true;
    btnSpinner.classList.remove('hidden');
    btnText.textContent = 'Publicando...';

    // Mostrar estado de carga en el contenedor informativo
    showStatus('Enviando publicación a la API REST...', 'loading');
  } else {
    // Restablecer estado interactivo del botón (en el bloque finally)
    submitBtn.disabled = false;
    btnSpinner.classList.add('hidden');
    btnText.textContent = 'Publicar Mensaje';
  }
}

/**
 * Muestra un banner de notificación de estado.
 * @param {string} message - Texto informativo seguro.
 * @param {'loading'|'success'|'error'} type - Tipo de notificación.
 */
function showStatus(message, type) {
  statusContainer.className = `status-container ${type}`;
  statusMessage.textContent = message; // textContent para seguridad XSS

  if (type === 'loading') {
    statusIcon.innerHTML = `<span class="spinner" style="border-color: rgba(22,101,52,0.3); border-top-color: #166534;"></span>`;
  } else if (type === 'success') {
    statusIcon.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
  } else if (type === 'error') {
    statusIcon.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
  }

  statusContainer.classList.remove('hidden');
}

/**
 * Oculta el contenedor de notificaciones de estado.
 */
function hideStatus() {
  statusContainer.classList.add('hidden');
  statusContainer.className = 'status-container hidden';
}

// --- 4. Renderizado Dinámico de la Respuesta en el DOM (Paso 4 & 5) ---

/**
 * Presenta los datos devueltos por la API de forma segura.
 * @param {Object} data - Objeto JSON retornado por JSONPlaceholder.
 * @param {number} status - Código de estado HTTP devuelto (ej. 201).
 */
function renderSuccessResponse(data, status = 201) {
  // Ocultar estado vacío e ilustrar la tarjeta de resultados
  emptyState.classList.add('hidden');
  resultBox.classList.remove('hidden');

  // Asignar datos de manera segura utilizando textContent (Previene XSS)
  resId.textContent = `#${data.id !== undefined ? data.id : 'N/A'}`;
  resTitle.textContent = data.title || '';
  resBody.textContent = data.body || '';

  // Actualizar Badge HTTP y marca de tiempo
  responseBadge.textContent = `HTTP ${status} Created`;
  const now = new Date();
  responseTimestamp.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  // Mostrar el JSON serializado formateado para inspección técnica
  resJson.textContent = JSON.stringify(data, null, 2);

  // Mostrar alerta de éxito
  showStatus(`¡Publicación registrada exitosamente con el ID #${data.id}!`, 'success');
}

// --- 5. Lógica Asíncrona Principal: Manejador de Envío del Formulario (Pasos 1 a 5) ---

/**
 * Maneja el evento submit del formulario de manera asíncrona.
 * @param {Event} event - Evento del DOM.
 */
async function handleFormSubmit(event) {
  // 1. Evitar la recarga nativa de la página (Requisito 3)
  event.preventDefault();

  // 2. Validar campos antes de realizar la petición HTTP (Requisito 9)
  if (!validateInputs()) {
    showStatus('Por favor, corrige los campos requeridos antes de continuar.', 'error');
    return;
  }

  // 3. Extraer valores limpios con trim()
  const payload = {
    title: titleInput.value.trim(),
    body: bodyInput.value.trim(),
    userId: 1 // Convención estándar para JSONPlaceholder
  };

  // 4. Activar estado de carga y deshabilitar botón (Requisito 12)
  setLoadingState(true);

  try {
    // 5. Configurar y disparar petición asíncrona con fetch() (Pasos 3 y 4)
    const response = await fetch(API_URL, {
      method: 'POST', // Método HTTP requerido
      headers: {
        'Content-Type': 'application/json' // Cabecera MIME requerida
      },
      body: JSON.stringify(payload) // Serialización de objeto JavaScript a string JSON
    });

    // 6. Comprobación estricta de response.ok (Requisito 7)
    // Nota: Fetch NO rechaza la promesa ante códigos de error HTTP como 404 o 500.
    if (!response.ok) {
      throw new Error(`Error en el servidor: HTTP ${response.status} (${response.statusText || 'Error no especificado'})`);
    }

    // 7. Parsear la respuesta asíncrona en formato JSON (Requisito 8)
    const data = await response.json();

    // 8. Actualizar el DOM de forma dinámica y segura (Requisito 10 & 13)
    renderSuccessResponse(data, response.status);

    // 9. Limpiar los campos del formulario tras el éxito
    postForm.reset();
    clearValidationErrors();

  } catch (error) {
    // 10. Gestión de errores de red, HTTP o análisis de JSON (Requisito 11)
    console.error('Error durante la petición asíncrona:', error);

    // Identificar causa para presentar un mensaje amigable
    let userFriendlyMessage = 'Ocurrió un error inesperado al procesar la publicación.';
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      userFriendlyMessage = 'Error de conexión: No se pudo conectar con el servidor. Verifica tu conexión a Internet.';
    } else {
      userFriendlyMessage = error.message;
    }

    showStatus(userFriendlyMessage, 'error');

  } finally {
    // 11. Restablecer controles SIEMPRE, tanto si tuvo éxito como si ocurrió un error (Requisito 12)
    setLoadingState(false);
  }
}

// --- 6. Registro de Event Listeners ---

// Escuchar el evento 'submit' en el formulario HTML (Requisito 2)
postForm.addEventListener('submit', handleFormSubmit);

// Botón de Limpiar / Resetear
resetBtn.addEventListener('click', () => {
  postForm.reset();
  clearValidationErrors();
  hideStatus();
});
