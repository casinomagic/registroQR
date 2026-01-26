# 🔐 Guía de Configuración Segura

## ⚠️ IMPORTANTE: Este repositorio es PÚBLICO

**NO incluir contraseñas en el código.**

## 🔑 Credenciales Requeridas

### 1. Firebase Configuration (PÚBLICO - OK)

Las credenciales de Firebase en `js/firebase-config.js` son **seguras de compartir**:

```javascript
const firebaseConfig = {
    apiKey: "AIzaSyD2xMUZe67sbH2WAaq5MDwfsItvx-MjWgM",  // ✅ Público OK
    authDomain: "cmn-registrosqr.firebaseapp.com",      // ✅ Público OK
    projectId: "cmn-registrosqr",                       // ✅ Público OK
    // ... resto de config
};
```

**¿Por qué es seguro?**
- Estas son API keys del lado del cliente (browser)
- La seguridad real está en Firestore Rules
- Documentación oficial: https://firebase.google.com/docs/projects/api-keys

### 2. Usuario Admin (PRIVADO - NO compartir)

**Configurar en Firebase Console:**

1. Ir a: https://console.firebase.google.com/project/TU-PROYECTO/authentication
2. Click "Add user"
3. Email: `admin@tu-dominio.com`
4. Password: (contraseña segura - mínimo 12 caracteres)
5. Click "Add user"

**✅ CORRECTO:** Crear usuario en Firebase Console  
**❌ INCORRECTO:** Poner password en código fuente

### 3. Compartir Credenciales con Equipo

**Usar herramientas seguras:**
- 1Password / LastPass (gestores de contraseñas)
- Compartir en persona
- Email encriptado
- NO compartir por Slack/WhatsApp sin encriptar

## 🔒 Firestore Rules (Seguridad de Datos)

Las reglas en `firestore.rules` controlan quién puede leer/escribir:

```javascript
// Eventos: Solo lectura pública de activos
allow read: if resource.data.activo == true;

// Registros: Solo crear con validaciones
allow create: if request.resource.data.dni == dni 
              && isValidDNI(dni)
              && isEventoActivo(eventoId);
```

**Deploy reglas:**
```bash
firebase deploy --only firestore:rules
```

## 📋 Checklist Pre-Deploy Público

Antes de hacer push a GitHub:

- [ ] NO hay contraseñas hardcoded
- [ ] firebase-config.js con credenciales públicas (OK)
- [ ] .gitignore actualizado
- [ ] Firestore Rules deployed
- [ ] Usuario admin creado en Firebase Console
- [ ] Documentación actualizada sin contraseñas

## 🚫 Archivos que NUNCA subir

Asegurar que están en `.gitignore`:

```
.env
.env.local
config.private.js
credentials.json
serviceAccountKey.json
```

## ✅ Archivos que SÍ subir

```
js/firebase-config.js   ✅ API Keys públicas (seguro)
firestore.rules         ✅ Reglas de seguridad
admin.html              ✅ Sin contraseñas hardcoded
```

## 🔐 Rotación de Credenciales

Si una contraseña se compromete:

1. **Usuario Admin:**
   - Firebase Console → Authentication → Users
   - Click en usuario → Reset password
   - Enviar nuevo password de forma segura

2. **API Keys (si necesario):**
   - Firebase Console → Project Settings
   - "Restricciones de API key" (opcional)
   - Regenerar keys si es crítico

## 🆘 Si Subiste Contraseña por Error

**URGENTE:**

1. **Cambiar contraseña inmediatamente:**
   - Firebase Console → Authentication
   - Reset password del usuario

2. **Eliminar del historial Git:**
   ```bash
   # Reescribir historial (PELIGROSO)
   git filter-branch --force --index-filter \
   "git rm --cached --ignore-unmatch ruta/archivo" \
   --prune-empty --tag-name-filter cat -- --all
   
   # Force push (cuidado)
   git push origin --force --all
   ```

3. **Mejor opción: Nuevo repositorio:**
   - Crear nuevo repo
   - Copiar archivos limpios
   - NO copiar .git/

## 📞 Recursos

- **Firebase Security:** https://firebase.google.com/docs/rules
- **API Keys:** https://firebase.google.com/docs/projects/api-keys
- **GitHub Security:** https://docs.github.com/en/code-security

---

**Última actualización:** 26 de Enero, 2026
