/**
 * Sistema de Registro por DNI - FIREBASE v7.0
 * Casino Magic - Eventos
 * Optimizado para uso desde TABLET
 * 
 * FLUJO NUEVO:
 * 1. Pantalla DNI → Validación argentina local
 * 2. Pantalla Formulario → Completar datos  
 * 3. Al enviar → Firebase verifica duplicados Y registra
 * 
 * MEJORAS: Firebase automático, detección de evento activo, cache agresivo
 */

// DEBUG_MODE ya está definido en firebase-db.js
// No redeclarar para evitar conflictos
function debugLog(...args) {
    if (typeof DEBUG_MODE !== 'undefined' && DEBUG_MODE) console.log(...args);
}

// Variables esenciales
let currentDni = null;
let elements = {};
let eventoActual = null;
let usingFirebase = false;

// Pantallas
const SCREENS = {
    DNI_CHECK: 'dniScreen',
    REGISTRATION: 'registrationScreen',
    ALREADY_REGISTERED: 'alreadyRegisteredScreen'
};

// Detección de dispositivos móviles
const DEVICE_INFO = {
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    hasTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent),
    isAndroid: /Android/.test(navigator.userAgent),
    canCloseWindow: false // Se determinará dinámicamente
};

// ===== SANITIZACIÓN DE INPUTS =====
/**
 * Sanitiza inputs para prevenir ataques XSS y código malicioso
 * @param {string} input - El texto a sanitizar
 * @returns {string} - Texto limpio y seguro
 */
