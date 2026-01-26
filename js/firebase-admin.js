/**
 * Módulo de Administración Firebase
 * Funciones específicas para el panel de administración
 * Autenticación: Firebase Authentication (Email/Password)
 */

// IMPORTANTE: Este sistema usa Firebase Authentication
// NO hay contraseñas en el código por seguridad
// Configurar usuarios en: Firebase Console → Authentication → Users

/**
 * Login con Firebase Authentication
 */
async function loginWithFirebase(email, password) {
    try {
        const auth = firebase.auth();
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        console.log('✅ Login exitoso:', userCredential.user.email);
        return true;
    } catch (error) {
        console.error('❌ Error login:', error.code, error.message);
        throw error;
    }
}

/**
 * Verificar credenciales de administrador
 * IMPORTANTE: Configurar usuario admin en Firebase Console primero
 */
function verificarAdmin(password) {
    // Sistema legacy - debe migrar a Firebase Auth
    // Por ahora retorna false para forzar uso de Firebase Auth
    console.warn('⚠️ Sistema legacy - Usar Firebase Authentication');
    return false;
}

/**
 * Guardar sesión de admin
 */
function guardarSesionAdmin() {
    sessionStorage.setItem('admin_logged', 'true');
    sessionStorage.setItem('admin_logged_at', Date.now());
}

/**
 * Verificar si hay sesión activa
 */
function verificarSesion() {
    const isLogged = sessionStorage.getItem('admin_logged') === 'true';
    const loggedAt = parseInt(sessionStorage.getItem('admin_logged_at') || '0');
    const sessionTimeout = 4 * 60 * 60 * 1000; // 4 horas
    
    if (isLogged && (Date.now() - loggedAt) < sessionTimeout) {
        return true;
    }
    
    // Sesión expirada
    if (isLogged) {
        cerrarSesion();
    }
    return false;
}

/**
 * Verificar estado de Firebase Auth
 */
function verificarFirebaseAuth() {
    const auth = firebase.auth();
    return auth.currentUser !== null;
}

/**
 * Cerrar sesión
 */
async function cerrarSesion() {
    try {
        await firebase.auth().signOut();
    } catch (error) {
        console.error('Error al cerrar sesión Firebase:', error);
    }
    sessionStorage.removeItem('admin_logged');
    sessionStorage.removeItem('admin_logged_at');
    window.location.reload();
}

/**
 * Verificar y corregir si hay múltiples eventos activos
 * Solo debe haber 1 evento activo a la vez
 */
async function verificarYCorregirEventosActivos() {
    try {
        const db = firebase.firestore();
        const eventosActivos = await db.collection('eventos').where('activo', '==', true).get();
        
        if (eventosActivos.size > 1) {
            console.warn(`⚠️ Se encontraron ${eventosActivos.size} eventos activos. Corrigiendo...`);
            
            // Mantener solo el más reciente activo
            const eventos = [];
            eventosActivos.forEach(doc => {
                eventos.push({
                    id: doc.id,
                    ref: doc.ref,
                    actualizadoEn: doc.data().actualizadoEn?.toDate() || new Date(0)
                });
            });
            
            // Ordenar por fecha de actualización (más reciente primero)
            eventos.sort((a, b) => b.actualizadoEn - a.actualizadoEn);
            
            // Desactivar todos excepto el primero
            const batch = db.batch();
            for (let i = 1; i < eventos.length; i++) {
                batch.update(eventos[i].ref, { activo: false });
            }
            await batch.commit();
            
            console.log(`✅ Corregido: Se mantuvo activo ${eventos[0].id} y se desactivaron ${eventos.length - 1} eventos`);
            return eventos[0].id; // Retorna el ID del evento que quedó activo
        }
        
        return null; // No hubo correcciones
    } catch (error) {
        console.error('❌ Error verificando eventos activos:', error);
        return null;
    }
}

/**
 * Obtener todos los eventos
 */
