# 🔧 Guía de Soporte Técnico

## 🆘 Soluciones Rápidas

### Problema: No carga la página

**Síntomas:**
- Página en blanco
- Error de conexión
- "No se puede acceder"

**Soluciones:**

1. **Verificar WiFi:**
   - Ver que tablet/PC esté conectado
   - Probar abrir otra página web (google.com)

2. **Verificar URL:**
   - Revisar que URL esté correcta
   - Sin espacios extras
   - Con https:// o http://

3. **Limpiar cache:**
   - Chrome: Ctrl + Shift + Delete → Limpiar caché
   - Recargar: F5 o Ctrl + R

4. **Probar otro navegador:**
   - Si usás Chrome, probar Firefox
   - Si usás Safari, probar Chrome

---

### Problema: "Error al registrar"

**Causas comunes:**
- Sin conexión internet
- Firebase caído (raro)
- Evento no activo

**Soluciones:**

1. **Verificar evento activo:**
   - Ir al panel admin
   - Ver que evento esté marcado como "Activo"
   - Solo UN evento debe estar activo

2. **Verificar Firebase:**
   - Ir a: https://status.firebase.google.com/
   - Ver si hay problemas reportados

3. **Verificar reglas Firestore:**
   - Firebase Console → Firestore → Reglas
   - Verificar que estén publicadas
   - Último deploy: debe ser reciente

---

### Problema: DNI duplicado no se detecta

**Causas:**
- Cache muy largo
- Evento incorrecto seleccionado

**Soluciones:**

1. **Limpiar cache de evento:**
   ```
   Consola del navegador (F12):
   localStorage.removeItem('cmn_evento_activo');
   localStorage.removeItem('cmn_evento_timestamp');
   location.reload();
   ```

2. **Verificar en Firebase:**
   - Firebase Console → Firestore
   - Ver colección: eventos/[evento-id]/registros
   - Buscar DNI manualmente

---

### Problema: Admin panel no acepta password

**Causas:**
- Password incorrecta
- Mayúsculas/minúsculas
- Sesión expirada

**Soluciones:**

1. **Verificar password exacta:**
   - Usar credenciales configuradas en Firebase Console
   - Copiar y pegar exactamente

2. **Cambiar password:**
   - Editar archivo: `js/firebase-admin.js`
   - Sistema ahora usa Firebase Authentication (sin contraseña hardcoded)
   - Cambiar por nueva
   - Guardar archivo

---

### Problema: No aparece nombre de evento

**Causas:**
- No hay evento activo
- Cache desactualizado

**Soluciones:**

1. **Activar evento:**
   - Panel admin → Activar evento
   - Refrescar página principal

2. **Limpiar cache:**
   - Recargar página: Ctrl + F5
   - O limpiar cache manual (ver arriba)

3. **Esperar 30 minutos:**
   - Cache se actualiza automáticamente

---

### Problema: Export CSV no funciona

**Causas:**
- Navegador bloqueando descarga
- No hay registros

**Soluciones:**

1. **Verificar que hay registros:**
   - Ver lista de registros
   - Debe haber al menos 1

2. **Permitir descargas:**
   - Chrome: Settings → Downloads
   - Verificar permisos

3. **Probar otro navegador:**
   - Firefox suele tener menos bloqueos

---

## 🔥 Firebase Console - Tareas Comunes

### Acceso:
```
URL: https://console.firebase.google.com/project/cmn-registrosqr
```

### Ver todos los registros:

1. Firestore Database
2. Colección: `eventos`
3. Click en evento específico
4. Subcolección: `registros`
5. Ahí están todos los DNIs

### Ver reglas de seguridad:

1. Firestore Database
2. Pestaña "Rules"
3. Ver reglas actuales
4. Botón "Publish" si cambiaste algo

### Ver uso de cuotas:

1. Usage and billing
2. Ver lecturas/escrituras del día
3. Límite free: 50,000 lecturas/día

