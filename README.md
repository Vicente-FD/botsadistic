# Bot de Discord - Monitor de Servidor Minecraft

Bot de Discord que monitorea automáticamente el estado de un servidor de Minecraft y actualiza un mensaje en un canal específico cada minuto.

## 🚀 Características

### Monitoreo del Servidor
- **Actualización automática** en un canal específico (intervalo configurable, por defecto 1 minuto)
- **Embeds mejorados** con formato profesional y colores según el estado
- **Timestamp de última actualización** visible en cada mensaje
- **Notificaciones automáticas** cuando el servidor cambia de estado (online ↔ offline)
- **Estadísticas completas**:
  - Estado del servidor (Online/Offline)
  - Jugadores conectados (con lista de nombres)
  - Versión del servidor (si está disponible)
  - Uptime estimado desde la primera detección online
- **Intervalo configurable** mediante variable de entorno
- Manejo robusto de errores y timeouts

### 💬 Integración Discord ↔ Minecraft
- **Mensajes Discord → Minecraft**: Los mensajes de un canal específico se envían automáticamente al servidor usando RCON
- Formato personalizado con `tellraw` (rojo, negrita)
- Reacciones automáticas para confirmar envío

### 🎵 Reproductor de Música
- **Reproducción desde Spotify y YouTube**
- Comandos slash: `/play`, `/stop`, `/pause`, `/queue`
- Cola de reproducción
- Control completo de reproducción

### ⚙️ Configuración
- Configuración mediante variables de entorno
- Fácil de desplegar en GitHub Actions
- Documentación completa

## 📋 Requisitos Previos

- Node.js 18 o superior
- Una aplicación de bot en Discord
- Acceso al servidor de Discord donde quieres usar el bot

## 🛠️ Instalación Local

### 1. Clonar el repositorio

```bash
git clone <tu-repositorio>
cd BOT-MC
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` basado en `env.example.txt`:

```bash
# En Windows PowerShell
Copy-Item env.example.txt .env

# En Linux/Mac
cp env.example.txt .env
```

Edita `.env` con tus valores:

```env
# Variables requeridas
DISCORD_TOKEN=tu_token_del_bot
MC_HOST=sadistic.holy.gg
MC_PORT=25621
CHANNEL_ID=1450170104514871307

# Variables opcionales
DISCORD_CLIENT_ID=tu_client_id  # Solo si usas comandos slash
GUILD_ID=770346277925552158     # ID del servidor
UPDATE_INTERVAL=60000           # Intervalo en ms (60000 = 1 minuto)
NOTIFICATION_CHANNEL_ID=1450170104514871307  # Canal para notificaciones (por defecto usa CHANNEL_ID)
```

**Variables de entorno:**
- `CHANNEL_ID` (requerido): ID del canal donde el bot actualizará el mensaje de estado
- `UPDATE_INTERVAL` (opcional): Intervalo de actualización en milisegundos (por defecto: 60000 = 1 minuto)
- `NOTIFICATION_CHANNEL_ID` (opcional): Canal donde se enviarán notificaciones de cambio de estado (por defecto usa `CHANNEL_ID`)

### 4. Ejecutar el bot

```bash
npm start
```

## 🤖 Crear la Aplicación del Bot en Discord

### Paso 1: Crear la aplicación