function sanitizeInput(input) {
    if (typeof input !== 'string') return input;

    return input
        .trim()                          // Eliminar espacios al inicio/fin
        .replace(/[<>]/g, '')            // Eliminar < y > (tags HTML)
        .replace(/javascript:/gi, '')    // Eliminar javascript:
        .replace(/on\w+=/gi, '')         // Eliminar onclick=, onerror=, onload=, etc.
        .replace(/&lt;/g, '')            // Eliminar &lt; (< codificado)
        .replace(/&gt;/g, '')            // Eliminar &gt; (> codificado)
        .replace(/&#/g, '')              // Eliminar entidades HTML numéricas
        .replace(/eval\(/gi, '')         // Eliminar eval(
        .replace(/expression\(/gi, '')   // Eliminar expression( (CSS)
        .slice(0, 500);                  // Limitar longitud máxima
}

/**
 * Sanitiza específicamente nombres (permite acentos y caracteres latinos)
 * @param {string} name - El nombre a sanitizar
 * @returns {string} - Nombre limpio
 */
function sanitizeName(name) {
    if (typeof name !== 'string') return '';

    return name
        .trim()
        .replace(/[<>]/g, '')            // Eliminar tags
        .replace(/[0-9]/g, '')           // Eliminar números
        .replace(/javascript:/gi, '')    // Eliminar javascript:
        .replace(/on\w+=/gi, '')         // Eliminar event handlers
        .replace(/[^\w\sáéíóúÁÉÍÓÚñÑ]/g, '') // Solo letras, espacios y acentos
        .replace(/\s+/g, ' ')            // Normalizar espacios múltiples
        .slice(0, 100);                  // Limitar longitud
}

/**
 * Sanitiza emails
 * @param {string} email - El email a sanitizar
 * @returns {string} - Email limpio
 */
function sanitizeEmail(email) {
    if (typeof email !== 'string') return '';

    return email
        .trim()
        .toLowerCase()                   // Convertir a minúsculas
        .replace(/[<>]/g, '')            // Eliminar tags
        .replace(/javascript:/gi, '')    // Eliminar javascript:
        .replace(/on\w+=/gi, '')         // Eliminar event handlers
        .replace(/\s/g, '')              // Eliminar espacios
        .slice(0, 100);                  // Limitar longitud
}

/**
 * Sanitiza teléfonos (solo números y guiones)
 * @param {string} phone - El teléfono a sanitizar
 * @returns {string} - Teléfono limpio
 */
function sanitizePhone(phone) {
    if (typeof phone !== 'string') return '';

    return phone
        .trim()
        .replace(/[^\d\-\s]/g, '')       // Solo números, guiones y espacios
        .replace(/\s+/g, '')             // Eliminar espacios
        .slice(0, 20);                   // Limitar longitud
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function () {
    initializeElements();
    initializeFirebase();
    setupEventListeners();
    showScreen(SCREENS.DNI_CHECK);
    elements.dniInput?.focus();
});

// Inicializar Firebase y detectar evento activo
async function initializeFirebase() {
    try {
        if (window.FirebaseDB && FirebaseDB.initFirestore()) {
            debugLog('✅ Firebase inicializado');
            usingFirebase = true;

            // Detectar evento activo
            const evento = await FirebaseDB.getEventoActivo();
            if (evento) {
                eventoActual = evento;
                FirebaseDB.setEventoActual(evento.id);
                debugLog('✅ Evento activo:', evento.nombre);

                // Mostrar nombre del evento en la página
                const eventoNombreElement = document.getElementById('eventoNombre');
                if (eventoNombreElement) {
                    eventoNombreElement.textContent = `🎯 ${evento.nombre}`;
                    eventoNombreElement.style.color = '#161337';
                    eventoNombreElement.style.fontWeight = '600';
                }
            } else {
                console.warn('⚠️ No hay eventos activos');
                // Fallback: usar evento por defecto
                eventoActual = { id: 'evento-default', nombre: 'Evento Principal' };
                FirebaseDB.setEventoActual('evento-default');

                // Mostrar mensaje de evento por defecto
                const eventoNombreElement = document.getElementById('eventoNombre');
                if (eventoNombreElement) {
                    eventoNombreElement.textContent = '🎯 Evento Principal';
                    eventoNombreElement.style.color = '#666';
                }
            }
        } else {
            console.warn('⚠️ Firebase no disponible, usando fallback');
            usingFirebase = false;

            // Ocultar elemento de nombre de evento si no hay Firebase
            const eventoNombreElement = document.getElementById('eventoNombre');
            if (eventoNombreElement) {
                eventoNombreElement.style.display = 'none';
            }
        }
    } catch (error) {
        console.error('❌ Error inicializando Firebase:', error);
        usingFirebase = false;

        // Mostrar error discretamente
        const eventoNombreElement = document.getElementById('eventoNombre');
        if (eventoNombreElement) {
            eventoNombreElement.textContent = '';
            eventoNombreElement.style.display = 'none';
        }
    }
}

// Elementos del DOM
function initializeElements() {
    elements = {
        dniInput: document.getElementById('dniInput'),
        checkDniBtn: document.getElementById('checkDniBtn'),
        displayDni: document.getElementById('displayDni'),
        registrationForm: document.getElementById('registrationForm'),
        nombreCompletoInput: document.getElementById('nombreCompletoInput'),
        fechaNacimientoInput: document.getElementById('fechaNacimientoInput'),
        emailInput: document.getElementById('emailInput'),
        telefonoInput: document.getElementById('telefonoInput'),
        participantConfirms: document.getElementById('participantConfirms'),
        submitBtn: document.getElementById('submitBtn'),
        backBtn: document.getElementById('backBtn'),
        existingParticipantName: document.getElementById('existingParticipantName'),
        existingParticipantDni: document.getElementById('existingParticipantDni'),
        backToStartBtn: document.getElementById('backToStartBtn'),
        message: document.getElementById('message')
    };
}

// ===== NAVEGACIÓN =====
function showScreen(screenName) {
    // Ocultar todas las pantallas
    Object.values(SCREENS).forEach(screen => {
        const element = document.getElementById(screen);
        if (element) element.style.display = 'none';
    });

    // Mostrar pantalla solicitada
    const targetScreen = document.getElementById(screenName);
    if (targetScreen) targetScreen.style.display = 'block';

    // Control del header
    document.body.classList.toggle('hide-header', screenName !== SCREENS.DNI_CHECK);

    clearMessage();
}

function goToRegistrationForm(dni) {
    currentDni = dni;
    elements.displayDni.textContent = dni;
    showScreen(SCREENS.REGISTRATION);
    setTimeout(() => elements.nombreCompletoInput?.focus(), 100);
}

function goToAlreadyRegistered(data) {
    elements.existingParticipantName.textContent = data.nombre || data.nombreCompleto || '';
    elements.existingParticipantDni.textContent = `DNI: ${data.dni}`;
    showScreen(SCREENS.ALREADY_REGISTERED);
}

function goBackToDniCheck() {
    elements.registrationForm?.reset();
    if (elements.dniInput) elements.dniInput.value = '';
    currentDni = null;
    showScreen(SCREENS.DNI_CHECK);
    setTimeout(() => elements.dniInput?.focus(), 100);
}

// ===== EVENTOS =====
function setupEventListeners() {
    // DNI input - solo números
    elements.dniInput?.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 8);
    });

    // Enter en DNI input
    elements.dniInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleCheckDni();
    });

    // Botón continuar con DNI
    elements.checkDniBtn?.addEventListener('click', handleCheckDni);

    // Formulario de registro
    elements.registrationForm?.addEventListener('submit', handleRegistrationSubmit);

    // Botones de navegación
    elements.backBtn?.addEventListener('click', goBackToDniCheck);
    elements.backToStartBtn?.addEventListener('click', goBackToDniCheck);
}