### Backup manual:

1. Firestore Database
2. Menú (⋮) → Import/Export
3. Export data
4. Seleccionar Cloud Storage bucket
5. Exportar

---

## 💻 Comandos Útiles

### Ver reglas activas:
```bash
firebase firestore:rules:get
```

### Deployar reglas:
```bash
firebase deploy --only firestore:rules
```

### Ver logs:
```bash
firebase firestore:logs
```

### Iniciar servidor local:
```bash
python -m http.server 8888
```

---

## 🔍 Debugging

### Activar modo DEBUG:

En archivos:
- `js/main-dni-optimized.js`
- `js/firebase-db.js`

Cambiar línea:
```
const DEBUG_MODE = false;
```

Por:
```
const DEBUG_MODE = true;
```

Guardar y recargar. Verás logs en consola (F12).

**⚠️ No olvidar volver a false después.**

---

## 📊 Verificar Estado del Sistema

### Checklist rápido:

1. **Firebase Online:**
   - https://status.firebase.google.com/
   - Todo en verde

2. **Evento Activo:**
   - Panel admin → Ver evento marcado "Activo"
   - Solo UNO activo

3. **Conexión Internet:**
   - Tablet/PC conectado a WiFi
   - Abrir google.com funciona

4. **URLs Correctas:**
   - Formulario: /index.html
   - Admin: /admin.html

5. **Cache Actualizado:**
   - Última actualización hace menos de 30 min
   - O forzar recarga: Ctrl + F5

---

## 🚨 Emergencias

### Sistema completamente caído:

1. **Backup en papel:**
   - Anotar registros manualmente
   - Formato: DNI, Nombre, Apellido, Email, Tel, Fecha Nac

2. **Contactar soporte Firebase:**
   - support.google.com/firebase

3. **Restaurar desde backup:**
   - Firebase Console → Import/Export
   - Importar último backup

### Perdida de datos:

1. **Verificar Firestore:**
   - Datos están en nube
   - No se pierden fácilmente

2. **Restaurar backup:**
   - Usar Export anterior
   - Importar desde Cloud Storage

3. **Verificar con timestamp:**
   - Cada registro tiene hora exacta
   - Comparar con backup en papel

---

## 📞 Contactos

### Firebase Support:
- https://firebase.google.com/support

### Google Cloud Status:
- https://status.cloud.google.com/

### Documentación:
- https://firebase.google.com/docs/firestore

---

## 🔐 Seguridad

### Si password comprometida:

1. **Cambiar inmediatamente:**
   - Editar `js/firebase-admin.js`
   - Nueva password fuerte

2. **Verificar registros:**
   - Firebase Console
   - Ver si hay registros extraños

3. **Revisar actividad:**
   - Firebase Console → Usage
   - Ver lecturas/escrituras anormales

### Si alguien accedió sin permiso:

1. **Cambiar password**
2. **Revisar logs de Firebase**
3. **Verificar integridad de datos**
4. **Considerar regenerar credenciales API**

---

## 📝 Registro de Incidentes

Anotar siempre:

- **Fecha y hora**
- **Problema exacto**
- **Qué se hizo para solucionarlo**
- **Resultado**

Esto ayuda para futuros problemas similares.

---

## ✅ Mantenimiento Preventivo

### Semanal:

- [ ] Verificar Firebase usage (no cerca de límites)
- [ ] Exportar backup de Firestore
- [ ] Verificar eventos antiguos (archivar si necesario)

### Mensual:

- [ ] Revisar password admin (¿cambiar?)
- [ ] Actualizar documentación si cambió algo
- [ ] Verificar URLs funcionando
- [ ] Test completo del flujo

### Antes de cada evento:

- [ ] Crear evento nuevo en admin
- [ ] Activarlo
- [ ] Verificar desde tablet que aparece
- [ ] Test de registro completo
- [ ] Verificar export CSV funciona