async function getAllEventos() {
    try {
        const snapshot = await firebase.firestore()
            .collection('eventos')
            .orderBy('actualizadoEn', 'desc')
            .get();
        
        const eventos = [];
        snapshot.forEach(doc => {
            eventos.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        return eventos;
    } catch (error) {
        console.error('❌ Error obteniendo eventos:', error);
        throw error;
    }
}

/**
 * Activar/desactivar evento
 */
async function toggleEventoActivo(eventoId, activo) {
    try {
        const db = firebase.firestore();
        
        // Si se está activando, desactivar todos los demás primero
        if (activo) {
            const eventos = await db.collection('eventos').where('activo', '==', true).get();
            const batch = db.batch();
            eventos.forEach(doc => {
                batch.update(doc.ref, { activo: false });
            });
            await batch.commit();
        }
        
        // Actualizar el evento seleccionado
        await db.collection('eventos').doc(eventoId).update({
            activo: activo,
            actualizadoEn: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        console.log(`✅ Evento ${eventoId} ${activo ? 'activado' : 'desactivado'}`);
        return true;
    } catch (error) {
        console.error('❌ Error actualizando evento:', error);
        throw error;
    }
}

/**
 * Eliminar evento
 */
async function eliminarEvento(eventoId) {
    try {
        const db = firebase.firestore();
        
        // Contar registros
        const registros = await db.collection('eventos')
            .doc(eventoId)
            .collection('registros')
            .limit(1)
            .get();
        
        if (!registros.empty) {
            throw new Error('No se puede eliminar un evento con registros. Desactívalo en su lugar.');
        }
        
        await db.collection('eventos').doc(eventoId).delete();
        console.log('✅ Evento eliminado:', eventoId);
        return true;
    } catch (error) {
        console.error('❌ Error eliminando evento:', error);
        throw error;
    }
}

/**
 * Obtener estadísticas de un evento
 */
async function getEstadisticasEvento(eventoId) {
    try {
        const db = firebase.firestore();
        const snapshot = await db.collection('eventos')
            .doc(eventoId)
            .collection('registros')
            .get();
        
        let total = 0;
        let sincronizados = 0;
        let activos = 0;
        
        snapshot.forEach(doc => {
            total++;
            const data = doc.data();
            if (data.syncedToSheets) sincronizados++;
            if (data.estado === 'ACTIVO') activos++;
        });
        
        return {
            total,
            sincronizados,
            pendientesSincronizacion: total - sincronizados,
            activos,
            inactivos: total - activos
        };
    } catch (error) {
        console.error('❌ Error obteniendo estadísticas:', error);
        throw error;
    }
}

/**
 * Obtener todos los registros de un evento
 */
async function getAllRegistrosEvento(eventoId, orderBy = 'timestamp', orderDir = 'desc') {
    try {
        const snapshot = await firebase.firestore()
            .collection('eventos')
            .doc(eventoId)
            .collection('registros')
            .orderBy(orderBy, orderDir)
            .get();
        
        const registros = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            registros.push({
                id: doc.id,
                ...data,
                timestamp: data.timestamp?.toDate ? data.timestamp.toDate() : data.timestamp
            });
        });
        
        return registros;
    } catch (error) {
        console.error('❌ Error obteniendo registros:', error);
        throw error;
    }
}

/**
 * Exportar registros a CSV
 */
function exportarCSV(registros, nombreEvento) {
    const headers = [
        'DNI',
        'Nombre Completo',
        'Fecha Nacimiento',
        'Email',
        'Teléfono',
        'Fecha Evento',
        'Hora Evento',
        'Fecha Registro',
        'Estado',
        'IP',
        'Sincronizado'
    ];
    
    const rows = registros.map(r => [
        r.dni,
        r.nombreCompleto,
        r.fechaNacimiento || '',
        r.email || '',
        r.telefono || '',
        r.fechaEvento || '',
        r.horaEvento || '',
        r.timestamp ? new Date(r.timestamp).toLocaleString() : '',
        r.estado || 'ACTIVO',
        r.ipAddress || '',
        r.syncedToSheets ? 'Sí' : 'No'
    ]);
    
    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
        csv += row.map(field => `"${field}"`).join(',') + '\n';
    });
    
    // Descargar archivo
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `registros_${nombreEvento}_${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * Buscar registros por DNI en todos los eventos
 */
async function buscarPorDNI(dni) {
    try {
        const snapshot = await firebase.firestore()
            .collectionGroup('registros')
            .where('dni', '==', dni)
            .get();
        
        const resultados = [];
        snapshot.forEach(doc => {
            resultados.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        return resultados;
    } catch (error) {
        console.error('❌ Error buscando DNI:', error);
        throw error;
    }
}

// Exportar funciones
window.FirebaseAdmin = {
    verificarAdmin,
    guardarSesionAdmin,
    verificarSesion,
    cerrarSesion,
    verificarYCorregirEventosActivos,
    getAllEventos,
    toggleEventoActivo,
    eliminarEvento,
    getEstadisticasEvento,
    getAllRegistrosEvento,
    exportarCSV,
    buscarPorDNI
};
