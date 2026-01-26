# ⚡ Referencia Rápida

## 🔗 URLs Importantes

| Qué es | URL Local | URL Producción |
|--------|-----------|----------------|
| **Formulario** | http://localhost:8888/ | https://tu-usuario.github.io/registro-confluencia/ |
| **Admin** | http://localhost:8888/admin.html | https://tu-usuario.github.io/registro-confluencia/admin.html |
| **Firebase** | https://console.firebase.google.com/project/cmn-registrosqr | - |

---

## 🔑 Accesos Rápidos

| Sistema | Credencial |
|---------|------------|
| **Admin Panel** | Configurar en Firebase Console - Ver Guía de Seguridad |
| **Firebase Console** | Tu cuenta Google |
| **GitHub** | Tu usuario GitHub |

---

## 📱 Tablet - Inicio Rápido

1. Conectar WiFi
2. Abrir URL producción
3. Agregar a pantalla inicio
4. Verificar nombre de evento visible
5. ✅ Listo para registrar

---

## 👥 Registrar Persona - Pasos

1. Pedir DNI
2. Ingresar en sistema
3. Click "Continuar"
4. Si no registrado → Completar formulario
5. Click "Enviar"
6. ✅ Siguiente persona

---

## 📅 Crear Evento - Pasos

1. Ir a admin.html
2. Login con password
3. Click "Nuevo Evento"
4. Completar:
   - ID: sorteo-febrero-2026
   - Nombre: Sorteo Febrero 2026
   - Fechas
   - ✓ Activar
5. Click "Crear"
6. ✅ Evento listo

---

## 📥 Exportar Registros - Pasos

1. Admin panel
2. "Ver Registros" del evento
3. Click "Exportar CSV"
4. Abrir con Excel
5. ✅ Datos descargados

---

## 🆘 Problemas Comunes - Soluciones

| Problema | Solución |
|----------|----------|
| No carga página | Verificar WiFi → Recargar (F5) |
| Error al registrar | Ver evento activo en admin |
| DNI duplicado no detecta | Limpiar cache: Ctrl+F5 |
| Admin no acepta password | Verificar credenciales en Firebase Console |
| No aparece nombre evento | Esperar 30 min o limpiar cache |

---

## 🔧 Comandos Útiles

```bash
# Iniciar servidor local
python -m http.server 8888

# Deploy Firebase rules
firebase deploy --only firestore:rules

# Ver estado Git
git status

# Subir cambios
git add .
git commit -m "Mensaje"
git push
```

---

## 💾 Backup Rápido

**Firestore:**
1. Firebase Console
2. Firestore → Menú (⋮)
3. Import/Export → Export
4. ✅ Backup guardado

**Datos en Papel (Emergencia):**
```
DNI: _________
Nombre: _________
Apellido: _________
Email: _________
Teléfono: _________
Fecha Nac: _________
```

---

## 📊 Ver Estadísticas

**Firebase Console:**
- Usage and billing → Ver gráficos

**Admin Panel:**
- Muestra automáticamente al entrar

---

## 🔒 Seguridad - Checklist

- [ ] Password cambiada (no usar ejemplo)
- [ ] Solo personal autorizado conoce password
- [ ] Firestore rules deployed
- [ ] Backup regular

---

## 🚀 Deploy Rápido

```bash
git init
git add .
git commit -m "Sistema v7.0"
git remote add origin https://github.com/USUARIO/REPO.git
git push -u origin main
```

GitHub → Settings → Pages → Branch: main → Save

✅ Online en 2-3 minutos

---

## 📱 Tablet - Checklist Pre-Evento

- [ ] Tablet cargada (80%+)
- [ ] WiFi conectado
- [ ] App abierta
- [ ] Nombre evento visible
- [ ] Test registro funcionando
- [ ] Cargador cerca

---

## 🔍 Debug Rápido

**Activar logs:**
- Editar archivos JS
- `DEBUG_MODE = false` → `DEBUG_MODE = true`
- Guardar
- Ver consola (F12)

**Limpiar cache:**
```javascript
localStorage.clear();
location.reload();
```

---

## 💰 Límites Gratis

| Recurso | Límite | Uso Actual |
|---------|--------|------------|
| Firestore lecturas | 50,000/día | ~100/día |
| Firestore escrituras | 20,000/día | ~500/día |
| Almacenamiento | 1 GB | ~50 MB |
| **Costo** | **$0** | **$0** |

✅ Muy lejos de límites

---

## 📞 Contactos Urgentes

| Qué | Dónde |
|-----|-------|
| Firebase Status | https://status.firebase.google.com/ |
| Firebase Support | https://firebase.google.com/support |
| GitHub Status | https://www.githubstatus.com/ |

---

## 📚 Documentación Completa

- **README.md** - Información general
- **GUIA_ADMIN.md** - Usar panel admin
- **GUIA_TABLET.md** - Usar en tablet
- **GUIA_SOPORTE.md** - Solucionar problemas
- **GUIA_DEPLOY.md** - Publicar online
- **INFO_SISTEMA.md** - Datos técnicos
- **REFERENCIA_RAPIDA.md** - Este archivo

---

## ⏱️ Tiempos Estimados

| Tarea | Tiempo |
|-------|--------|
| Registrar 1 persona | 2 min |
| Crear evento | 3 min |
| Exportar CSV | 1 min |
| Deploy a producción | 15 min |
| Configurar tablet | 5 min |
| Backup Firestore | 2 min |

---

## ✅ Sistema OK - Verificar

- [ ] Firebase Console accesible
- [ ] URL formulario carga
- [ ] URL admin carga
- [ ] Evento activo configurado
- [ ] Nombre evento visible
- [ ] Test registro funciona
- [ ] Export CSV funciona
- [ ] Tablet configurada

---

**💡 TIP:** Imprime esta página para tener a mano durante eventos.

---

**Versión:** 7.0  
**Actualizado:** 26 Enero 2026
