# 🚀 Guía de Deploy Automático

Esta guía te ayudará a configurar el deploy automático del bot en GitHub Actions.

## 📋 Requisitos Previos

- Repositorio de GitHub creado
- Bot de Discord creado y configurado
- Acceso al repositorio con permisos de administrador

## 🔧 Paso 1: Configurar GitHub Secrets

Los secrets son variables de entorno seguras que GitHub Actions usará para ejecutar el bot.

### 1.1 Acceder a los Secrets

1. Ve a tu repositorio en GitHub
2. Haz clic en **Settings** (Configuración)
3. En el menú lateral, ve a **Secrets and variables** > **Actions**
4. Haz clic en **"New repository secret"**

### 1.2 Agregar los Secrets Requeridos

Agrega cada uno de estos secrets:

#### `DISCORD_TOKEN` (Requerido)
- **Valor:** Tu token del bot de Discord
- **Cómo obtenerlo:**
  1. Ve a [Discord Developer Portal](https://discord.com/developers/applications)
  2. Selecciona tu aplicación
  3. Ve a **Bot** > **Token**
  4. Haz clic en **"Copy"** o **"Reset Token"**

#### `MC_HOST` (Requerido)
- **Valor:** `sadistic.holy.gg`
- **Descripción:** Host del servidor de Minecraft

#### `MC_PORT` (Requerido)
- **Valor:** `25621`
- **Descripción:** Puerto del servidor de Minecraft

#### `CHANNEL_ID` (Requerido)
- **Valor:** `1450170104514871307`
- **Descripción:** ID del canal donde el bot actualizará el estado
- **Cómo obtenerlo:**
  1. En Discord, activa el **Modo Desarrollador** (Configuración > Avanzado)
  2. Haz clic derecho en el canal
  3. Selecciona **"Copiar ID"**

#### `UPDATE_INTERVAL` (Opcional)
- **Valor:** `60000` (1 minuto en milisegundos)
- **Descripción:** Intervalo de actualización del estado
- **Nota:** Si no lo configuras, usará 60000 por defecto

## 🚀 Paso 2: Hacer el Primer Deploy

### 2.1 Preparar el Repositorio

```bash
# Asegúrate de estar en la rama main o master
git checkout main

# Agrega todos los archivos
git add .

# Haz commit
git commit -m "Configurar bot de Discord para deploy automático"

# Haz push
git push origin main
```

### 2.2 Verificar el Deploy

1. Ve a la pestaña **Actions** en tu repositorio
2. Deberías ver un workflow ejecutándose llamado **"Discord Minecraft Status Bot"**
3. Haz clic en el workflow para ver el progreso
4. Espera a que todos los pasos se completen (✓ verde)

## 🔄 Deploy Automático en Cada Commit

Una vez configurado, cada vez que hagas `git push`:

1. ✅ GitHub Actions detectará el cambio automáticamente
2. ✅ Ejecutará el workflow
3. ✅ El bot se desplegará con los nuevos cambios
4. ✅ El bot anterior se detendrá y se iniciará uno nuevo

### Ejemplo de Flujo de Trabajo

```bash
# 1. Hacer cambios en el código
# ... editar archivos ...

# 2. Hacer commit
git add .
git commit -m "Mejorar funcionalidad X"

# 3. Hacer push (esto activará el deploy automático)
git push origin main

# 4. El bot se desplegará automáticamente en GitHub Actions
```

## 📊 Monitoreo y Logs

### Ver Logs del Bot

1. Ve a **Actions** en tu repositorio
2. Selecciona el workflow más reciente
3. Haz clic en **"Ejecutar bot"**
4. Verás los logs en tiempo real

### Verificar que el Bot Funciona

1. Ve al canal de Discord configurado (`CHANNEL_ID`)
2. Deberías ver un mensaje del bot con el estado del servidor
3. El mensaje se actualizará cada minuto (o según `UPDATE_INTERVAL`)

## ⚠️ Limitaciones de GitHub Actions

**Importante:** GitHub Actions tiene limitaciones:

- ⏱️ **Tiempo máximo:** 6 horas por ejecución
- 🔄 **Reinicio:** Si el workflow se detiene, necesitarás hacer push nuevamente
- 💰 **Límites:** Los repositorios públicos tienen más minutos gratuitos que los privados

### Soluciones para Hosting 24/7

Si necesitas que el bot funcione 24/7 sin interrupciones, considera:

1. **Render** (https://render.com)
   - Plan gratuito disponible
   - Deploy automático desde GitHub
   - Hosting 24/7

2. **Railway** (https://railway.app)
   - Plan gratuito generoso
   - Deploy automático
   - Muy fácil de usar

3. **Fly.io** (https://fly.io)
   - Plan gratuito
   - Excelente para bots de Discord

4. **VPS Propio**
   - Control total
   - Sin límites de tiempo
   - Requiere más configuración

## 🐛 Solución de Problemas

### El workflow no se ejecuta

- Verifica que estés haciendo push a `main` o `master`
- Revisa que el archivo `.github/workflows/bot.yml` exista
- Verifica que no haya errores de sintaxis en el workflow

### El bot no se conecta

- Verifica que `DISCORD_TOKEN` sea correcto
- Asegúrate de que el bot esté invitado al servidor
- Revisa los logs en **Actions** para ver errores específicos

### El bot no actualiza el mensaje

- Verifica que `CHANNEL_ID` sea correcto
- Asegúrate de que el bot tenga permisos en el canal
- Revisa los logs para ver errores de permisos

## 📝 Notas Adicionales

- El bot se ejecutará mientras el workflow esté activo
- Cada push reiniciará el bot con los nuevos cambios
- Los logs se mantienen en GitHub Actions por 90 días
- Puedes cancelar un workflow manualmente desde la interfaz de GitHub

## ✅ Checklist de Deploy

- [ ] Secrets configurados en GitHub
- [ ] Código subido al repositorio
- [ ] Workflow ejecutándose correctamente
- [ ] Bot conectado en Discord
- [ ] Mensaje de estado visible en el canal
- [ ] Actualización automática funcionando

¡Listo! Tu bot debería estar funcionando y desplegándose automáticamente en cada commit. 🎉


