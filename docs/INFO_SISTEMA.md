# 📊 Información del Sistema

## 🎰 Proyecto

**Nombre:** Sistema de Registro de Eventos  
**Cliente:** Casino Magic Norte  
**Versión:** 7.0  
**Fecha Actualización:** 26 de Enero, 2026

---

## 🔧 Tecnologías Usadas

### Frontend (Lo que ve el usuario):
- **HTML5** - Estructura de páginas
- **CSS3** - Diseños y estilos
- **JavaScript** - Lógica y funcionalidad
- **Bootstrap 5** - Diseño responsive (se adapta a tablet/celular)

### Backend (Base de datos):
- **Firebase Firestore** - Base de datos en la nube (Google)
- **Plan:** Spark (Gratis)

### Hosting (Dónde está publicado):
- **GitHub Pages** - Hosting gratuito
- **Python HTTP Server** - Para pruebas locales

---

## 🔑 Credenciales y Accesos

### Firebase Console:
- **URL:** https://console.firebase.google.com/project/cmn-registrosqr
- **Proyecto:** cmn-registrosqr
- **ID Proyecto:** 1:1326212971:web:aa0a4fac7e1be08ddd0e2e
- **Región:** us-central1

### Panel Admin:
- **URL Local:** http://localhost:8888/admin.html
- **URL Producción:** https://tu-usuario.github.io/registro-confluencia/admin.html
- **Autenticación:** Firebase Authentication (email + password)
- **Configurar en:** Firebase Console → Authentication → Users
- **Sesión expira:** 4 horas

### URLs Públicas:
- **Formulario:** /index.html (página principal)
- **Admin:** /admin.html
- **Tests:** /tests/ (páginas de prueba)

---

## 💾 Estructura de Base de Datos

### Firestore:

```
eventos/
├── [evento-id]/              (Ej: sorteo-febrero-2026)
│   ├── nombre: String        (Ej: "Sorteo Febrero 2026")
│   ├── activo: Boolean       (true = está activo)
│   ├── fechaInicio: Date
│   ├── fechaFin: Date
│   ├── descripcion: String
│   └── registros/            (Subcolección)
│       └── [dni]/            (Ej: 12345678)
│           ├── dni: String
│           ├── nombre: String
│           ├── apellido: String
│           ├── email: String
│           ├── telefono: String
│           ├── fechaNacimiento: String
│           ├── timestamp: Timestamp
│           ├── eventoId: String
│           └── eventoNombre: String
```

### Ejemplo Real:

```
eventos/
├── sorteo-febrero-2026/
│   ├── nombre: "Sorteo Febrero 2026"
│   ├── activo: true
│   └── registros/
│       ├── 12345678/
│       │   ├── nombre: "Juan"
│       │   ├── apellido: "Pérez"
│       │   └── ...
│       └── 87654321/
│           ├── nombre: "María"
│           └── ...
```

---

## 📁 Estructura de Archivos

### Archivos Principales:

```
REGISTRO CONFLUENCIA/
├── index.html              (Formulario público)
├── admin.html              (Panel administrativo)
├── css/
│   ├── styles.min.css      (Estilos formulario - optimizado)
│   └── admin.min.css       (Estilos admin - optimizado)
├── js/
│   ├── firebase-config.js       (Credenciales Firebase)
│   ├── firebase-db.min.js       (Operaciones base datos)
│   ├── firebase-admin.min.js    (Funciones admin)
│   ├── main-dni-optimized.min.js (Lógica principal)
│   ├── config.min.js            (Configuración general)
│   └── close-page.min.js        (Función cerrar página)
├── img/                    (Imágenes y logos)
├── tests/                  (Páginas de prueba)
└── firestore.rules         (Reglas de seguridad)
```

### Documentación:

```
├── README.md              (Información general)
├── GUIA_ADMIN.md          (Cómo usar panel admin)
├── GUIA_TABLET.md         (Cómo usar en tablet)
├── GUIA_SOPORTE.md        (Solución de problemas)
├── GUIA_DEPLOY.md         (Cómo publicar online)
└── INFO_SISTEMA.md        (Este archivo)
```

---

## ⚙️ Configuración Importante

### Firebase (archivo: js/firebase-config.js):

- **apiKey:** AIzaSyD2xMUZe67sbH2WAaq5MDwfsItvx-MjWgM
- **authDomain:** cmn-registrosqr.firebaseapp.com
- **projectId:** cmn-registrosqr
- **messagingSenderId:** 1326212971
- **appId:** 1:1326212971:web:aa0a4fac7e1be08ddd0e2e

### Cache (optimizado para tablet):

- **Tiempo de cache:** 30 minutos
- **Storage:** localStorage del navegador
- **Claves:**
  - `cmn_evento_activo` - Evento actual cacheado
  - `cmn_evento_timestamp` - Última actualización

### Modo DEBUG:

- **Por defecto:** OFF (false)
- **Activar:** Cambiar `DEBUG_MODE = true` en archivos JS
- **Ubicación:**
  - js/main-dni-optimized.js línea 14
  - js/firebase-db.js línea 11

---

## 💰 Costos y Límites

### Firebase Spark Plan (GRATIS):

**Firestore:**
- Lecturas: 50,000/día ✅
- Escrituras: 20,000/día ✅
- Almacenamiento: 1 GB ✅
- Egreso: 10 GB/mes ✅

