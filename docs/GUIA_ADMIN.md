# 📋 Guía de Uso - Panel Administrativo

## 🔐 Acceso al Panel

1. Abrir: http://localhost:8888/admin.html (o URL online)
2. Ingresar email y password (configurados en Firebase Console)
3. Click "Ingresar"

**⚠️ IMPORTANTE:** Cambiar esta contraseña después del primer uso.

---

## 📅 Crear un Nuevo Evento

### Paso a Paso:

1. **Entrar al panel admin**
2. **Click en botón "Nuevo Evento"**
3. **Completar datos:**
   - **ID del Evento:** Sin espacios, solo letras y guiones
     - Ejemplo: `sorteo-febrero-2026`
   - **Nombre del Evento:** Como aparecerá en la página
     - Ejemplo: `Sorteo Febrero 2026`
   - **Fecha Inicio:** Día que empieza el evento
   - **Fecha Fin:** Día que termina el evento
   - **Descripción:** (Opcional) Detalles del evento
   - **Activar inmediatamente:** Marcar si quieres que esté activo ya

4. **Click "Crear Evento"**

### ✅ Evento Creado

- Aparecerá en la lista de eventos
- Si lo activaste, ya pueden registrarse personas
- El nombre aparecerá en la página principal

---

## 🔄 Activar/Desactivar Evento

### ¿Cuándo usar?

- **Activar:** Cuando quieres que la gente pueda registrarse
- **Desactivar:** Cuando el evento terminó o no quieres más registros

### Cómo hacerlo:

1. Ver lista de eventos
2. Click en botón "Activar" o "Desactivar" del evento
3. ✅ Solo UN evento puede estar activo a la vez

**💡 IMPORTANTE:** Cuando cambias de evento activo, la tablet se actualiza automáticamente después de 30 minutos.

---

## 👥 Ver Registros de un Evento

1. En la lista de eventos, click "Ver Registros"
2. Verás tabla con:
   - DNI
   - Nombre completo
   - Email
   - Teléfono
   - Fecha de nacimiento
   - Hora de registro

### Buscar persona específica:
- Usar el cuadro de búsqueda
- Ingresar DNI
- La tabla filtra automáticamente

---

## 📥 Exportar Registros a Excel

### Paso a Paso:

1. **Abrir registros del evento** (Click "Ver Registros")
2. **Click botón "Exportar CSV"**
3. **Se descarga archivo** con nombre: `registros-NOMBRE-EVENTO.csv`

### Abrir en Excel:

1. Abrir Excel
2. Archivo → Abrir → Seleccionar el .csv descargado
3. Excel pedirá formato:
   - Delimitador: Coma
   - Codificación: UTF-8

### ¿Qué contiene?

- DNI
- Nombre
- Apellido  
- Email
- Teléfono
- Fecha de Nacimiento
- Evento
- Fecha y Hora de Registro

---

## 📊 Estadísticas

El panel muestra automáticamente:

- **Total de eventos** creados
- **Evento activo actual** (si hay)
- **Total de registros** en todos los eventos
- **Registros por evento**

---

## 🔒 Cerrar Sesión

1. Click botón "Cerrar Sesión" (arriba a la derecha)
2. Vuelve a pantalla de login
3. Sesión se cierra automáticamente después de 4 horas

---

## ⚠️ Cosas Importantes

### ✅ HACER:
- Activar solo UN evento a la vez
- Desactivar evento cuando termine
- Exportar registros regularmente como backup
- Cambiar la password por una propia

### ❌ NO HACER:
- Dejar varios eventos activos a la vez
- Compartir la password del admin
- Borrar eventos con registros (no se puede desde aquí)

---

## 🆘 Problemas Comunes

### No puedo crear evento:
- Verificar que el ID no tenga espacios
- Usar solo letras minúsculas, números y guiones

### No veo los registros:
- Verificar que seleccionaste el evento correcto
- Refrescar la página (F5)

### El evento no aparece en la página principal:
- Verificar que esté marcado como "Activo"
- Esperar 30 minutos para que la tablet actualice cache
- O limpiar cache del navegador

### No puedo exportar:
- Verificar que haya registros en el evento
- Intentar con otro navegador

---

## 📱 Usar desde Tablet

El panel admin funciona igual desde tablet:

1. Abrir navegador
2. Ir a URL del admin
3. Login con password
4. Usar normalmente

**💡 TIP:** Agregar a pantalla de inicio para acceso rápido.

---

## 🔐 Cambiar Password

**Método Temporal (hasta implementar Firebase Auth):**

1. Pedirle a sistemas que modifique el archivo:
   - `js/firebase-admin.js`
   - Sistema ahora usa Firebase Authentication completo
   - Cambiar por tu nueva password

2. Guardar archivo

3. Ya está - nueva password activa

**⚠️ IMPORTANTE:** Usar password segura:
- Mínimo 12 caracteres
- Letras mayúsculas y minúsculas
- Números
- Símbolos especiales