// ===== VERIFICACIÓN DNI (SOLO VALIDACIÓN LOCAL) =====
async function handleCheckDni() {
    const dni = elements.dniInput?.value?.trim();

    if (!validateDniArgentino(dni)) {
        showMessage('Ingresá un DNI argentino válido (7-8 números).', 'error');
        return;
    }

    elements.checkDniBtn.disabled = true;
    elements.checkDniBtn.textContent = 'VALIDANDO...';

    // Verificación real en Firebase
    try {
        if (usingFirebase && window.FirebaseDB) {
            const result = await FirebaseDB.checkDniExists(dni);

            if (result.exists) {
                // Ya registrado -> Mostrar pantalla de error/aviso
                debugLog('⚠️ DNI ya registrado (Check inicial):', result.data);

                elements.checkDniBtn.disabled = false;
                elements.checkDniBtn.textContent = 'CONTINUAR';

                const existingData = result.data || {
                    dni: dni,
                    nombreCompleto: 'Participante',
                    nombre: 'Participante'
                };

                goToAlreadyRegistered(existingData);
                return;
            }
        }
    } catch (error) {
        console.error('❌ Error verificando DNI:', error);
        // En caso de error de red, permitimos continuar y validamos al final
        // o podríamos mostrar un error. Decisión: Fail open (mejor UX si hay mala señal)
    }

    // Si no está registrado o no pudimos verificar, avanzamos al formulario
    elements.checkDniBtn.disabled = false;
    elements.checkDniBtn.textContent = 'CONTINUAR';
    goToRegistrationForm(dni);
}

