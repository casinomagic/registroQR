# 📦 Deploy a Producción

## 🎯 ¿Qué es Deploy?

Es subir el sistema a internet para que funcione desde cualquier lugar (no solo local).

---

## 🌐 Opción 1: GitHub Pages (GRATIS)

### Ventajas:
- ✅ 100% gratis
- ✅ Fácil de configurar
- ✅ URL pública: https://tu-usuario.github.io/proyecto/
- ✅ Actualización automática cuando haces cambios

### Pasos:

#### 1. Crear cuenta en GitHub (si no tienes)
- Ir a: https://github.com/
- Click "Sign up"
- Seguir pasos

#### 2. Instalar Git (si no tienes)
- Windows: https://git-scm.com/download/win
- Instalar con opciones por defecto

#### 3. Preparar proyecto

Abrir terminal en carpeta del proyecto:

```bash
# Inicializar Git
git init

# Agregar todos los archivos
git add .

# Hacer primer commit
git commit -m "Sistema de registro v7.0"
```

#### 4. Crear repositorio en GitHub

1. Ir a GitHub.com (ya logueado)
2. Click botón "+" arriba derecha → "New repository"
3. Nombre: `registro-confluencia`
4. Público o Privado (como quieras)
5. **NO marcar** "Initialize with README"
6. Click "Create repository"

#### 5. Subir código

GitHub te muestra comandos. Usar estos:

```bash
# Conectar con GitHub
git remote add origin https://github.com/TU-USUARIO/registro-confluencia.git

# Subir código
git branch -M main
git push -u origin main
```

(Reemplazar TU-USUARIO con tu usuario de GitHub)

#### 6. Activar GitHub Pages

1. En tu repositorio, ir a **Settings**
2. Menú izquierdo: **Pages**
3. En "Source":
   - Branch: **main**
   - Folder: **/ (root)**
4. Click **Save**
5. Esperar 2-3 minutos

#### 7. Ver tu sitio online

GitHub te da URL:
```
https://TU-USUARIO.github.io/registro-confluencia/
```

¡Listo! Sistema funcionando en internet.

---

## 🔄 Actualizar después de cambios

Cuando modificas algo:

```bash
# Guardar cambios
git add .
git commit -m "Descripción del cambio"

# Subir a GitHub
git push
```

GitHub Pages actualiza automáticamente en 1-2 minutos.

---

## 📱 URLs Finales

Después del deploy:

**Formulario Público:**
```
https://TU-USUARIO.github.io/registro-confluencia/
```

**Panel Admin:**
```
https://TU-USUARIO.github.io/registro-confluencia/admin.html
```

**Para Tablet:**
- Abrir URL pública
- Agregar a pantalla de inicio
- Usar como app

---

## 🔐 Antes de Deploy - Checklist

Verificar:

- [ ] Password admin cambiada (no usar la de ejemplo)
- [ ] Firebase configurado correctamente
- [ ] Reglas Firestore deployed
- [ ] URLs de Firebase correctas en `js/firebase-config.js`
- [ ] Probado localmente todo funciona
- [ ] Archivos .min usándose (más rápido)

---

## ⚠️ Importante Después del Deploy

### 1. Verificar funcionamiento:

- Abrir URL pública
- Ver que carga correctamente
- Probar un registro de prueba
- Verificar que aparece en Firebase
- Probar admin panel

### 2. Configurar tablet:

- Conectar a WiFi
- Abrir URL pública
- Agregar a pantalla de inicio
- Probar registro completo

### 3. Backup de URLs:

Guardar en algún lugar seguro:
- URL del formulario
- URL del admin
- URL Firebase Console
- Password admin actual

---

## 🆘 Problemas Comunes Deploy

### "Permission denied" al hacer push:

**Solución:**
- GitHub pedirá usuario y password
- Usar: Personal Access Token (no password normal)
- GitHub → Settings → Developer settings → Personal access tokens
- Generar nuevo token con permisos "repo"
- Usar ese token como password

### Página no carga después del deploy:

**Solución:**
- Esperar 5 minutos (a veces tarda)
- Verificar Settings → Pages → que diga "Your site is published at..."
- Probar en navegador incógnito

### Error 404 en GitHub Pages:

**Solución:**
- Verificar que archivo se llame `index.html` (minúsculas)
- Verificar que esté en raíz del proyecto
- Push de nuevo si hiciste cambios

---

## 💡 Tips

### Dominio Custom (Opcional):

Si tienes dominio propio (ej: registros.casinomagic.com):

1. GitHub Pages → Custom domain
2. Agregar tu dominio
3. Configurar DNS en tu proveedor
4. Agregar registro CNAME apuntando a: `TU-USUARIO.github.io`

### HTTPS Automático:

GitHub Pages te da HTTPS gratis:
- `https://` funciona automáticamente
- No necesitas configurar nada

### Múltiples ambientes:

Si quieres ambiente de prueba:

1. Crear branch `desarrollo`
2. GitHub Pages puede publicar desde cualquier branch
3. URL testing: configurar en Settings → Pages

---

## 🚀 Deploy Alternativo: Firebase Hosting

Si prefieres hospedar en Firebase:

### Ventajas:
- ✅ También gratis (Spark plan)
- ✅ Más rápido que GitHub Pages
- ✅ Integrado con Firebase Console

### Pasos:

1. **Instalar Firebase CLI** (si no tienes):
```bash
npm install -g firebase-tools
```

2. **Login:**
```bash
firebase login
```

3. **Inicializar Hosting:**
```bash
firebase init hosting
```

Responder:
- Public directory: `.` (punto)
- Single-page app: `No`
- Overwrite index.html: `No`

4. **Deploy:**
```bash
firebase deploy --only hosting
```

5. **URL final:**
Firebase te da URL: `https://cmn-registrosqr.web.app/`

---

## 📊 Después del Deploy

### Monitoreo:

**GitHub Pages:**
- Ver commits en GitHub
- Ver tráfico en Insights → Traffic

**Firebase:**
- Firebase Console → Hosting → Ver métricas
- Ver cantidad de requests
- Ver países de acceso

### Analytics (Opcional):

Si quieres saber cuánta gente entra:

1. Agregar Google Analytics
2. Obtener código de seguimiento
3. Agregar en `index.html` antes de `</head>`

---

## ✅ Deploy Completo

Cuando termines todo:

- [ ] Código en GitHub
- [ ] GitHub Pages activo
- [ ] URL pública funcionando
- [ ] Tablet configurada con URL
- [ ] Admin panel accesible
- [ ] Firebase funcionando
- [ ] Backup de URLs guardado
- [ ] Equipo notificado de nueva URL

**¡Sistema en producción!** 🎉

---

## 📞 Si necesitas ayuda:

- GitHub Docs: https://docs.github.com/pages
- Firebase Hosting: https://firebase.google.com/docs/hosting
- Video tutoriales: YouTube "GitHub Pages tutorial"
