/**
 * Utilidad para formatear respuestas de endpoints de manera consistente
 * Estructura estándar: { status, message, data }
 */

/**
 * Genera una respuesta de éxito
 * @param {string} message - Mensaje descriptivo de la operación exitosa
 * @param {*} data - Datos a retornar (opcional)
 * @returns {Object} Objeto con formato estándar de respuesta
 */
const successResponse = (message, data = null) => {
    return {
        status: 1,
        message: message,
        data: data
    };
};

/**
 * Genera una respuesta de error
 * @param {string} message - Mensaje descriptivo del error
 * @param {*} data - Datos adicionales sobre el error (opcional)
 * @returns {Object} Objeto con formato estándar de respuesta
 */
const errorResponse = (message, data = null) => {
    return {
        status: 0,
        message: message,
        data: data
    };
};

/**
 * Envía una respuesta de éxito HTTP
 * @param {Object} res - Objeto response de Express
 * @param {number} statusCode - Código de estado HTTP (por defecto 200)
 * @param {string} message - Mensaje descriptivo
 * @param {*} data - Datos a retornar (opcional)
 */
const sendSuccess = (res, statusCode = 200, message, data = null) => {
    return res.status(statusCode).json(successResponse(message, data));
};

/**
 * Envía una respuesta de error HTTP
 * @param {Object} res - Objeto response de Express
 * @param {number} statusCode - Código de estado HTTP (por defecto 400)
 * @param {string} message - Mensaje descriptivo del error
 * @param {*} data - Datos adicionales sobre el error (opcional)
 */
const sendError = (res, statusCode = 400, message, data = null) => {
    return res.status(statusCode).json(errorResponse(message, data));
};

export {
    successResponse,
    errorResponse,
    sendSuccess,
    sendError
};