1. Ve a [Discord Developer Portal](https://discord.com/developers/applications)
2. Haz clic en **"New Application"**
3. Dale un nombre a tu aplicación (ej: "Minecraft Status Bot")
4. Acepta los términos y haz clic en **"Create"**

### Paso 2: Crear el bot

1. En el menú lateral, ve a **"Bot"**
2. Haz clic en **"Add Bot"** y confirma
3. En la sección **"Token"**, haz clic en **"Reset Token"** o **"Copy"** para obtener tu token
4. **⚠️ IMPORTANTE:** Guarda este token de forma segura. Lo necesitarás para `DISCORD_TOKEN`
5. Desactiva **"Public Bot"** si no quieres que otros usuarios lo agreguen
6. Activa las siguientes opciones en **"Privileged Gateway Intents"**:
   - ✅ **Server Members Intent** (si necesitas información de miembros)

### Paso 3: Obtener el Client ID

1. En el menú lateral, ve a **"General Information"**
2. Copia el **"Application ID"** - este es tu `DISCORD_CLIENT_ID`

### Paso 4: Invitar el bot al servidor

1. En el menú lateral, ve a **"OAuth2" > "URL Generator"**
2. En **"Scopes"**, selecciona:
   - ✅ `bot`
   - ✅ `applications.commands`
3. En **"Bot Permissions"**, selecciona:
   - ✅ `Send Messages`
   - ✅ `Use Slash Commands`
   - ✅ `Read Message History`
4. Copia la URL generada y ábrela en tu navegador
5. Selecciona el servidor donde quieres agregar el bot
6. Haz clic en **"Authorize"** y completa el CAPTCHA

## 🔧 Configuración de GitHub Secrets

Para ejecutar el bot en GitHub Actions, necesitas configurar los siguientes secrets:

1. Ve a tu repositorio en GitHub
2. Haz clic en **Settings** > **Secrets and variables** > **Actions**
3. Haz clic en **"New repository secret"** y agrega cada uno:

| Secret Name | Valor | Descripción |
|------------|-------|-------------|
| `DISCORD_TOKEN` | Tu token del bot | Token obtenido en el paso 2 de crear el bot (requerido) |
| `MC_HOST` | `sadistic.holy.gg` | Host del servidor Minecraft (requerido) |
| `MC_PORT` | `25621` | Puerto del servidor Minecraft (requerido) |
| `CHANNEL_ID` | `1450170104514871307` | ID del canal donde se actualizará el estado (requerido) |
| `UPDATE_INTERVAL` | `60000` | Intervalo de actualización en ms (opcional, por defecto: 60000) |
| `NOTIFICATION_CHANNEL_ID` | `1450170104514871307` | Canal para notificaciones (opcional, por defecto usa CHANNEL_ID) |

### Cómo obtener el Channel ID

1. En Discord, activa el **Modo Desarrollador**:
   - Ve a **Configuración de Usuario** > **Avanzado**
   - Activa **"Modo Desarrollador"**
2. Haz clic derecho en el canal donde quieres que el bot actualice el estado
3. Selecciona **"Copiar ID"**

## 🚢 Deploy Automático en GitHub Actions

### ⚠️ Advertencia Importante

**GitHub Actions NO es ideal como hosting 24/7** porque:
- Los runners tienen límites de tiempo de ejecución (máximo 6 horas por workflow)
- Los workflows pueden detenerse si no hay actividad
- No está diseñado para procesos de larga duración

**Alternativas recomendadas para hosting 24/7:**
- [Render](https://render.com) - Gratis con limitaciones
- [Railway](https://railway.app) - Plan gratuito disponible
- [Fly.io](https://fly.io) - Generoso plan gratuito
- [Heroku](https://www.heroku.com) - Opción popular
- VPS propio (DigitalOcean, Linode, etc.)

### 🚀 Configurar Deploy Automático

El workflow ya está configurado para ejecutarse automáticamente en cada commit. Sigue estos pasos:

#### Paso 1: Configurar GitHub Secrets

1. Ve a tu repositorio en GitHub
2. Haz clic en **Settings** > **Secrets and variables** > **Actions**
3. Haz clic en **"New repository secret"** y agrega cada uno:

| Secret Name | Valor | Descripción |
|------------|-------|-------------|
| `DISCORD_TOKEN` | Tu token del bot | Token obtenido en Discord Developer Portal (requerido) |
| `MC_HOST` | `sadistic.holy.gg` | Host del servidor Minecraft (requerido) |
| `MC_PORT` | `25621` | Puerto del servidor Minecraft (requerido) |
| `CHANNEL_ID` | `1450170104514871307` | ID del canal donde se actualizará el estado (requerido) |
| `UPDATE_INTERVAL` | `60000` | Intervalo de actualización en ms (opcional, por defecto: 60000) |

**Nota:** `NOTIFICATION_CHANNEL_ID` ya no es necesario ya que las notificaciones van a un canal fijo.

#### Paso 2: Hacer Push al Repositorio

Una vez configurados los secrets:

1. **Haz commit y push** de tus cambios:
   ```bash
   git add .
   git commit -m "Configurar bot de Discord"
   git push origin main
   ```

2. El workflow se ejecutará automáticamente en cada push a `main` o `master`

3. Puedes ver el progreso en **Actions** > **"Discord Minecraft Status Bot"**

#### Paso 3: Verificar el Deploy

1. Ve a la pestaña **Actions** en tu repositorio
2. Selecciona el workflow más reciente
3. Verifica que todos los pasos se completen correctamente
4. El bot debería estar ejecutándose y actualizando el estado en Discord

### 🔄 Deploy Automático en Cada Commit

El workflow está configurado para ejecutarse automáticamente en cada push a las ramas `main` o `master`. Esto significa que:

- ✅ Cada vez que hagas `git push`, el bot se desplegará automáticamente
- ✅ Los cambios se aplicarán inmediatamente
- ✅ El bot anterior se detendrá y se iniciará uno nuevo con los cambios

### 📊 Monitoreo del Bot

- **Logs:** Puedes ver los logs del bot en la pestaña **Actions** > selecciona el workflow > **"Ejecutar bot"**
- **Estado:** El bot mostrará su estado en el canal de Discord configurado
- **Notificaciones:** Los cambios de estado se enviarán al canal `1245191628973539349`

### ⚙️ Ejecución Manual

También puedes ejecutar el workflow manualmente:

1. Ve a **Actions** > **"Discord Minecraft Status Bot"**
2. Haz clic en **"Run workflow"**
3. Selecciona la rama y haz clic en **"Run workflow"**

## 📝 Estructura del Proyecto

```
BOT-MC/
├── .github/
│   └── workflows/
│       └── bot.yml          # Workflow de GitHub Actions
├── src/
│   ├── index.js             # Bot principal con actualización automática
│   ├── registerCommands.js  # Registro de comandos slash (ya no se usa)
│   └── mcStatus.js          # Consulta del estado de Minecraft
├── env.example.txt          # Ejemplo de variables de entorno
├── .gitignore               # Archivos ignorados por git
├── package.json             # Dependencias y scripts
└── README.md                # Esta documentación
```

## 🎮 Uso del Bot

Una vez que el bot esté ejecutándose:

1. El bot **automáticamente** creará un mensaje embed en el canal especificado (`CHANNEL_ID`)
2. El mensaje se **actualizará automáticamente** según el intervalo configurado (por defecto cada 1 minuto)
3. El mensaje embed mostrará:
   - 🟢 **Estado** (Online/Offline) con colores según el estado
   - 👥 **Jugadores conectados** (X/Y)
   - 📋 **Lista de jugadores** (hasta 10 nombres, con contador si hay más)
   - 📦 **Versión del servidor**
   - 📝 **MOTD** (Message of the Day)
   - ⚡ **Latencia** del servidor en milisegundos
   - ⏱️ **Uptime estimado** (desde la primera detección online)
   - 📊 **Historial reciente** de cambios de estado (últimos 5 cambios)
   - 🕐 **Timestamp** de última actualización

### 🔔 Notificaciones de Cambio de Estado

El bot enviará notificaciones automáticas cuando:
- El servidor pasa de **offline a online** 🟢
- El servidor pasa de **online a offline** 🔴

Las notificaciones se envían al canal especificado en `NOTIFICATION_CHANNEL_ID` (o al `CHANNEL_ID` por defecto).

**Nota:** El bot editará el mismo mensaje cada vez para mantener el canal limpio. Si el mensaje se elimina, el bot creará uno nuevo automáticamente.

## 🔍 Solución de Problemas

### El bot no actualiza el mensaje en el canal

1. Verifica que el bot esté online en tu servidor
2. Asegúrate de que el `CHANNEL_ID` sea correcto
3. Verifica que el bot tenga permisos para **enviar y editar mensajes** en ese canal
4. Revisa la consola del bot para ver si hay errores

### Error: "CHANNEL_ID no está definido"

- Asegúrate de tener un archivo `.env` con todas las variables requeridas
- Verifica que `CHANNEL_ID` esté configurado correctamente
- El bot necesita: `DISCORD_TOKEN`, `MC_HOST`, `MC_PORT`, y `CHANNEL_ID`

### El servidor no responde / siempre muestra offline

- Verifica que `MC_HOST` y `MC_PORT` sean correctos
- Asegúrate de que el servidor de Minecraft esté accesible desde internet
- Verifica que el servidor no tenga un firewall bloqueando el puerto

### Error de permisos en Discord

- Asegúrate de que el bot tenga los permisos necesarios en el servidor:
  - **Enviar Mensajes**
  - **Gestionar Mensajes** (para poder editar el mensaje de estado)
  - **Ver el Canal**
- Verifica que hayas invitado el bot con el scope `bot`

## 📄 Licencia

MIT

## 👤 Autor

Creado para monitorear el estado del servidor de Minecraft.