// ===== REGISTRO (VERIFICACIÓN Y REGISTRO EN UNA SOLA LLAMADA) =====
async function handleRegistrationSubmit(event) {
    event.preventDefault();

    if (!validatePersonalData()) return;

    // Los valores ya están sanitizados por validatePersonalData()
    const nombreCompleto = elements.nombreCompletoInput.value;
    const email = elements.emailInput.value;
    const telefono = elements.telefonoInput.value;

    debugLog('📝 Datos a enviar - nombreCompleto:', nombreCompleto);

    const data = {
        dni: currentDni,
        nombreCompleto: nombreCompleto,
        fechaNacimiento: elements.fechaNacimientoInput.value,
        email: email,
        telefono: telefono,
        confirma: elements.participantConfirms.checked
    };

    elements.submitBtn.disabled = true;
    elements.submitBtn.textContent = 'REGISTRANDO...';

    // Mostrar modal de carga
    showLoadingModal('Verificando tu DNI...', 'Validando que no esté registrado previamente.', 'verifying');

    try {
        // Esperar un momento para mostrar el primer estado
        await new Promise(resolve => setTimeout(resolve, 800));

        // Cambiar a estado de procesamiento
        updateLoadingModal('Procesando registro...', 'Guardando tu información en el sistema.', 'processing');

        // Una sola llamada que verifica duplicados Y registra
        const response = await sendRegistration(data);
        debugLog('🔍 Respuesta del servidor:', response);
        debugLog('🔍 Respuesta completa:', JSON.stringify(response, null, 2));

        // Ocultar modal de carga
        hideLoadingModal();

        // Manejar respuesta (compatible con Firebase y Google Sheets)
        if (response.success || response.status === 'SUCCESS') {
            debugLog('✅ Registro exitoso');
            clearMessage();
            showSuccessMessage(nombreCompleto);
        } else if (response.status === 'DUPLICATE') {
            // DNI ya registrado
            debugLog('⚠️ DNI duplicado');
            showMessage('Este DNI ya está registrado. Recordá que el ganador debe estar presente en el evento.', 'warning');
            // Compatibilidad con ambos formatos de respuesta
            const existingData = response.data || response.existingData || {
                dni: currentDni,
                nombreCompleto: 'Participante',
                nombre: 'Participante'
            };
            goToAlreadyRegistered(existingData);
        } else {
            debugLog('❌ Error en registro:', response);
            showMessage(response.message || 'Error al procesar el registro.', 'error');
        }
    } catch (error) {
        debugLog('❌ Error de conexión:', error);

        // Mostrar estado de error en el modal antes de ocultar
        updateLoadingModal('Error de conexión', 'No se pudo conectar con el servidor.', 'error');

        // Esperar un momento para que el usuario vea el error
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Ocultar modal de carga
        hideLoadingModal();

        showMessage('Error al procesar. Intentá nuevamente.', 'error');
    } finally {
        // Restaurar estado del botón
        elements.submitBtn.disabled = false;
        elements.submitBtn.textContent = 'REGISTRARSE';
    }
}

// ===== VALIDACIONES MEJORADAS =====
function validateDniArgentino(dni) {
    if (!dni || !/^\d{7,8}$/.test(dni)) return false;

    // Validación específica para DNI argentino
    const dniNum = parseInt(dni);

    // Rango válido para DNI argentino
    if (dniNum < 1000000 || dniNum > 99999999) return false;

    // Validaciones adicionales para DNI argentino
    // DNIs muy bajos o secuenciales suelen ser inválidos
    if (dniNum < 3000000) return false;

    // DNI no puede ser todos números iguales
    if (/^(\d)\1+$/.test(dni)) return false;

    return true;
}

// Validación de edad mínima (18 años)
function validateAge(fechaNacimiento) {
    if (!fechaNacimiento) {
        return {
            valid: false,
            message: 'Ingresá tu fecha de nacimiento.'
        };
    }

    const birthDate = new Date(fechaNacimiento);
    const today = new Date();

    // Calcular edad
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // Ajustar si aún no cumplió años este año
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    // Validar edad mínima de 18 años
    if (age < 18) {
        return {
            valid: false,
            message: 'Debés ser mayor de 18 años para participar.'
        };
    }

    // Validar que la fecha no sea futura
    if (birthDate > today) {
        return {
            valid: false,
            message: 'La fecha de nacimiento no puede ser futura.'
        };
    }

    // Validar que la edad sea razonable (menor a 120 años)
    if (age > 120) {
        return {
            valid: false,
            message: 'Por favor verificá la fecha de nacimiento ingresada.'
        };
    }

    return {
        valid: true,
        age: age
    };
}