**Uso Estimado Actual:**
- Con cache: ~100 lecturas/día (0.2% del límite)
- Escrituras: ~500/día (2.5% del límite)
- Almacenamiento: ~50 MB (5% del límite)

**Conclusión:** Sistema puede manejar fácilmente 1000+ registros/día gratis.

### GitHub Pages (GRATIS):

- Bandwidth: 100 GB/mes
- Storage: 1 GB
- Sin límite de visitas

---

## 📊 Performance

### Métricas Actuales:

- **First Paint:** ~1.2 segundos (3G)
- **Tamaño Total:** ~73 KB (JS + CSS minificados)
- **Cache Hit Rate:** 95% (con tablet)

### Optimizaciones Implementadas:

- ✅ Archivos minificados (-36% tamaño)
- ✅ Cache agresivo (95% menos lecturas)
- ✅ Console.log en modo DEBUG (mejor performance)
- ✅ Reglas Firestore optimizadas

---

## 🔒 Seguridad

### Firestore Rules:

- **Eventos:** Solo lectura de activos
- **Registros:** 
  - Crear: Solo si evento activo y DNI válido
  - Leer: Solo desde Firebase Console
  - Editar/Borrar: Bloqueado
- **Admin:** Solo desde Firebase Console

### Validaciones:

- DNI: 7-8 dígitos números
- Email: Formato válido (con @)
- Edad: Mayor de 18 años
- Campos requeridos: Todos obligatorios
- Duplicados: Verifica antes de guardar

---

## 🔄 Flujo del Sistema

### Registro de Persona:

1. Usuario abre index.html
2. Sistema carga evento activo (cache o Firestore)
3. Usuario ingresa DNI
4. Sistema verifica duplicado en Firestore
5. Si no existe → Muestra formulario
6. Usuario completa datos
7. Sistema valida campos
8. Sistema guarda en Firestore
9. Usuario ve mensaje de éxito

### Administración:

1. Admin abre admin.html
2. Ingresa password
3. Sistema valida y crea sesión (4 horas)
4. Admin ve lista de eventos
5. Puede crear/activar/desactivar eventos
6. Puede ver registros por evento
7. Puede exportar CSV

---

## 📱 Compatibilidad

### Navegadores Soportados:

- ✅ Chrome 90+ (Recomendado)
- ✅ Firefox 88+
- ✅ Safari 14+ (iOS/Mac)
- ✅ Edge 90+

### Dispositivos:

- ✅ Tablets (iPad, Android)
- ✅ Celulares (iPhone, Android)
- ✅ Computadoras (Windows, Mac, Linux)

### Responsive:

- Se adapta automáticamente a tamaño de pantalla
- Optimizado para tablets (uso principal)
- También funciona bien en celular y PC

---

## 🛠️ Comandos Útiles

### Servidor Local:

```bash
# Iniciar servidor
python -m http.server 8888

# Acceder
http://localhost:8888/
```

### Firebase:

```bash
# Login
firebase login

# Deploy reglas
firebase deploy --only firestore:rules

# Ver reglas activas
firebase firestore:rules:get
```

### Git:

```bash
# Estado
git status

# Guardar cambios
git add .
git commit -m "Descripción"

# Subir a GitHub
git push
```

---

## 📞 Recursos y Enlaces

### Documentación Oficial:

- **Firebase:** https://firebase.google.com/docs
- **Firestore:** https://firebase.google.com/docs/firestore
- **GitHub Pages:** https://pages.github.com/

### Estado de Servicios:

- **Firebase:** https://status.firebase.google.com/
- **GitHub:** https://www.githubstatus.com/

### Soporte:

- **Firebase Support:** https://firebase.google.com/support
- **GitHub Support:** https://support.github.com/

---

## 📈 Estadísticas de Uso

### Cómo ver:

**Firebase Console:**
1. Ir a Firebase Console
2. Usage and billing
3. Ver gráficos de:
   - Lecturas/Escrituras por día
   - Almacenamiento usado
   - Usuarios activos

**GitHub:**
1. Ir a repositorio
2. Insights → Traffic
3. Ver visitas y clones

---

## 🔄 Versionamiento

### Versión Actual: 7.0

**Cambios principales:**
- Sistema de cache para tablet (30 min)
- Minificación de archivos (-36%)
- Modo DEBUG condicional
- Reglas Firestore de producción
- Password admin mejorada
- Documentación completa

**Versiones Anteriores:**
- 6.0: Integración Firebase
- 5.0: Validación DNI argentina
- 4.0: Multi-evento
- 3.0: Panel admin básico

---

## ✅ Mantenimiento

### Tareas Regulares:

**Diario:**
- Verificar sistema funcionando
- Revisar registros del día

**Semanal:**
- Exportar backup Firestore
- Verificar uso de cuotas

**Mensual:**
- Archivar eventos antiguos
- Revisar password admin
- Actualizar documentación si hay cambios

---

## 📝 Notas Importantes

1. **Solo un evento activo a la vez** - Sistema está diseñado así
2. **Cache de 30 minutos** - Perfecto para uso continuo desde tablet
3. **Registros inmutables** - Una vez guardado, no se puede editar
4. **Backup automático** - Firestore guarda todo en la nube
5. **Gratis** - Todo el stack es sin costo (Spark plan + GitHub Pages)

---

**Última actualización:** 26 de Enero, 2026  
**Mantenido por:** Casino Magic Norte - Sistemas
