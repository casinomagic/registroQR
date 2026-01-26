# 🎰 Sistema de Registro - Casino Magic Norte

Sistema web para registrar personas en eventos del casino usando DNI argentino.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-orange)](https://firebase.google.com/)
[![GitHub Pages](https://img.shields.io/badge/Hosting-GitHub%20Pages-blue)](https://pages.github.com/)

## 🚀 Demo

- **Formulario de Registro:** [Ver Demo](#)
- **Panel Admin:** [Ver Admin](#)

## 📋 Características

- ✅ Registro de personas con DNI argentino
- ✅ Validación de duplicados en tiempo real
- ✅ Panel administrativo con Firebase Authentication
- ✅ Exportación de datos a CSV
- ✅ Multi-evento (un evento activo a la vez)
- ✅ Optimizado para tablets
- ✅ 100% Gratis (Firebase Spark Plan + GitHub Pages)
- ✅ Responsive (móvil, tablet, desktop)

## 🔧 Tecnologías

- HTML5 + CSS3 + JavaScript (Vanilla)
- Firebase Firestore (Base de datos)
- Firebase Authentication (Admin)
- GitHub Pages (Hosting)

## 📚 Documentación

Toda la documentación está en la carpeta [`docs/`](docs/):

- [📖 Índice General](docs/INDICE.md) - Empezar aquí
- [ℹ️ Información General](docs/README.md)
- [👥 Guía para Tablet](docs/GUIA_TABLET.md)
- [💼 Guía para Admin](docs/GUIA_ADMIN.md)
- [🔧 Guía de Soporte](docs/GUIA_SOPORTE.md)
- [🚀 Guía de Deploy](docs/GUIA_DEPLOY.md)
- [⚡ Referencia Rápida](docs/REFERENCIA_RAPIDA.md)

## ⚙️ Configuración Inicial

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/registro-confluencia.git
cd registro-confluencia
```

### 2. Configurar Firebase

1. **Crear proyecto en Firebase Console:**
   - Ir a https://console.firebase.google.com/
   - Crear nuevo proyecto
   - Habilitar Firestore Database
   - Habilitar Authentication (Email/Password)

2. **Obtener credenciales:**
   - Project Settings → General
   - En "Your apps" → Web app
   - Copiar las credenciales

3. **Actualizar `js/firebase-config.js`:**
   ```javascript
   const firebaseConfig = {
       apiKey: "TU_API_KEY",
       authDomain: "TU_PROJECT.firebaseapp.com",
       projectId: "TU_PROJECT_ID",
       // ... resto de credenciales
   };
   ```

### 3. Configurar Usuario Admin

1. **Firebase Console → Authentication → Users**
2. **Add user:**
   - Email: admin@tu-dominio.com
   - Password: (contraseña segura)
3. **Guardar credenciales de forma segura** (NO en el código)

### 4. Deploy Reglas de Firestore

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Deploy reglas
firebase deploy --only firestore:rules
```

### 5. Ejecutar Localmente

```bash
# Con Python
python -m http.server 8888

# Abrir en navegador
http://localhost:8888/
```

## 🔒 Seguridad

### ⚠️ IMPORTANTE: Credenciales Públicas

Este proyecto usa Firebase, cuyas **API Keys son seguras de compartir públicamente** según la [documentación oficial de Firebase](https://firebase.google.com/docs/projects/api-keys).

**La seguridad real está en:**
- ✅ **Firestore Rules** - Controlan acceso a datos
- ✅ **Firebase Authentication** - Solo usuarios autorizados
- ✅ **No hay contraseñas en el código**

### Configuración de Seguridad

1. **Usuario Admin:**
   - Crear en Firebase Console → Authentication
   - NO guardar contraseña en código
   - Compartir de forma segura con el equipo

2. **Firestore Rules:**
   - Deployed y activas (ver `firestore.rules`)
   - Solo lectura de eventos activos
   - Solo escritura si evento activo y DNI válido
   - Admin solo desde Firebase Console

3. **Variables Sensibles:**
   - Usar variables de entorno si es necesario
   - NO commitear archivos con credenciales privadas
   - Ver `.gitignore` para archivos excluidos

## 🚀 Deploy a Producción

### GitHub Pages (Recomendado)

```bash
# Push a GitHub
git add .
git commit -m "Deploy sistema registro"
git push origin main

# Activar GitHub Pages
# Settings → Pages → Source: main branch → Save
```

**URL Final:** `https://tu-usuario.github.io/registro-confluencia/`

Ver [Guía completa de Deploy](docs/GUIA_DEPLOY.md)

## 📊 Costos

**$0.00/mes** - Todo gratis:
- Firebase Firestore (Spark Plan): 50,000 lecturas/día
- Firebase Authentication: Ilimitados usuarios
- GitHub Pages: Hosting gratis

Ver [detalles de costos](docs/INFO_SISTEMA.md#costos-y-límites)

## 🤝 Contribuir

1. Fork el proyecto
2. Crear branch: `git checkout -b feature/nueva-caracteristica`
3. Commit: `git commit -m 'Agregar nueva característica'`
4. Push: `git push origin feature/nueva-caracteristica`
5. Crear Pull Request

## 📞 Soporte

- **Documentación:** [docs/](docs/)
- **Issues:** [GitHub Issues](#)
- **Firebase Status:** https://status.firebase.google.com/

## 📝 Licencia

MIT License - Ver [LICENSE](LICENSE) para más detalles.

## 🎯 Roadmap

- [ ] PWA (Progressive Web App)
- [ ] Notificaciones email
- [ ] Multi-evento simultáneo
- [ ] Dashboard analytics
- [ ] Integración WhatsApp

## ⭐ Créditos

Desarrollado por Casino Magic Norte - Sistemas

---

**Versión:** 7.0  
**Última actualización:** 26 de Enero, 2026
