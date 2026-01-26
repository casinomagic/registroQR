# 🎰 Sistema de Registro - Casino Magic Norte

Sistema web para registrar personas en eventos del casino usando DNI argentino.

## 📱 ¿Qué hace?

- Registra personas con DNI, nombre, apellido, email y teléfono
- Verifica si alguien ya se registró (no permite duplicados)
- Funciona desde tablet, celular o computadora
- Guarda todo en Firebase (base de datos en la nube)
- Permite exportar registros a Excel (CSV)

## 🌐 URLs del Sistema

**Formulario de Registro (para público):**
- Local: http://localhost:8888/
- Online: https://tu-usuario.github.io/registro-confluencia/

**Panel Administrativo (para staff):**
- Local: http://localhost:8888/admin.html
- Online: https://tu-usuario.github.io/registro-confluencia/admin.html

## 🔑 Credenciales

**Panel Admin:**
- Email: Configurar en Firebase Authentication
- Password: Configurar en Firebase Console
- Ver: [Guía de Seguridad](SEGURIDAD.md)

**Firebase Console:**
- URL: https://console.firebase.google.com/project/cmn-registrosqr
- Usuario: Tu cuenta de Google configurada

## 🚀 Inicio Rápido

### Para usar localmente:

1. Abrir terminal en la carpeta del proyecto
2. Ejecutar: `python -m http.server 8888`
3. Abrir navegador en: http://localhost:8888/

### Para usar desde tablet:

1. Conectar tablet a WiFi
2. Ir a la URL online del proyecto
3. Agregar a pantalla de inicio
4. Usar como app

## 📊 ¿Cómo funciona?

1. **Persona llega al evento**
2. **Staff abre formulario en tablet**
3. **Persona ingresa su DNI**
4. **Sistema verifica si ya está registrado**
   - Si NO: Muestra formulario completo
   - Si SÍ: Muestra mensaje "Ya registrado"
5. **Persona completa datos y envía**
6. **Sistema guarda en Firebase**
7. **Persona recibe confirmación**

## 📁 Archivos Importantes

- `index.html` - Formulario para público
- `admin.html` - Panel para staff
- `js/firebase-config.js` - Credenciales de Firebase
- `firestore.rules` - Reglas de seguridad

## 🆘 ¿Problemas?

Ver el archivo GUIA_SOPORTE.md para soluciones.

## 📞 Contacto

Casino Magic Norte - Sistemas
