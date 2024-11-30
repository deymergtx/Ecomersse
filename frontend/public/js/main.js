document.addEventListener('DOMContentLoaded', () => {
  /**
   * Verifica la validez del token almacenado en localStorage.
   */
  const token = localStorage.getItem('token');

  if (!token) {
    showAlertAndRedirect('Debe iniciar sesión primero.', '/login');
    return;
  }

  /**
   * Llama al panel de administración con el token del usuario.
   */
  fetchPanelData(token)
    .then(data => renderContent(data))
    .catch(error => handleFetchError(error));
});

/**
 * Muestra un mensaje de alerta y redirige al usuario a otra página.
 * @param {string} message - Mensaje de alerta a mostrar.
 * @param {string} redirectUrl - URL a la cual redirigir al usuario.
 */
function showAlertAndRedirect(message, redirectUrl) {
  alert(message);
  window.location.href = redirectUrl;
}

/**
 * Realiza una solicitud GET para obtener datos del panel de administración.
 * @param {string} token - Token de autorización del usuario.
 * @returns {Promise<string>} Respuesta en texto del servidor.
 */
async function fetchPanelData(token) {
  const response = await fetch('/panel', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('token'); // Elimina el token almacenado si es inválido
      throw new Error('Token inválido o sesión expirada.');
    }
    throw new Error('Acceso denegado');
  }

  return await response.text();
}

/**
 * Renderiza el contenido del panel en el cuerpo del documento.
 * @param {string} data - HTML devuelto por el servidor.
 */
function renderContent(data) {
  document.body.innerHTML = data;
}

/**
 * Maneja errores ocurridos durante la solicitud fetch.
 * @param {Error} error - Objeto de error capturado.
 */
function handleFetchError(error) {
  console.error('Error:', error);
  alert(error.message || 'Error al acceder al panel de administración.');
  window.location.href = '/login';
}