function validatePersonalData() {
    const fields = [
        { element: elements.nombreCompletoInput, message: 'Ingresá tu nombre y apellido.' },
        { element: elements.fechaNacimientoInput, message: 'Ingresá tu fecha de nacimiento.' },
        { element: elements.emailInput, message: 'Ingresá un email válido.' },
        { element: elements.telefonoInput, message: 'Ingresá tu teléfono.' }
    ];

    for (const field of fields) {
        if (!field.element?.value?.trim()) {
            showMessage(field.message, 'error');
            field.element?.focus();
            return false;
        }
    }

    // Validar que tenga al menos nombre y apellido (mínimo 2 palabras)
    const nombreCompleto = elements.nombreCompletoInput.value.trim();
    if (nombreCompleto.split(' ').filter(word => word.length > 0).length < 2) {
        showMessage('Ingresá tu nombre y apellido completos.', 'error');
        elements.nombreCompletoInput.focus();
        return false;
    }

    if (!validateEmail(elements.emailInput.value)) {
        showMessage('Ingresá un email válido.', 'error');
        elements.emailInput.focus();
        return false;
    }
    // Validar edad mínima de 18 años
    const ageValidation = validateAge(elements.fechaNacimientoInput.value);
    if (!ageValidation.valid) {
        showErrorModal(ageValidation.message);
        elements.fechaNacimientoInput.focus();
        return false;
    }


    if (!elements.participantConfirms?.checked) {
        showErrorModal('Aceptá las bases y condiciones para continuar.');
        return false;
    }

    return true;
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ===== COMUNICACIÓN API SIMPLIFICADA =====
async function makeRequest(url, timeout = 5000) {
    return new Promise((resolve, reject) => {
        // Extraer el nombre del callback de la URL
        const callbackMatch = url.match(/callback=([^&]+)/);
        if (!callbackMatch) {
            reject(new Error('No se encontró callback en la URL'));
            return;
        }

        const callbackName = callbackMatch[1];
        const script = document.createElement('script');

        debugLog('🔗 Creando callback:', callbackName);

        const cleanup = () => {
            if (script.parentNode) {
                document.head.removeChild(script);
            }
            delete window[callbackName];
        };

        window[callbackName] = function (response) {
            debugLog('✅ Callback ejecutado:', callbackName, response);
            cleanup();
            resolve(response);
        };

        script.onerror = () => {
            console.error('❌ Error cargando script:', url);
            cleanup();
            reject(new Error('Error de red'));
        };

        script.src = url;
        document.head.appendChild(script);

        setTimeout(() => {
            if (window[callbackName]) {
                console.error('⏰ Timeout en callback:', callbackName);
                cleanup();
                reject(new Error('Timeout'));
            }
        }, timeout);
    });
}

// Función principal para registrar (incluye verificación de duplicados)
async function sendRegistration(data, retries = 2) {
    // Si Firebase está disponible, usarlo
    if (usingFirebase && window.FirebaseDB) {
        try {
            debugLog('🔥 Registrando con Firebase...');

            // Preparar datos - solo enviar campos que existen
            const registroData = {
                dni: data.dni,
                nombreCompleto: data.nombreCompleto,
                fechaNacimiento: data.fechaNacimiento,
                email: data.email,
                telefono: data.telefono,
                ipAddress: data.ipAddress || '0.0.0.0'
            };

            // Solo agregar fechaEvento y horaEvento si existen
            if (data.fechaEvento) registroData.fechaEvento = data.fechaEvento;
            if (data.horaEvento) registroData.horaEvento = data.horaEvento;

            const resultado = await FirebaseDB.createRegistro(registroData);

            debugLog('📋 Resultado Firebase:', resultado);
            return resultado;

        } catch (error) {
            console.error('❌ Error con Firebase:', error);
            throw error;
        }
    }

    // Fallback a Google Apps Script (código original mantenido por seguridad)
    console.warn('⚠️ Usando fallback a Google Sheets');
    return await sendRegistrationToGoogleSheets(data, retries);
}

// Fallback: Google Apps Script (código original)
async function sendRegistrationToGoogleSheets(data, retries = 2) {
    const CONFIG = window.APP_CONFIG || {
        apiUrl: 'https://script.google.com/macros/s/AKfycbwf-1NsI6gyUqR9_Bk_N5B06R9CiY05Rfn9K2xHao7UfZJS2e3OLlmAqONzBc9noo4A/exec'
    };

    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const callbackName = 'callback_' + Date.now();
            const requestData = {
                action: 'registrar',
                ...data
            };

            const params = new URLSearchParams(requestData);
            const url = `${CONFIG.apiUrl}?${params}&callback=${callbackName}`;

            return await makeRequest(url, 15000);
        } catch (error) {
            console.error('❌ Error en intento', attempt + 1, ':', error);
            if (attempt === retries) throw error;
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
}

// ===== MENSAJES =====
function showMessage(message, type = 'info') {
    if (elements.message) {
        elements.message.textContent = message;
        elements.message.className = `message ${type}`;
        elements.message.style.display = 'block';
    }
}

function clearMessage() {
    if (elements.message) {
        elements.message.style.display = 'none';
    }
}

// ===== PANTALLA DE ÉXITO =====
function showSuccessMessage(nombreCompleto) {
    debugLog('🎉 Mostrando modal de éxito para:', nombreCompleto);

    // Ocultar header
    document.body.classList.add('hide-header');

    // Crear el modal y agregarlo al body directamente
    const successModal = document.createElement('div');
    successModal.className = 'success-final-screen';
    successModal.innerHTML = `
        <div class="success-content">
            <div class="success-icon">
                <div class="checkmark-container">
                    <div class="checkmark">✓</div>
                </div>
            </div>
            <h2>Registro Exitoso</h2>
            <div class="success-details">
                <p><strong>${nombreCompleto}</strong></p>
                <p>Tu registro ha sido completado correctamente.</p>
            </div>
            <div class="success-actions">
                <button type="button" class="btn btn-success-primary" id="registerAnotherBtn" style="margin-bottom: 10px;">REGISTRAR OTRO</button>
                <button type="button" class="btn btn-success-secondary" id="closeSuccessBtn">FINALIZAR</button>
                <p style="margin-top: 10px; font-size: 0.9em; color: #666;">
                    ¡Registro completado! Al finalizar se cerrará la ventana o serás redirigido.
                </p>
            </div>
        </div>
    `;

    // Agregar al body
    document.body.appendChild(successModal);

    // Event listener para Registrar Otro
    successModal.querySelector('#registerAnotherBtn').addEventListener('click', () => {
        debugLog('🔄 Recargando para nuevo registro');
        window.location.reload();
    });

    // Event listener para Finalizar
    successModal.querySelector('#closeSuccessBtn').addEventListener('click', () => {
        debugLog('🎯 Botón FINALIZAR presionado');
        debugLog('📱 Dispositivo móvil:', DEVICE_INFO.isMobile);

        // Cambiar el contenido del modal mientras procesamos
        const modalContent = successModal.querySelector('.success-content');
        modalContent.innerHTML = `
            <div class="success-icon">
                <div class="checkmark-container">
                    <div class="checkmark">✓</div>
                </div>
            </div>
            <h2>¡Gracias por participar!</h2>
            <div class="success-details">
                <p>Redirigiendo...</p>
                <div class="loading-spinner" style="
                    width: 30px; 
                    height: 30px; 
                    border: 3px solid #f3f3f3; 
                    border-top: 3px solid #28a745; 
                    border-radius: 50%; 
                    animation: spin 1s linear infinite;
                    margin: 15px auto;
                "></div>
            </div>
        `;

        // Redirigir siempre a Casino Magic
        setTimeout(() => {
            debugLog('🌐 Redirigiendo a Casino Magic');
            window.location.href = 'https://casinomagic.com.ar/';
        }, 1500); // Dar tiempo para ver el mensaje de agradecimiento
    });

    // Auto-foco en el botón después de un momento
    setTimeout(() => {
        successModal.querySelector('#closeSuccessBtn').focus();
    }, 500);
}

// ===== MODAL DE CARGA =====
function showLoadingModal(title = 'Verificando datos...', message = 'Por favor espera mientras procesamos tu información', state = 'verifying') {
    const loadingModal = document.getElementById('loadingModal');
    const loadingTitle = document.getElementById('loadingTitle');
    const loadingMessage = document.getElementById('loadingMessage');
    const loadingContent = loadingModal?.querySelector('.loading-content');

    if (loadingModal && loadingTitle && loadingMessage && loadingContent) {
        loadingTitle.textContent = title;
        loadingMessage.textContent = message;

        // Limpiar estados anteriores
        loadingContent.classList.remove('verifying', 'processing', 'error');
        // Agregar nuevo estado
        loadingContent.classList.add(state);

        loadingModal.style.display = 'flex';

        // Prevenir scroll del body
        document.body.style.overflow = 'hidden';

        debugLog('🔄 Modal de carga mostrado:', title, `(${state})`);
    }
}

function hideLoadingModal() {
    const loadingModal = document.getElementById('loadingModal');

    if (loadingModal) {
        loadingModal.style.display = 'none';

        // Restaurar scroll del body
        document.body.style.overflow = '';

        debugLog('✅ Modal de carga oculto');
    }
}

function updateLoadingModal(title, message, state = 'processing') {
    const loadingTitle = document.getElementById('loadingTitle');
    const loadingMessage = document.getElementById('loadingMessage');
    const loadingModal = document.getElementById('loadingModal');
    const loadingContent = loadingModal?.querySelector('.loading-content');

    if (loadingTitle && loadingMessage && loadingContent) {
        // Animación suave al cambiar
        loadingTitle.style.opacity = '0.5';
        loadingMessage.style.opacity = '0.5';

        setTimeout(() => {
            loadingTitle.textContent = title;
            loadingMessage.textContent = message;

            // Cambiar estado visual
            loadingContent.classList.remove('verifying', 'processing', 'error');
            loadingContent.classList.add(state);

            // Restaurar opacidad
            loadingTitle.style.opacity = '1';
            loadingMessage.style.opacity = '1';
        }, 150);

        debugLog('🔄 Modal de carga actualizado:', title, `(${state})`);
    }
}

// ===== MODAL DE ERROR (Fecha inválida) =====
function showErrorModal(message) {
    // Si ya existe uno, removerlo
    const existingModal = document.getElementById('customErrorModal');
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.id = 'customErrorModal';
    modal.className = 'submission-loading'; // Reutilizamos estilos de overlay
    modal.style.display = 'flex';

    modal.innerHTML = `
        <div class="loading-content error-state" style="border-top: 5px solid #dc2626;">
             <div class="error-icon" style="font-size: 3.5rem; margin-bottom: 15px; animation: bounceIn 0.5s;">⚠️</div>
            <h2 style="color: #dc2626; margin-bottom: 10px;">Atención</h2>
            <p style="font-size: 1.1rem; color: #333;">${message}</p>
            <button type="button" class="btn" id="closeErrorModalBtn" style="
                margin-top: 25px; 
                background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
                box-shadow: 0 4px 10px rgba(220, 38, 38, 0.3);
                width: auto;
                min-width: 150px;
            ">ENTENDIDO</button>
        </div>
    `;

    document.body.appendChild(modal);

    // Animation
    const content = modal.querySelector('.loading-content');
    content.style.animation = 'slideInUp 0.3s ease-out';

    // Close handler
    const closeBtn = modal.querySelector('#closeErrorModalBtn');
    closeBtn.focus();

    closeBtn.addEventListener('click', () => {
        modal.style.opacity = '0';
        setTimeout(() => modal.remove(), 300);
    });
}


